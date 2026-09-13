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
import { canTransition, type Referral, type ReferralStatus } from './domain.js';

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

const safeUser = (user: typeof users[number]) => ({ id: user.id, username: user.username, displayName: user.displayName, role: user.role, facilityId: user.facilityId });
const patientName = (patientId: string) => {
  const p = patients.find(x => x.id === patientId);
  return p ? `${p.firstName} ${p.surname}` : patientId;
};
const facilityName = (facilityId: string) => facilities.find(f => f.id === facilityId)?.name ?? facilityId;

function visibleReferralsFor(user: typeof users[number]) {
  if (['ADMIN','MANAGER','AUDITOR'].includes(user.role)) return referrals;
  if (!user.facilityId) return [];
  return referrals.filter(r => r.sourceFacilityId === user.facilityId || r.destinationFacilityId === user.facilityId);
}
function canReadPatient(user: typeof users[number], patientId: string) {
  if (['ADMIN','MANAGER','AUDITOR'].includes(user.role)) return true;
  return visibleReferralsFor(user).some(r => r.patientId === patientId) || (user.role === 'CLINICIAN' && user.facilityId === 'fac-clinic-1');
}
function roleCanTransition(role: string, to: ReferralStatus) {
  if (role === 'ADMIN') return true;
  if (role === 'CLINICIAN') return ['SUBMITTED','CANCELLED'].includes(to);
  if (role === 'COORDINATOR') return ['RECEIVED','INFO_REQUESTED','ACCEPTED','DECLINED','REDIRECTED','SCHEDULED','PATIENT_NOTIFIED','ATTENDED','MISSED','FEEDBACK_PENDING','FOLLOWUP_REQUIRED','CLOSED'].includes(to);
  if (role === 'MANAGER') return ['REOPENED'].includes(to);
  return false;
}
function logAudit(actor: string, action: string, objectType: string, objectId: string, source: 'UI'|'VOICE'|'AI'|'SYSTEM', outcome: 'SUCCESS'|'DENIED' = 'SUCCESS', reason?: string) {
  auditEvents.unshift({ id: randomUUID(), at: new Date().toISOString(), actor, action, objectType, objectId, source, outcome, reason });
}

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'carepath-api', version: '0.1.0', syntheticData: true }));

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
  const actor = req.currentUser!.displayName;
  const userId = req.currentUser!.id;
  req.session.destroy(() => {
    logAudit(actor, 'auth.logout', 'User', userId, 'UI');
    res.json({ ok: true });
  });
});

app.get('/api/auth/me', auth, (req, res) => res.json({ user: safeUser(req.currentUser!), syntheticData: true }));

app.get('/api/dashboard', auth, (req, res) => {
  const scoped = visibleReferralsFor(req.currentUser!);
  const stale = scoped.filter(r => ['SUBMITTED','RECEIVED','INFO_REQUESTED'].includes(r.status) && Date.now() - Date.parse(r.updatedAt) > 24 * 3600000);
  const scheduled = scoped.filter(r => r.status === 'SCHEDULED');
  const visiblePatients = patients.filter(p => canReadPatient(req.currentUser!, p.id));
  res.json({
    syntheticData: true,
    metrics: {
      patients: visiblePatients.length,
      openReferrals: scoped.filter(r => !['CLOSED','CANCELLED','DECLINED'].includes(r.status)).length,
      awaitingAcceptance: scoped.filter(r => ['SUBMITTED','RECEIVED','INFO_REQUESTED'].includes(r.status)).length,
      scheduled: scheduled.length,
      stale: stale.length,
      facilities: facilities.length
    },
    staleReferrals: stale.map(r => ({ ...r, patientName: patientName(r.patientId), destinationName: facilityName(r.destinationFacilityId) })),
    recentAudit: auditEvents.slice(0, 6)
  });
});

app.get('/api/patients', auth, (req, res) => {
  const list = patients.filter(p => canReadPatient(req.currentUser!, p.id));
  res.json({ syntheticData: true, patients: list.map(p => ({ ...p, allergies: p.allergies.length, conditions: p.conditions.length, medications: p.medications.length, results: p.results.length, encounters: p.encounters.length })) });
});
app.get('/api/patients/:id', auth, (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  if (!patient) return res.status(404).json({ error: 'Patient not found' });
  if (!canReadPatient(req.currentUser!, patient.id)) { logAudit(req.currentUser!.displayName, 'patient.read', 'Patient', patient.id, 'UI', 'DENIED', 'Facility/role scope'); return res.status(403).json({ error: 'Not authorised for this patient' }); }
  logAudit(req.currentUser!.displayName, 'patient.read', 'Patient', patient.id, 'UI');
  res.json({ patient, referrals: referrals.filter(r => r.patientId === patient.id && visibleReferralsFor(req.currentUser!).some(v => v.id === r.id)).map(r => ({ ...r, sourceFacilityName: facilityName(r.sourceFacilityId), destinationFacilityName: facilityName(r.destinationFacilityId) })) });
});

app.get('/api/facilities', auth, (_req, res) => res.json({ facilities }));
app.get('/api/referrals', auth, (req, res) => {
  const staleOnly = req.query.filter === 'stale';
  let list = visibleReferralsFor(req.currentUser!);
  if (staleOnly) list = list.filter(r => ['SUBMITTED','RECEIVED','INFO_REQUESTED'].includes(r.status) && Date.now() - Date.parse(r.updatedAt) > 24 * 3600000);
  res.json({ referrals: list.map(r => ({ ...r, patientName: patientName(r.patientId), sourceFacilityName: facilityName(r.sourceFacilityId), destinationFacilityName: facilityName(r.destinationFacilityId) })) });
});

app.post('/api/referrals', auth, requireRole('CLINICIAN','ADMIN'), (req, res) => {
  const { patientId, service, reason, destinationFacilityId, priority = 'ROUTINE' } = req.body || {};
  if (!patients.some(p => p.id === patientId) || !canReadPatient(req.currentUser!, patientId)) return res.status(400).json({ error: 'Invalid or unauthorised patient' });
  if (!facilities.some(f => f.id === destinationFacilityId)) return res.status(400).json({ error: 'Invalid destination facility' });
  if (!service || !reason) return res.status(400).json({ error: 'Service and reason are required' });
  const referral: Referral = {
    id: `ref-${Date.now()}`,
    patientId,
    service,
    reason,
    sourceFacilityId: req.currentUser!.facilityId || 'fac-clinic-1',
    destinationFacilityId,
    owner: req.currentUser!.displayName,
    status: 'DRAFT',
    priority: priority === 'PRIORITY' ? 'PRIORITY' : 'ROUTINE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    events: [{ id: randomUUID(), at: new Date().toISOString(), actor: req.currentUser!.displayName, to: 'DRAFT', note: 'Referral draft created', source: 'UI' }]
  };
  referrals.unshift(referral);
  logAudit(req.currentUser!.displayName, 'referral.create_draft', 'Referral', referral.id, 'UI');
  res.status(201).json({ referral });
});

app.post('/api/referrals/:id/transition', auth, (req, res) => {
  const referral = referrals.find(r => r.id === req.params.id);
  if (!referral) return res.status(404).json({ error: 'Referral not found' });
  const to = String(req.body?.to || '') as ReferralStatus;
  if (!roleCanTransition(req.currentUser!.role, to)) {
    logAudit(req.currentUser!.displayName, 'referral.transition', 'Referral', referral.id, 'UI', 'DENIED', `Role ${req.currentUser!.role} cannot transition to ${to}`);
    return res.status(403).json({ error: 'Role is not authorised for this transition' });
  }
  if (!visibleReferralsFor(req.currentUser!).some(r => r.id === referral.id)) {
    logAudit(req.currentUser!.displayName, 'referral.transition', 'Referral', referral.id, 'UI', 'DENIED', 'Facility scope');
    return res.status(403).json({ error: 'Referral outside authorised facility scope' });
  }
  if (!canTransition(referral.status, to)) {
    logAudit(req.currentUser!.displayName, 'referral.transition', 'Referral', referral.id, 'UI', 'DENIED', `Invalid transition ${referral.status} -> ${to}`);
    return res.status(409).json({ error: `Invalid transition from ${referral.status} to ${to}` });
  }
  const from = referral.status;
  referral.status = to;
  referral.updatedAt = new Date().toISOString();
  referral.events.unshift({ id: randomUUID(), at: referral.updatedAt, actor: req.currentUser!.displayName, from, to, note: String(req.body?.note || `Status changed to ${to}`), source: 'UI' });
  logAudit(req.currentUser!.displayName, `referral.${to.toLowerCase()}`, 'Referral', referral.id, 'UI');
  res.json({ referral });
});

app.get('/api/audit', auth, requireRole('AUDITOR','MANAGER','ADMIN'), (_req, res) => res.json({ auditEvents }));

app.post('/api/ayanda', auth, (req, res) => {
  const input = String(req.body?.input || '').slice(0, 1000);
  if (!input.trim()) return res.status(400).json({ error: 'Input is required' });
  const response = answerAyanda(input, { patients: patients.filter(p => canReadPatient(req.currentUser!, p.id)), referrals: visibleReferralsFor(req.currentUser!), facilities });
  logAudit(req.currentUser!.displayName, 'ai.query', 'AIInteraction', randomUUID(), req.body?.source === 'VOICE' ? 'VOICE' : 'AI');
  res.json(response);
});

app.post('/api/ayanda/execute', auth, requireRole('CLINICIAN','ADMIN'), (req, res) => {
  if (req.body?.confirmed !== true) return res.status(400).json({ error: 'Explicit confirmation is required' });
  const action = req.body?.action;
  if (action?.tool !== 'create_referral_draft' || action.patientId !== 'pat-thandi' || !canReadPatient(req.currentUser!, action.patientId)) return res.status(400).json({ error: 'Unsupported, invalid or unauthorised action' });
  const referral: Referral = {
    id: `ref-${Date.now()}`,
    patientId: action.patientId,
    service: 'Cardiology',
    reason: 'AI-assisted draft for cardiology review; clinician must verify clinical rationale',
    sourceFacilityId: req.currentUser!.facilityId || 'fac-clinic-1',
    destinationFacilityId: action.destinationFacilityId || 'fac-hosp-2',
    owner: req.currentUser!.displayName,
    status: 'DRAFT',
    priority: 'ROUTINE',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    events: [{ id: randomUUID(), at: new Date().toISOString(), actor: req.currentUser!.displayName, to: 'DRAFT', note: 'Draft created after explicit human confirmation', source: 'AI' }]
  };
  referrals.unshift(referral);
  logAudit(req.currentUser!.displayName, 'ai.tool.create_referral_draft', 'Referral', referral.id, 'AI');
  res.status(201).json({ referral, text: 'Referral draft created. It remains a draft until an authorised clinician reviews and submits it.' });
});

if (production) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const webDist = path.resolve(__dirname, '../../web/dist');
  app.use(express.static(webDist));
  app.get('*splat', (_req, res) => res.sendFile(path.join(webDist, 'index.html')));
}

app.listen(port, () => console.log(`CarePath API listening on ${port}`));
