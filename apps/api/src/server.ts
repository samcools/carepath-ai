import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { facilities, patients, referrals, auditEvents, users } from './data.js';
import { requireAuth, requireRole } from './auth.js';
import { answerAyanda } from './ayanda.js';
import { getOpenAISettings, testOpenAISettings, updateOpenAISettings } from './aiSettings.js';
import { canTransition, type CareOutcome, type Referral, type ReferralStatus, type Role } from './domain.js';

const app = express();
const port = Number(process.env.PORT || 8080);
const webOrigin = process.env.WEB_ORIGIN || 'http://localhost:5173';
const production = process.env.NODE_ENV === 'production';

app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: production ? undefined : false }));
app.use(cors({ origin: webOrigin, credentials: true }));
app.use(express.json({ limit: '512kb' }));
app.use(session({
  name: 'carepath.sid',
  secret: process.env.SESSION_SECRET || 'development-only-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: production, maxAge: 8 * 60 * 60 * 1000 }
}));

const auth = requireAuth(users);
const managementRoles: Role[] = ['ADMIN','MANAGER','AUDITOR'];
const safeUser = (user: typeof users[number]) => ({ id: user.id, username: user.username, displayName: user.displayName, role: user.role, facilityId: user.facilityId, patientId: user.patientId });
const patientName = (patientId: string) => { const p = patients.find(x => x.id === patientId); return p ? `${p.firstName} ${p.surname}` : patientId; };
const facilityName = (facilityId: string) => facilities.find(f => f.id === facilityId)?.name ?? facilityId;

function visibleReferralsFor(user: typeof users[number]) {
  if (managementRoles.includes(user.role)) return referrals;
  if (user.role === 'PATIENT') return referrals.filter(r => r.patientId === user.patientId);
  if (!user.facilityId) return [];
  return referrals.filter(r => r.sourceFacilityId === user.facilityId || r.destinationFacilityId === user.facilityId);
}

function visiblePatientIdsFor(user: typeof users[number]) {
  if (managementRoles.includes(user.role)) return new Set(patients.map(p => p.id));
  if (user.role === 'PATIENT') return new Set(user.patientId ? [user.patientId] : []);
  const ids = new Set(visibleReferralsFor(user).map(r => r.patientId));
  const ownFacility = user.facilityId ? facilityName(user.facilityId) : '';
  if (ownFacility) {
    for (const p of patients) {
      const items = [...p.allergies, ...p.conditions, ...p.medications, ...p.results, ...p.encounters];
      if (items.some(i => i.sourceFacility === ownFacility)) ids.add(p.id);
    }
  }
  return ids;
}

function canReadPatient(user: typeof users[number], patientId: string) { return visiblePatientIdsFor(user).has(patientId); }

function roleCanTransition(role: Role, to: ReferralStatus) {
  if (role === 'ADMIN') return true;
  if (role === 'CLINICIAN') return ['SUBMITTED','CANCELLED'].includes(to);
  if (['COORDINATOR','SPECIALIST'].includes(role)) return ['RECEIVED','INFO_REQUESTED','ACCEPTED','DECLINED','REDIRECTED','SCHEDULED','PATIENT_NOTIFIED','ATTENDED','MISSED','FEEDBACK_PENDING','FOLLOWUP_REQUIRED','CLOSED'].includes(to);
  if (role === 'NURSE') return ['PATIENT_NOTIFIED','ATTENDED','MISSED','FOLLOWUP_REQUIRED'].includes(to);
  if (role === 'PATIENT_NAVIGATOR') return ['PATIENT_NOTIFIED','FOLLOWUP_REQUIRED','SCHEDULED'].includes(to);
  if (role === 'MANAGER') return ['REOPENED'].includes(to);
  return false;
}

function logAudit(actor: string, action: string, objectType: string, objectId: string, source: 'UI'|'VOICE'|'AI'|'SYSTEM', outcome: 'SUCCESS'|'DENIED' = 'SUCCESS', reason?: string) {
  auditEvents.unshift({ id: randomUUID(), at: new Date().toISOString(), actor, action, objectType, objectId, source, outcome, reason });
}

function referralView(r: Referral) {
  return { ...r, patientName: patientName(r.patientId), sourceFacilityName: facilityName(r.sourceFacilityId), destinationFacilityName: facilityName(r.destinationFacilityId) };
}

function outcomeSummary(source: Referral[]) {
  const hospitalFacilities = facilities.filter(f => f.type === 'PUBLIC' || f.type === 'PRIVATE');
  return hospitalFacilities.map(f => {
    const referred = source.filter(r => r.destinationFacilityId === f.id);
    const withOutcome = referred.filter(r => r.outcome && r.outcome !== 'UNKNOWN');
    const count = (outcome: CareOutcome) => withOutcome.filter(r => r.outcome === outcome).length;
    const recovered = count('RECOVERED');
    const improved = count('IMPROVED');
    const deceased = count('DECEASED');
    const ongoing = count('ONGOING');
    const favourable = recovered + improved;
    const resolved = favourable + deceased;
    const favourableObservedPct = resolved ? Math.round((favourable / resolved) * 100) : null;
    const acknowledged = referred.filter(r => r.acknowledgedAt);
    const medianAckHours = acknowledged.length ? Math.round(acknowledged.map(r => Math.max(0, (Date.parse(r.acknowledgedAt!) - Date.parse(r.createdAt)) / 3600000)).sort((a,b)=>a-b)[Math.floor(acknowledged.length/2)] * 10) / 10 : null;
    return { facilityId: f.id, facilityName: f.name, type: f.type, province: f.province, referred: referred.length, outcomesRecorded: withOutcome.length, recovered, improved, deceased, ongoing, unknown: referred.length - withOutcome.length, favourableObservedPct, medianAckHours };
  }).filter(x => x.referred > 0).sort((a,b) => (b.favourableObservedPct ?? -1) - (a.favourableObservedPct ?? -1));
}

function accessProfile(role: Role) {
  const matrix: Record<Role, string[]> = {
    ADMIN: ['All synthetic records','User/role administration','OpenAI API settings','Audit','All referral actions','Outcome analytics'],
    CLINICIAN: ['Scoped patient records','Create/submit referrals','Ayanda governed actions','Care gaps','Outcome analytics'],
    SPECIALIST: ['Receiving-facility patients','Accept/coordinate referrals','Record referral outcome','Care gaps','Outcome analytics'],
    NURSE: ['Receiving-facility patient context','Attendance/follow-up updates','Patient navigation'],
    COORDINATOR: ['Receiving/referring queues','Scheduling','Referral transitions','Record outcomes','Patient navigation'],
    PHARMACIST: ['Scoped medication context','Medication reconciliation view','Patient record provenance'],
    LAB_TECH: ['Scoped result context','Diagnostic-result provenance'],
    PATIENT_NAVIGATOR: ['Scoped referrals','Appointments/follow-up','Patient communication workflow'],
    MANAGER: ['All synthetic operational data','Outcome analytics','Command Centre','Audit','Aggregated performance'],
    AUDITOR: ['Read-only records','Audit/provenance','Access-event review'],
    PATIENT: ['Own synthetic OneRecord','Own referrals','Own Health Passport']
  };
  return matrix[role];
}

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'carepath-api', version: '0.2.0', syntheticData: true }));

app.post('/api/auth/login', async (req, res) => {
  const username = String(req.body?.username || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const user = users.find(u => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ error: 'Invalid demo credentials' });
  req.session.userId = user.id;
  logAudit(user.displayName, 'auth.login', 'User', user.id, 'UI');
  res.json({ user: safeUser(user), syntheticData: true });
});

app.post('/api/auth/logout', auth, (req, res) => {
  const actor = req.currentUser!.displayName; const userId = req.currentUser!.id;
  req.session.destroy(() => { logAudit(actor, 'auth.logout', 'User', userId, 'UI'); res.json({ ok: true }); });
});
app.get('/api/auth/me', auth, (req, res) => res.json({ user: safeUser(req.currentUser!), syntheticData: true, access: accessProfile(req.currentUser!.role) }));
app.get('/api/access/profile', auth, (req, res) => res.json({ role: req.currentUser!.role, access: accessProfile(req.currentUser!.role) }));

app.get('/api/dashboard', auth, (req, res) => {
  const scoped = visibleReferralsFor(req.currentUser!);
  const stale = scoped.filter(r => ['SUBMITTED','RECEIVED','INFO_REQUESTED'].includes(r.status) && Date.now() - Date.parse(r.updatedAt) > 24 * 3600000);
  const scheduled = scoped.filter(r => r.status === 'SCHEDULED' || r.status === 'PATIENT_NOTIFIED');
  const visiblePatients = patients.filter(p => canReadPatient(req.currentUser!, p.id));
  const outcomes = scoped.filter(r => r.outcome && r.outcome !== 'UNKNOWN');
  res.json({ syntheticData: true,
    metrics: {
      patients: visiblePatients.length,
      openReferrals: scoped.filter(r => !['CLOSED','CANCELLED','DECLINED'].includes(r.status)).length,
      awaitingAcceptance: scoped.filter(r => ['SUBMITTED','RECEIVED','INFO_REQUESTED'].includes(r.status)).length,
      scheduled: scheduled.length,
      stale: stale.length,
      facilities: facilities.length,
      outcomesRecorded: outcomes.length,
      recoveredOrImproved: outcomes.filter(r => ['RECOVERED','IMPROVED'].includes(r.outcome!)).length,
      deceased: outcomes.filter(r => r.outcome === 'DECEASED').length
    },
    staleReferrals: stale.slice(0,8).map(referralView),
    recentAudit: auditEvents.slice(0, 7),
    outcomeSnapshot: outcomeSummary(scoped).slice(0,5)
  });
});

app.get('/api/patients', auth, (req, res) => {
  const list = patients.filter(p => canReadPatient(req.currentUser!, p.id));
  const q = String(req.query.q || '').trim().toLowerCase();
  const filtered = q ? list.filter(p => `${p.firstName} ${p.surname} ${p.syntheticId}`.toLowerCase().includes(q)) : list;
  res.json({ syntheticData: true, patients: filtered.map(p => ({ ...p, allergies: p.allergies.length, conditions: p.conditions.length, medications: p.medications.length, results: p.results.length, encounters: p.encounters.length })) });
});

app.get('/api/patients/:id', auth, (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  if (!patient) return res.status(404).json({ error: 'Patient not found' });
  if (!canReadPatient(req.currentUser!, patient.id)) { logAudit(req.currentUser!.displayName, 'patient.read', 'Patient', patient.id, 'UI', 'DENIED', 'Role/facility scope'); return res.status(403).json({ error: 'Not authorised for this patient' }); }
  logAudit(req.currentUser!.displayName, 'patient.read', 'Patient', patient.id, 'UI');
  const patientReferrals = referrals.filter(r => r.patientId === patient.id && visibleReferralsFor(req.currentUser!).some(v => v.id === r.id)).map(referralView);
  res.json({ patient, referrals: patientReferrals });
});

app.get('/api/passport/:id?', auth, (req, res) => {
  const requested = req.params.id || req.currentUser!.patientId || visiblePatientIdsFor(req.currentUser!)[Symbol.iterator]().next().value;
  if (!requested || !canReadPatient(req.currentUser!, requested)) return res.status(403).json({ error: 'No authorised Health Passport patient available' });
  const patient = patients.find(p => p.id === requested);
  if (!patient) return res.status(404).json({ error: 'Patient not found' });
  const patientReferrals = referrals.filter(r => r.patientId === patient.id && visibleReferralsFor(req.currentUser!).some(v => v.id === r.id)).map(referralView);
  res.json({ patient, referrals: patientReferrals, accessNotice: 'Synthetic demo Health Passport. Sharing and consent controls are illustrative.' });
});

app.post('/api/passport/:id/share', auth, (req, res) => {
  const patientId = req.params.id;
  if (!canReadPatient(req.currentUser!, patientId)) return res.status(403).json({ error: 'Not authorised for this patient' });
  if (!['PATIENT','ADMIN'].includes(req.currentUser!.role)) return res.status(403).json({ error: 'Patient-directed sharing is limited to the patient or administrator in this demo' });
  const token = `DEMO-${randomUUID().slice(0,8).toUpperCase()}`;
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  logAudit(req.currentUser!.displayName, 'passport.share.create', 'Patient', patientId, 'UI');
  res.json({ token, expiresAt, demoOnly: true, message: 'Synthetic one-time share code created for demonstration. No live external sharing occurs.' });
});

app.get('/api/facilities', auth, (_req, res) => res.json({ facilities }));

app.get('/api/referrals', auth, (req, res) => {
  const staleOnly = req.query.filter === 'stale';
  let list = visibleReferralsFor(req.currentUser!);
  if (staleOnly) list = list.filter(r => ['SUBMITTED','RECEIVED','INFO_REQUESTED'].includes(r.status) && Date.now() - Date.parse(r.updatedAt) > 24 * 3600000);
  res.json({ referrals: list.map(referralView) });
});

app.post('/api/referrals', auth, requireRole('CLINICIAN','ADMIN'), (req, res) => {
  const { patientId, service, reason, destinationFacilityId, priority = 'ROUTINE' } = req.body || {};
  if (!patients.some(p => p.id === patientId) || !canReadPatient(req.currentUser!, patientId)) return res.status(400).json({ error: 'Invalid or unauthorised patient' });
  if (!facilities.some(f => f.id === destinationFacilityId)) return res.status(400).json({ error: 'Invalid destination facility' });
  if (!service || !reason) return res.status(400).json({ error: 'Service and reason are required' });
  const referral: Referral = {
    id: `ref-${Date.now()}`, patientId, service: String(service).slice(0,120), reason: String(reason).slice(0,600),
    sourceFacilityId: req.currentUser!.facilityId || 'fac-clinic-1', destinationFacilityId, owner: req.currentUser!.displayName,
    status: 'DRAFT', priority: priority === 'PRIORITY' ? 'PRIORITY' : 'ROUTINE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    events: [{ id: randomUUID(), at: new Date().toISOString(), actor: req.currentUser!.displayName, to: 'DRAFT', note: 'Referral draft created', source: 'UI' }]
  };
  referrals.unshift(referral); logAudit(req.currentUser!.displayName, 'referral.create_draft', 'Referral', referral.id, 'UI');
  res.status(201).json({ referral: referralView(referral) });
});

app.post('/api/referrals/:id/transition', auth, (req, res) => {
  const referral = referrals.find(r => r.id === req.params.id);
  if (!referral) return res.status(404).json({ error: 'Referral not found' });
  const to = String(req.body?.to || '') as ReferralStatus;
  if (!roleCanTransition(req.currentUser!.role, to)) { logAudit(req.currentUser!.displayName, 'referral.transition', 'Referral', referral.id, 'UI', 'DENIED', `Role ${req.currentUser!.role} cannot transition to ${to}`); return res.status(403).json({ error: 'Role is not authorised for this transition' }); }
  if (!visibleReferralsFor(req.currentUser!).some(r => r.id === referral.id)) { logAudit(req.currentUser!.displayName, 'referral.transition', 'Referral', referral.id, 'UI', 'DENIED', 'Facility scope'); return res.status(403).json({ error: 'Referral outside authorised facility scope' }); }
  if (!canTransition(referral.status, to)) { logAudit(req.currentUser!.displayName, 'referral.transition', 'Referral', referral.id, 'UI', 'DENIED', `Invalid transition ${referral.status} -> ${to}`); return res.status(409).json({ error: `Invalid transition from ${referral.status} to ${to}` }); }
  const from = referral.status; referral.status = to; referral.updatedAt = new Date().toISOString();
  if (to === 'RECEIVED' && !referral.acknowledgedAt) referral.acknowledgedAt = referral.updatedAt;
  referral.events.unshift({ id: randomUUID(), at: referral.updatedAt, actor: req.currentUser!.displayName, from, to, note: String(req.body?.note || `Status changed to ${to}`).slice(0,400), source: 'UI' });
  logAudit(req.currentUser!.displayName, `referral.${to.toLowerCase()}`, 'Referral', referral.id, 'UI');
  res.json({ referral: referralView(referral) });
});

app.post('/api/referrals/:id/outcome', auth, requireRole('SPECIALIST','COORDINATOR','MANAGER','ADMIN'), (req, res) => {
  const referral = referrals.find(r => r.id === req.params.id);
  if (!referral || !visibleReferralsFor(req.currentUser!).some(r => r.id === referral.id)) return res.status(404).json({ error: 'Referral not found in authorised scope' });
  const allowed: CareOutcome[] = ['RECOVERED','IMPROVED','ONGOING','DECEASED','UNKNOWN'];
  const outcome = String(req.body?.outcome || '') as CareOutcome;
  if (!allowed.includes(outcome)) return res.status(400).json({ error: 'Invalid outcome' });
  referral.outcome = outcome; referral.outcomeAt = new Date().toISOString(); referral.outcomeNote = String(req.body?.note || `Synthetic outcome recorded: ${outcome}`).slice(0,500); referral.updatedAt = referral.outcomeAt;
  logAudit(req.currentUser!.displayName, 'referral.outcome.record', 'Referral', referral.id, 'UI');
  res.json({ referral: referralView(referral) });
});

app.get('/api/outcomes', auth, (req, res) => {
  if (req.currentUser!.role === 'PATIENT') return res.status(403).json({ error: 'Outcome analytics are not available in the patient role' });
  const scoped = managementRoles.includes(req.currentUser!.role) ? referrals : visibleReferralsFor(req.currentUser!);
  res.json({
    syntheticData: true,
    disclaimer: 'Observed synthetic outcomes only. These values are not risk-adjusted, do not represent real hospitals and must not be interpreted as a clinical quality ranking.',
    methodology: 'Shows referral volume and recorded synthetic outcomes. A production comparison would require validated outcome definitions, case-mix/risk adjustment, confidence intervals, minimum sample sizes and governance review.',
    facilities: outcomeSummary(scoped)
  });
});

app.get('/api/caregaps', auth, (req, res) => {
  if (req.currentUser!.role === 'PATIENT') return res.status(403).json({ error: 'Operational care-gap queue is not available in the patient role' });
  const scopedReferrals = visibleReferralsFor(req.currentUser!);
  const scopedPatients = patients.filter(p => canReadPatient(req.currentUser!, p.id));
  const gaps: any[] = [];
  for (const r of scopedReferrals) {
    if (['SUBMITTED','RECEIVED','INFO_REQUESTED'].includes(r.status) && Date.now() - Date.parse(r.updatedAt) > 24*3600000) gaps.push({ id:`gap-ref-${r.id}`, type:'REFERRAL_DELAY', severity:'HIGH', patientId:r.patientId, patientName:patientName(r.patientId), detail:`Referral ${r.id} has been waiting more than 24 hours`, action:'Review referral ownership and next permitted action' });
    if (r.status === 'MISSED' || r.status === 'FOLLOWUP_REQUIRED') gaps.push({ id:`gap-follow-${r.id}`, type:'FOLLOW_UP', severity:'MEDIUM', patientId:r.patientId, patientName:patientName(r.patientId), detail:`Referral ${r.id} requires follow-up`, action:'Confirm patient contact and rescheduling workflow' });
  }
  for (const p of scopedPatients.slice(0,25)) {
    if (!p.results.length) gaps.push({ id:`gap-data-${p.id}`, type:'DATA_COMPLETENESS', severity:'LOW', patientId:p.id, patientName:`${p.firstName} ${p.surname}`, detail:'No diagnostic result is present in the current synthetic longitudinal record', action:'Verify whether a result exists in an authorised source system' });
  }
  res.json({ syntheticData:true, definition:'Operational and information continuity gaps only; not clinical diagnoses.', gaps:gaps.slice(0,40) });
});

app.get('/api/audit', auth, requireRole('AUDITOR','MANAGER','ADMIN'), (_req, res) => res.json({ auditEvents }));

app.get('/api/admin/users', auth, requireRole('ADMIN'), (_req, res) => res.json({ users: users.map(safeUser), roles: [...new Set(users.map(u=>u.role))] }));
app.get('/api/admin/openai-settings', auth, requireRole('ADMIN'), (_req, res) => res.json(getOpenAISettings()));
app.put('/api/admin/openai-settings', auth, requireRole('ADMIN'), (req, res) => {
  const settings = updateOpenAISettings({ enabled:req.body?.enabled, model:req.body?.model, baseUrl:req.body?.baseUrl, apiKey:req.body?.apiKey, allowSyntheticDemoData:req.body?.allowSyntheticDemoData });
  logAudit(req.currentUser!.displayName, 'admin.openai_settings.update', 'AISettings', 'openai', 'UI');
  res.json(settings);
});
app.post('/api/admin/openai-settings/test', auth, requireRole('ADMIN'), async (req, res) => {
  try { const result = await testOpenAISettings(); logAudit(req.currentUser!.displayName, 'admin.openai_settings.test', 'AISettings', 'openai', 'UI', result.ok?'SUCCESS':'DENIED', result.message); res.status(result.ok?200:400).json(result); }
  catch (error: any) { res.status(502).json({ ok:false, message:error?.message || 'OpenAI connection test failed' }); }
});

app.post('/api/ayanda', auth, async (req, res) => {
  const input = String(req.body?.input || '').slice(0, 1000);
  if (!input.trim()) return res.status(400).json({ error: 'Input is required' });
  const response = await answerAyanda(input, { patients: patients.filter(p => canReadPatient(req.currentUser!, p.id)), referrals: visibleReferralsFor(req.currentUser!), facilities });
  logAudit(req.currentUser!.displayName, 'ai.query', 'AIInteraction', randomUUID(), req.body?.source === 'VOICE' ? 'VOICE' : 'AI');
  res.json(response);
});

app.post('/api/ayanda/execute', auth, requireRole('CLINICIAN','ADMIN'), (req, res) => {
  if (req.body?.confirmed !== true) return res.status(400).json({ error: 'Explicit confirmation is required' });
  const action = req.body?.action;
  if (action?.tool !== 'create_referral_draft' || !action.patientId || !canReadPatient(req.currentUser!, action.patientId)) return res.status(400).json({ error: 'Unsupported, invalid or unauthorised action' });
  const destination = facilities.find(f => f.id === action.destinationFacilityId);
  if (!destination) return res.status(400).json({ error: 'Invalid destination' });
  const referral: Referral = {
    id: `ref-${Date.now()}`, patientId: action.patientId, service: String(action.service || 'Specialist review').slice(0,120),
    reason: `AI-assisted draft for ${String(action.service || 'specialist').toLowerCase()} review; clinician must verify clinical rationale`,
    sourceFacilityId: req.currentUser!.facilityId || 'fac-clinic-1', destinationFacilityId: destination.id, owner: req.currentUser!.displayName,
    status: 'DRAFT', priority: 'ROUTINE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    events: [{ id: randomUUID(), at: new Date().toISOString(), actor: req.currentUser!.displayName, to: 'DRAFT', note: 'Draft created after explicit human confirmation', source: 'AI' }]
  };
  referrals.unshift(referral); logAudit(req.currentUser!.displayName, 'ai.tool.create_referral_draft', 'Referral', referral.id, 'AI');
  res.status(201).json({ referral: referralView(referral), text: 'Referral draft created. It remains a draft until an authorised clinician reviews and submits it.' });
});

if (production) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const webDist = path.resolve(__dirname, '../../web/dist');
  app.use(express.static(webDist));
  app.get('*splat', (_req, res) => res.sendFile(path.join(webDist, 'index.html')));
}

app.listen(port, () => console.log(`CarePath API listening on ${port}`));
