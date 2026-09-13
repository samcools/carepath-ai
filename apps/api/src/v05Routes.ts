import express, { type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { appointments, auditEvents, bedCapacity, facilities, patients, referrals, users } from './data.js';
import { requireAuth } from './auth.js';
import type { DemoUser, Role } from './domain.js';

const router = express.Router();
const auth = requireAuth(users);
router.use(auth);

const clinicalRoles: Role[] = ['ADMIN','CLINICIAN','SPECIALIST','NURSE','COORDINATOR','PATIENT_NAVIGATOR'];
const emergencyRoles: Role[] = ['ADMIN','CLINICIAN','SPECIALIST','NURSE'];
const managementRoles: Role[] = ['ADMIN','MANAGER','AUDITOR'];
const populationRoles: Role[] = ['ADMIN','MANAGER','AUDITOR'];
const workspaceRoles: Role[] = ['ADMIN','CLINICIAN','SPECIALIST','NURSE','COORDINATOR','PHARMACIST','LAB_TECH','PATIENT_NAVIGATOR'];
const now = () => new Date().toISOString();
const hoursAgo = (iso:string) => Math.max(0,(Date.now()-Date.parse(iso))/3600000);
const patientName = (id:string) => { const p=patients.find(x=>x.id===id); return p ? `${p.firstName} ${p.surname}` : id; };
const facilityName = (id:string) => facilities.find(f=>f.id===id)?.name ?? id;
const cityOf = (facilityId:string) => { const f=facilities.find(x=>x.id===facilityId); return f?.city || f?.district || 'Unknown'; };
const availableBeds = (facilityId:string) => bedCapacity.filter(c=>c.facilityId===facilityId).reduce((sum,c)=>sum+Math.max(0,c.staffedBeds-c.occupiedBeds-c.reservedBeds),0);

function allowed(role:Role, roles:Role[]) { return roles.includes(role); }
function canSeePatient(user:DemoUser, patientId:string) {
  if (managementRoles.includes(user.role)) return true;
  if (user.role === 'PATIENT') return user.patientId === patientId;
  if (!user.facilityId) return false;
  return referrals.some(r=>r.patientId===patientId && (r.sourceFacilityId===user.facilityId || r.destinationFacilityId===user.facilityId)) || appointments.some(a=>a.patientId===patientId && a.facilityId===user.facilityId);
}
function deny(res:Response,message='Not authorised for this action'){return res.status(403).json({error:message});}
function requirePatientScope(req:Request,res:Response,patientId:string){const user=req.currentUser!;if(canSeePatient(user,patientId)||activeGrant(user.id,patientId))return true;deny(res,'Patient is outside the authorised scope for this session');return false;}
function audit(user:DemoUser,action:string,objectType:string,objectId:string,outcome:'SUCCESS'|'DENIED'='SUCCESS',reason?:string){auditEvents.unshift({id:randomUUID(),at:now(),actor:user.displayName,action,objectType,objectId,source:'UI',outcome,reason});}

export interface ConsentRecord {
  id:string; patientId:string; purpose:'CARE'|'EMERGENCY'|'SHARING'; status:'ACTIVE'|'REVOKED'|'EXPIRED';
  shareWithCareTeam:boolean; allowPatientMessaging:boolean; allowCaregiverProxy:boolean; updatedAt:string; updatedBy:string; synthetic:true;
}
export interface BreakGlassGrant {
  id:string; patientId:string; userId:string; userName:string; facilityId:string|null; reason:string; createdAt:string; expiresAt:string; status:'ACTIVE'|'EXPIRED'|'REVOKED'; synthetic:true;
}
export interface CareTask {
  id:string; patientId?:string; referralId?:string; title:string; detail:string; ownerRole:Role; ownerUserId?:string; facilityId?:string|null;
  priority:'LOW'|'MEDIUM'|'HIGH'; status:'OPEN'|'IN_PROGRESS'|'DONE'; dueAt:string; createdAt:string; source:'WORKFLOW'|'WATCH'|'USER'; synthetic:true;
}
export interface CarePlanRecord {
  id:string; patientId:string; title:string; goal:string; owner:string; facilityId:string; status:'ACTIVE'|'COMPLETED'|'ON_HOLD'; reviewAt:string; interventions:string[]; updatedAt:string; synthetic:true;
}
export interface ClinicalDocument {
  id:string; patientId:string; type:'DISCHARGE_SUMMARY'|'SPECIALIST_REPORT'|'IMAGING_REPORT'|'CARE_DOCUMENT'; title:string; sourceFacilityId:string; recordedAt:string; summary:string; status:'FINAL'|'PRELIMINARY'; synthetic:true;
}
export interface WatchFinding {
  id:string; type:string; severity:'INFO'|'WARNING'|'CRITICAL'; patientId?:string; referralId?:string; facilityId?:string; owner:string;
  rule:string; evidence:string; recommendedAction:string; detectedAt:string; source:'RULE';
}

const consentRecords:ConsentRecord[] = patients.map((p,i)=>({id:`consent-${p.id}`,patientId:p.id,purpose:'CARE',status:'ACTIVE',shareWithCareTeam:true,allowPatientMessaging:i%7!==0,allowCaregiverProxy:i%13===0,updatedAt:new Date(Date.now()-(i%30)*86400000).toISOString(),updatedBy:i===0?'Thandi Mokoena':'Synthetic patient preference',synthetic:true}));
const breakGlassGrants:BreakGlassGrant[]=[];
const careTasks:CareTask[]=[];
for(let i=0;i<Math.min(referrals.length,36);i++){
  const r=referrals[i];
  if(['CLOSED','CANCELLED','DECLINED'].includes(r.status)) continue;
  careTasks.push({id:`task-v05-${i+1}`,patientId:r.patientId,referralId:r.id,title:i%3===0?'Confirm referral acknowledgement':i%3===1?'Prepare referral hand-off':'Contact patient for next step',detail:`Synthetic care-coordination task for ${r.service}.`,ownerRole:i%3===0?'COORDINATOR':i%3===1?'CLINICIAN':'PATIENT_NAVIGATOR',facilityId:i%3===0?r.destinationFacilityId:r.sourceFacilityId,priority:hoursAgo(r.updatedAt)>24?'HIGH':'MEDIUM',status:i%7===0?'IN_PROGRESS':'OPEN',dueAt:new Date(Date.now()+(i%4-1)*86400000).toISOString(),createdAt:r.createdAt,source:'WORKFLOW',synthetic:true});
}
const carePlans:CarePlanRecord[] = patients.slice(0,30).map((p,i)=>({id:`plan-${p.id}`,patientId:p.id,title:i%3===0?'Chronic care continuity plan':i%3===1?'Post-referral follow-up plan':'Medication and review plan',goal:i%3===0?'Maintain continuity across primary and specialist care.':i%3===1?'Close the referral loop and confirm follow-up.':'Maintain an accurate reconciled medication record.',owner:i%2===0?'Dr Naledi Dlamini':'Care Coordination Team',facilityId:i%2===0?'fac-clinic-1':'fac-clinic-2',status:i%11===0?'ON_HOLD':'ACTIVE',reviewAt:new Date(Date.now()+(14+i%45)*86400000).toISOString(),interventions:['Review longitudinal record','Confirm next appointment','Reconcile medication','Record referral feedback'],updatedAt:new Date(Date.now()-(i%18)*86400000).toISOString(),synthetic:true}));
const documents:ClinicalDocument[]=[];
patients.slice(0,28).forEach((p,i)=>{
  documents.push({id:`doc-${p.id}-1`,patientId:p.id,type:i%4===0?'IMAGING_REPORT':i%4===1?'DISCHARGE_SUMMARY':i%4===2?'SPECIALIST_REPORT':'CARE_DOCUMENT',title:i%4===0?'Synthetic imaging report':i%4===1?'Synthetic discharge summary':i%4===2?'Synthetic specialist report':'Synthetic care document',sourceFacilityId:i%2===0?'fac-hosp-2':'fac-hosp-4',recordedAt:new Date(Date.now()-(10+i)*86400000).toISOString(),summary:'Synthetic demonstration document. Source provenance is preserved; no real clinical content is represented.',status:'FINAL',synthetic:true});
});

function activeGrant(userId:string,patientId:string){
  const grant=breakGlassGrants.find(g=>g.userId===userId&&g.patientId===patientId&&g.status==='ACTIVE'&&Date.parse(g.expiresAt)>Date.now());
  return Boolean(grant);
}
function emergencySummary(patientId:string){
  const p=patients.find(x=>x.id===patientId); if(!p)return null;
  return {patient:{id:p.id,syntheticId:p.syntheticId,name:`${p.firstName} ${p.surname}`,dateOfBirth:p.dateOfBirth,preferredLanguage:p.preferredLanguage,synthetic:true},critical:{allergies:p.allergies.map(x=>({label:x.label,status:x.status,source:x.sourceFacility,recordedAt:x.recordedAt})),medications:p.medications.filter(x=>x.status!=='Stopped').map(x=>({label:x.label,detail:x.detail,status:x.status,source:x.sourceFacility,recordedAt:x.recordedAt})),conditions:p.conditions.map(x=>({label:x.label,status:x.status,source:x.sourceFacility,recordedAt:x.recordedAt}))},recentEncounters:p.encounters.slice(0,5),note:'Synthetic emergency summary. Minimum-necessary view only; not a diagnostic recommendation.'};
}
function identifiers(patientId:string){
  const p=patients.find(x=>x.id===patientId);if(!p)return [];
  return [
    {system:'CarePath Demo MPI',value:p.syntheticId,type:'CAREPATH_DEMO',authoritative:false,status:'ACTIVE'},
    {system:'Mahlasedi Clinic EMR (Mock)',value:`CL-${p.syntheticId.replace('SYN-CP-','')}`,type:'LOCAL_MRN',authoritative:false,status:'LINKED'},
    {system:'Ubuntu Pathology (Mock)',value:`LAB-${p.syntheticId.replace('SYN-CP-','')}`,type:'LOCAL_LAB_ID',authoritative:false,status:'LINKED'}
  ];
}

function watchFindings():WatchFinding[]{
  const out:WatchFinding[]=[];
  referrals.forEach(r=>{
    const age=hoursAgo(r.updatedAt);
    if(['SUBMITTED','RECEIVED'].includes(r.status)&&age>24) out.push({id:`watch-ref-${r.id}`,type:'REFERRAL_SLA',severity:age>48?'CRITICAL':'WARNING',patientId:r.patientId,referralId:r.id,facilityId:r.destinationFacilityId,owner:r.owner,rule:'Referral awaiting receiving action > 24h',evidence:`Referral ${r.id} has been in ${r.status} for approximately ${Math.floor(age)} hours.`,recommendedAction:'Review receiving queue, confirm ownership and escalate administratively if appropriate.',detectedAt:now(),source:'RULE'});
    if(r.status==='FEEDBACK_PENDING'&&age>24) out.push({id:`watch-feedback-${r.id}`,type:'RETURN_FEEDBACK',severity:'WARNING',patientId:r.patientId,referralId:r.id,facilityId:r.destinationFacilityId,owner:r.owner,rule:'Return feedback pending > 24h',evidence:'Specialist/referral outcome feedback remains outstanding.',recommendedAction:'Request structured return feedback and close the referral loop.',detectedAt:now(),source:'RULE'});
  });
  appointments.forEach(a=>{
    if(a.status==='NO_SHOW') out.push({id:`watch-appt-${a.id}`,type:'MISSED_APPOINTMENT',severity:'WARNING',patientId:a.patientId,facilityId:a.facilityId,owner:'Patient Navigator',rule:'Appointment marked NO_SHOW',evidence:`${a.service} appointment is recorded as no-show.`,recommendedAction:'Contact patient and create a follow-up or rescheduling task.',detectedAt:now(),source:'RULE'});
  });
  bedCapacity.filter(c=>Math.max(0,c.staffedBeds-c.occupiedBeds-c.reservedBeds)===0).forEach(c=>out.push({id:`watch-bed-${c.facilityId}-${c.bedType}`,type:'CAPACITY_CONSTRAINT',severity:c.bedType==='ICU'?'CRITICAL':'WARNING',facilityId:c.facilityId,owner:'Facility Operations',rule:'Available bed count = 0',evidence:`Synthetic ${c.bedType.replaceAll('_',' ')} capacity at ${facilityName(c.facilityId)} is fully allocated.`,recommendedAction:'Review alternative compatible facilities before admission-dependent routing.',detectedAt:now(),source:'RULE'}));
  return out.slice(0,80);
}

function geographySummary(){
  const provinces=[...new Set(facilities.map(f=>f.province))].sort();
  return provinces.map(province=>{
    const fs=facilities.filter(f=>f.province===province); const ids=new Set(fs.map(f=>f.id));
    const rs=referrals.filter(r=>ids.has(r.sourceFacilityId)||ids.has(r.destinationFacilityId));
    const aps=appointments.filter(a=>ids.has(a.facilityId));
    return {province,facilities:fs.length,referrals:rs.length,openReferrals:rs.filter(r=>!['CLOSED','CANCELLED','DECLINED'].includes(r.status)).length,appointments:aps.length,availableBeds:fs.reduce((s,f)=>s+availableBeds(f.id),0),slaBreaches:rs.filter(r=>['SUBMITTED','RECEIVED'].includes(r.status)&&hoursAgo(r.updatedAt)>24).length};
  });
}
function districtSummary(province?:string){
  const filtered=province?facilities.filter(f=>f.province===province):facilities;
  const keys=[...new Set(filtered.map(f=>`${f.province}|||${f.district}`))];
  return keys.map(k=>{const [p,d]=k.split('|||');const fs=facilities.filter(f=>f.province===p&&f.district===d);const ids=new Set(fs.map(f=>f.id));const rs=referrals.filter(r=>ids.has(r.sourceFacilityId)||ids.has(r.destinationFacilityId));return {province:p,district:d,facilities:fs.length,openReferrals:rs.filter(r=>!['CLOSED','CANCELLED','DECLINED'].includes(r.status)).length,availableBeds:fs.reduce((s,f)=>s+availableBeds(f.id),0),slaBreaches:rs.filter(r=>['SUBMITTED','RECEIVED'].includes(r.status)&&hoursAgo(r.updatedAt)>24).length};});
}
function populationIntelligence(){
  const province=geographySummary();
  const services=[...new Set(referrals.map(r=>r.service))].map(service=>({service,referrals:referrals.filter(r=>r.service===service).length,open:referrals.filter(r=>r.service===service&&!['CLOSED','CANCELLED','DECLINED'].includes(r.status)).length,missedAppointments:appointments.filter(a=>a.service===service&&a.status==='NO_SHOW').length})).sort((a,b)=>b.referrals-a.referrals);
  const outcomes={recovered:referrals.filter(r=>r.outcome==='RECOVERED').length,improved:referrals.filter(r=>r.outcome==='IMPROVED').length,ongoing:referrals.filter(r=>r.outcome==='ONGOING').length,deceased:referrals.filter(r=>r.outcome==='DECEASED').length,unknown:referrals.filter(r=>!r.outcome||r.outcome==='UNKNOWN').length};
  return {generatedAt:now(),scope:'Synthetic aggregated/de-identified demo intelligence',patients:patients.length,facilities:facilities.length,referrals:referrals.length,appointments:appointments.length,provinces:province,services,outcomes,disclaimer:'Operational synthetic data only. Raw observed outcomes are not risk-adjusted hospital-quality rankings.'};
}

router.get('/release',(req,res)=>res.json({product:'CarePath AI',version:'0.5.0',architecture:'Federated Health Platform',gitCommit:process.env.RENDER_GIT_COMMIT||process.env.GIT_COMMIT||'runtime commit unavailable',persistence:process.env.DATABASE_URL?'PostgreSQL target configured; current v0.5 demo repository remains adapter-backed':'In-memory deterministic hackathon repository; PostgreSQL schema included for migration',environment:process.env.NODE_ENV||'development',syntheticData:true}));

router.get('/identity/:patientId',(req,res)=>{const id=String(req.params.patientId);if(!requirePatientScope(req,res,id))return;const p=patients.find(x=>x.id===id);if(!p)return res.status(404).json({error:'Patient not found'});res.json({patient:{id:p.id,syntheticId:p.syntheticId,name:`${p.firstName} ${p.surname}`,dateOfBirth:p.dateOfBirth},identifiers:identifiers(id),matching:{status:'LINKED',method:'Synthetic deterministic demo linkage',warning:'Production identity resolution must use an approved MPI/authoritative identity service and governed merge/unmerge workflows.'}});});
router.get('/identity',(req,res)=>{const user=req.currentUser!;const q=String(req.query.q||'').toLowerCase();const visible=patients.filter(p=>canSeePatient(user,p.id)).filter(p=>!q||`${p.firstName} ${p.surname} ${p.syntheticId}`.toLowerCase().includes(q)).slice(0,50);res.json({patients:visible.map(p=>({id:p.id,syntheticId:p.syntheticId,name:`${p.firstName} ${p.surname}`,dateOfBirth:p.dateOfBirth,identifiers:identifiers(p.id).length})),architecture:'MPI abstraction / federated source identifiers'});});

router.get('/consent/:patientId',(req,res)=>{const patientId=String(req.params.patientId);if(!requirePatientScope(req,res,patientId))return;res.json({records:consentRecords.filter(c=>c.patientId===patientId),legalBoundary:'Consent/preferences are configurable governance signals; CarePath does not imply every lawful healthcare processing purpose uses the same consent mechanism.'});});
router.put('/consent/:patientId',(req,res)=>{const user=req.currentUser!;const patientId=String(req.params.patientId);if(!(user.role==='ADMIN'||(user.role==='PATIENT'&&user.patientId===patientId)))return deny(res);const record=consentRecords.find(c=>c.patientId===patientId);if(!record)return res.status(404).json({error:'Consent record not found'});const {shareWithCareTeam,allowPatientMessaging,allowCaregiverProxy}=req.body||{};if(typeof shareWithCareTeam==='boolean')record.shareWithCareTeam=shareWithCareTeam;if(typeof allowPatientMessaging==='boolean')record.allowPatientMessaging=allowPatientMessaging;if(typeof allowCaregiverProxy==='boolean')record.allowCaregiverProxy=allowCaregiverProxy;record.updatedAt=now();record.updatedBy=user.displayName;audit(user,'consent.preference_update','ConsentRecord',record.id);res.json({record});});

router.get('/breakglass',(req,res)=>{const user=req.currentUser!;if(!managementRoles.includes(user.role)&&!emergencyRoles.includes(user.role))return deny(res);const rows=managementRoles.includes(user.role)?breakGlassGrants:breakGlassGrants.filter(g=>g.userId===user.id);res.json({events:rows.map(g=>({...g,patientName:patientName(g.patientId),facilityName:g.facilityId?facilityName(g.facilityId):null})),policy:'Emergency access is minimum-necessary, reasoned, re-authenticated, time-limited and audited.'});});
router.post('/breakglass',(req,res)=>{const user=req.currentUser!;if(!emergencyRoles.includes(user.role))return deny(res,'This role cannot invoke emergency Break Glass access');const patientId=String(req.body?.patientId||'');const reason=String(req.body?.reason||'').trim();const password=String(req.body?.password||'');if(!patients.some(p=>p.id===patientId))return res.status(404).json({error:'Patient not found'});if(reason.length<10)return res.status(400).json({error:'A specific emergency access reason of at least 10 characters is required'});if(!password||!bcrypt.compareSync(password,user.passwordHash)){audit(user,'breakglass.request','Patient',patientId,'DENIED','Re-authentication failed');return res.status(401).json({error:'Re-authentication failed'});}const grant:BreakGlassGrant={id:randomUUID(),patientId,userId:user.id,userName:user.displayName,facilityId:user.facilityId,reason,createdAt:now(),expiresAt:new Date(Date.now()+15*60000).toISOString(),status:'ACTIVE',synthetic:true};breakGlassGrants.unshift(grant);audit(user,'breakglass.granted','Patient',patientId,'SUCCESS',reason);res.status(201).json({grant,summary:emergencySummary(patientId),warning:'Synthetic demonstration. Production Break Glass requires enterprise MFA/re-authentication, policy enforcement, monitoring and compliance review.'});});
router.get('/emergency/:patientId',(req,res)=>{const user=req.currentUser!;const patientId=String(req.params.patientId);if(!emergencyRoles.includes(user.role))return deny(res);if(!activeGrant(user.id,patientId))return res.status(403).json({error:'An active Break Glass grant is required'});const summary=emergencySummary(patientId);if(!summary)return res.status(404).json({error:'Patient not found'});audit(user,'breakglass.emergency_summary_read','Patient',patientId);res.json(summary);});

router.get('/workspace',(req,res)=>{const user=req.currentUser!;if(!workspaceRoles.includes(user.role))return deny(res);const visibleIds=new Set(patients.filter(p=>canSeePatient(user,p.id)).map(p=>p.id));const myRefs=referrals.filter(r=>visibleIds.has(r.patientId));const myAppointments=appointments.filter(a=>visibleIds.has(a.patientId));const myTasks=careTasks.filter(t=>(!t.ownerUserId||t.ownerUserId===user.id)&&(t.ownerRole===user.role||user.role==='ADMIN'||(t.facilityId&&t.facilityId===user.facilityId))).map(t=>({...t,patientName:t.patientId?patientName(t.patientId):undefined}));const resultsAwaiting=patients.filter(p=>visibleIds.has(p.id)&&p.results.some(r=>r.status==='Final')).slice(0,12).map(p=>({patientId:p.id,patientName:`${p.firstName} ${p.surname}`,results:p.results.slice(0,2)}));res.json({user:{displayName:user.displayName,role:user.role},today:{patients:visibleIds.size,openReferrals:myRefs.filter(r=>!['CLOSED','CANCELLED','DECLINED'].includes(r.status)).length,appointments:myAppointments.filter(a=>['REQUESTED','BOOKED','CHECKED_IN'].includes(a.status)).length,highPriorityTasks:myTasks.filter(t=>t.priority==='HIGH'&&t.status!=='DONE').length},tasks:myTasks.slice(0,30),referrals:myRefs.slice(0,20).map(r=>({...r,patientName:patientName(r.patientId),destinationFacilityName:facilityName(r.destinationFacilityId)})),appointments:myAppointments.slice(0,20).map(a=>({...a,patientName:patientName(a.patientId),facilityName:facilityName(a.facilityId)})),resultsAwaiting,handOffs:myRefs.filter(r=>['SUBMITTED','RECEIVED','INFO_REQUESTED','FEEDBACK_PENDING'].includes(r.status)).slice(0,12).map(r=>({referralId:r.id,patientId:r.patientId,patientName:patientName(r.patientId),service:r.service,status:r.status,owner:r.owner}))});});
router.post('/tasks',(req,res)=>{const user=req.currentUser!;if(!workspaceRoles.includes(user.role))return deny(res);const title=String(req.body?.title||'').trim();if(title.length<3)return res.status(400).json({error:'Task title is required'});const patientId=req.body?.patientId?String(req.body.patientId):undefined;if(patientId&&!requirePatientScope(req,res,patientId))return;const task:CareTask={id:randomUUID(),patientId,referralId:req.body?.referralId?String(req.body.referralId):undefined,title,detail:String(req.body?.detail||''),ownerRole:(req.body?.ownerRole||user.role) as Role,ownerUserId:req.body?.ownerUserId?String(req.body.ownerUserId):user.id,facilityId:user.facilityId,priority:['LOW','MEDIUM','HIGH'].includes(req.body?.priority)?req.body.priority:'MEDIUM',status:'OPEN',dueAt:req.body?.dueAt?new Date(req.body.dueAt).toISOString():new Date(Date.now()+86400000).toISOString(),createdAt:now(),source:'USER',synthetic:true};careTasks.unshift(task);audit(user,'task.create','Task',task.id);res.status(201).json({task});});
router.post('/tasks/:id/status',(req,res)=>{const user=req.currentUser!;const task=careTasks.find(t=>t.id===String(req.params.id));if(!task)return res.status(404).json({error:'Task not found'});if(!(user.role==='ADMIN'||task.ownerUserId===user.id||task.ownerRole===user.role))return deny(res);const status=String(req.body?.status||'');if(!['OPEN','IN_PROGRESS','DONE'].includes(status))return res.status(400).json({error:'Invalid task status'});task.status=status as CareTask['status'];audit(user,'task.status_change','Task',task.id);res.json({task});});

router.get('/care-plans/:patientId',(req,res)=>{const id=String(req.params.patientId);if(!requirePatientScope(req,res,id))return;res.json({carePlans:carePlans.filter(p=>p.patientId===id).map(p=>({...p,facilityName:facilityName(p.facilityId)}))});});
router.get('/documents/:patientId',(req,res)=>{const id=String(req.params.patientId);if(!requirePatientScope(req,res,id))return;res.json({documents:documents.filter(d=>d.patientId===id).map(d=>({...d,sourceFacilityName:facilityName(d.sourceFacilityId)})),note:'Synthetic document metadata/summary only. Raw imaging is not duplicated into the prototype.'});});

router.get('/watch',(req,res)=>{const user=req.currentUser!;const findings=watchFindings().filter(f=>!f.patientId||canSeePatient(user,f.patientId)||managementRoles.includes(user.role));res.json({engine:'CarePath Watch',mode:'Explainable operational rules',findings,summary:{critical:findings.filter(f=>f.severity==='CRITICAL').length,warning:findings.filter(f=>f.severity==='WARNING').length,info:findings.filter(f=>f.severity==='INFO').length},boundary:'These findings identify workflow risk and pathway leakage. They are not diagnoses or unvalidated clinical predictions.'});});

router.get('/command',(req,res)=>{const user=req.currentUser!;if(!managementRoles.includes(user.role))return deny(res);const level=String(req.query.level||'country');const province=req.query.province?String(req.query.province):undefined;const district=req.query.district?String(req.query.district):undefined;if(level==='country')return res.json({level:'country',name:'South Africa — Synthetic Demo',metrics:{patients:patients.length,facilities:facilities.length,openReferrals:referrals.filter(r=>!['CLOSED','CANCELLED','DECLINED'].includes(r.status)).length,appointments:appointments.length,availableBeds:facilities.reduce((s,f)=>s+availableBeds(f.id),0),slaBreaches:watchFindings().filter(f=>f.type==='REFERRAL_SLA').length},children:geographySummary()});if(level==='province')return res.json({level:'province',name:province,children:districtSummary(province),facilities:facilities.filter(f=>!province||f.province===province).map(f=>({id:f.id,name:f.name,district:f.district,city:f.city,type:f.type,availableBeds:availableBeds(f.id)}))});if(level==='district'){const fs=facilities.filter(f=>(!province||f.province===province)&&(!district||f.district===district));const ids=new Set(fs.map(f=>f.id));const rs=referrals.filter(r=>ids.has(r.sourceFacilityId)||ids.has(r.destinationFacilityId));return res.json({level:'district',name:district,province,metrics:{facilities:fs.length,openReferrals:rs.filter(r=>!['CLOSED','CANCELLED','DECLINED'].includes(r.status)).length,availableBeds:fs.reduce((s,f)=>s+availableBeds(f.id),0)},facilities:fs.map(f=>({id:f.id,name:f.name,city:f.city,type:f.type,services:f.services,availableBeds:availableBeds(f.id)}))});}return res.status(400).json({error:'Unsupported hierarchy level'});});
router.get('/population',(req,res)=>{const user=req.currentUser!;if(!populationRoles.includes(user.role))return deny(res);res.json(populationIntelligence());});

function fhirPatient(id:string){const p=patients.find(x=>x.id===id);if(!p)return null;return {resourceType:'Patient',id:p.id,meta:{source:'CarePath synthetic federated demonstration'},identifier:identifiers(id).map(x=>({system:`urn:carepath:demo:${x.system.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`,value:x.value})),name:[{use:'official',family:p.surname,given:[p.firstName]}],birthDate:p.dateOfBirth,telecom:[{system:'phone',value:p.phone}],communication:[{language:{text:p.preferredLanguage},preferred:true}],extension:[{url:'https://carepath.demo/synthetic',valueBoolean:true}]};}
function fhirReferral(id:string){const r=referrals.find(x=>x.id===id);if(!r)return null;return {resourceType:'ServiceRequest',id:r.id,status:['CLOSED','CANCELLED','DECLINED'].includes(r.status)?'completed':'active',intent:'order',subject:{reference:`Patient/${r.patientId}`},code:{text:r.service},reasonCode:[{text:r.reason}],requester:{display:r.owner},performer:[{reference:`Organization/${r.destinationFacilityId}`,display:facilityName(r.destinationFacilityId)}],authoredOn:r.createdAt,note:[{text:'Synthetic CarePath referral mapping'}]};}
function fhirAppointment(id:string){const a=appointments.find(x=>x.id===id);if(!a)return null;const statusMap:Record<string,string>={REQUESTED:'proposed',BOOKED:'booked',CHECKED_IN:'arrived',COMPLETED:'fulfilled',CANCELLED:'cancelled',NO_SHOW:'noshow'};return {resourceType:'Appointment',id:a.id,status:statusMap[a.status]||'proposed',serviceType:[{text:a.service}],start:a.startAt,minutesDuration:a.durationMinutes,participant:[{actor:{reference:`Patient/${a.patientId}`,display:patientName(a.patientId)},status:'accepted'},{actor:{reference:`Location/${a.facilityId}`,display:facilityName(a.facilityId)},status:'accepted'}]};}
router.get('/fhir/metadata',(req,res)=>res.json({resourceType:'CapabilityStatement',status:'active',date:now(),kind:'instance',software:{name:'CarePath Exchange Demo',version:'0.5.0'},fhirVersion:'4.0.1',format:['json'],rest:[{mode:'server',resource:[{type:'Patient',interaction:[{code:'read'}]},{type:'ServiceRequest',interaction:[{code:'read'}]},{type:'Appointment',interaction:[{code:'read'}]}]}],implementation:{description:'Synthetic FHIR R4-style demonstration facade. Not certified for national profile conformance.'}}));
router.get('/fhir/Patient/:id',(req,res)=>{const id=String(req.params.id);if(!requirePatientScope(req,res,id))return;const resource=fhirPatient(id);if(!resource)return res.status(404).json({resourceType:'OperationOutcome',issue:[{severity:'error',code:'not-found'}]});res.type('application/fhir+json').json(resource);});
router.get('/fhir/ServiceRequest/:id',(req,res)=>{const user=req.currentUser!;const r=referrals.find(x=>x.id===String(req.params.id));if(!r)return res.status(404).json({resourceType:'OperationOutcome',issue:[{severity:'error',code:'not-found'}]});if(!canSeePatient(user,r.patientId)&&!activeGrant(user.id,r.patientId))return deny(res);res.type('application/fhir+json').json(fhirReferral(r.id));});
router.get('/fhir/Appointment/:id',(req,res)=>{const user=req.currentUser!;const a=appointments.find(x=>x.id===String(req.params.id));if(!a)return res.status(404).json({resourceType:'OperationOutcome',issue:[{severity:'error',code:'not-found'}]});if(!canSeePatient(user,a.patientId)&&!activeGrant(user.id,a.patientId))return deny(res);res.type('application/fhir+json').json(fhirAppointment(a.id));});
router.get('/exchange/sources',(req,res)=>res.json({sources:[{id:'mock-clinic-emr',name:'Mahlasedi Clinic EMR',type:'EMR',mode:'MOCK',resources:['Patient','Encounter','Condition','AllergyIntolerance']},{id:'mock-lab',name:'Ubuntu Pathology',type:'LAB',mode:'MOCK',resources:['Observation','DiagnosticReport']},{id:'mock-pharmacy',name:'CareLink Pharmacy',type:'PHARMACY',mode:'MOCK',resources:['MedicationRequest','MedicationDispense']},{id:'mock-specialist',name:'Tshwane Specialist System',type:'HOSPITAL',mode:'MOCK',resources:['ServiceRequest','Appointment','DocumentReference']}],flow:'Source systems → CarePath Exchange → provenance-preserving OneRecord',warning:'Mock adapters only; no live public/private healthcare connection is claimed.'}));

export function registerV05Routes(app:express.Application){ app.use('/api/v05',router); }
