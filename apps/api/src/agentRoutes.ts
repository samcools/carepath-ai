import express, { type Request, type Response } from 'express';
import { randomUUID } from 'node:crypto';
import { appointments, auditEvents, facilities, patients, referrals } from './data.js';
import { agentCatalogue, frameworkText } from './agentCatalogue.js';
import type { DemoUser } from './domain.js';

const router = express.Router();

type ProposalStatus='PENDING_APPROVAL'|'REJECTED'|'EXECUTED';
interface AgentProposal{
  id:string;
  agentId:string;
  agentName:string;
  engagementRef:string;
  requestedByUserId:string;
  requestedBy:string;
  action:string;
  rationale:string;
  patientId?:string;
  referralId?:string;
  status:ProposalStatus;
  createdAt:string;
  decidedAt?:string;
  decisionBy?:string;
  executionNote?:string;
}

interface StandaloneEngagement{
  reference:string;
  patientId?:string;
  title:string;
  createdAt:string;
  createdBy:string;
}

const proposals:AgentProposal[]=[];
const standaloneEngagements:StandaloneEngagement[]=[];
const now=()=>new Date().toISOString();

function hashNumber(input:string){let h=2166136261;for(const c of input){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return Math.abs(h>>>0)%1000000}
export function journeyReference(referralId:string,createdAt?:string){const year=new Date(createdAt||Date.now()).getFullYear();return `CPJ-${year}-${String(hashNumber(referralId)).padStart(6,'0')}`}
function patientName(id:string){const p=patients.find(x=>x.id===id);return p?`${p.firstName} ${p.surname}`:id}
function facilityName(id:string){return facilities.find(f=>f.id===id)?.name||id}
function visibleReferral(user:DemoUser,r:typeof referrals[number]){
  if(user.role==='ADMIN'||user.role==='MANAGER'||user.role==='AUDITOR')return true;
  if(user.role==='PATIENT')return r.patientId===user.patientId;
  return Boolean(user.facilityId&&(r.sourceFacilityId===user.facilityId||r.destinationFacilityId===user.facilityId));
}
function audit(user:DemoUser,action:string,objectType:string,objectId:string,reason?:string){auditEvents.unshift({id:randomUUID(),at:now(),actor:user.displayName,action,objectType,objectId,source:'AI',outcome:'SUCCESS',reason})}
function referenceRows(user:DemoUser){
  return referrals.filter(r=>visibleReferral(user,r)).map(r=>{
    const ref=journeyReference(r.id,r.createdAt);
    const relatedAppointments=appointments.filter(a=>a.referralId===r.id).map(a=>({id:a.id,status:a.status,startAt:a.startAt,facilityId:a.facilityId,facilityName:facilityName(a.facilityId)}));
    const masked=user.role==='MANAGER'||user.role==='AUDITOR';
    return {
      reference:ref,
      referralId:r.id,
      patientId:r.patientId,
      patientName:masked?'De-identified patient':patientName(r.patientId),
      service:r.service,
      status:r.status,
      sourceFacilityId:r.sourceFacilityId,
      sourceFacilityName:facilityName(r.sourceFacilityId),
      destinationFacilityId:r.destinationFacilityId,
      destinationFacilityName:facilityName(r.destinationFacilityId),
      createdAt:r.createdAt,
      updatedAt:r.updatedAt,
      appointments:relatedAppointments
    };
  });
}
function activeSummary(agentId:string){
  const open=referrals.filter(r=>!['CLOSED','CANCELLED','DECLINED'].includes(r.status)).length;
  const stale=referrals.filter(r=>['SUBMITTED','RECEIVED','INFO_REQUESTED'].includes(r.status)&&Date.now()-Date.parse(r.updatedAt)>24*3600000).length;
  const booked=appointments.filter(a=>['BOOKED','CHECKED_IN','REQUESTED'].includes(a.status)).length;
  const map:Record<string,{label:string,value:number}>={
    'patient-journey':{label:'open journeys monitored',value:open},
    'referral-orchestration':{label:'referrals monitored',value:referrals.length},
    'facility-matching':{label:'facilities available to match',value:facilities.filter(f=>['PUBLIC','PRIVATE'].includes(f.type)).length},
    'appointment-scheduling':{label:'active appointments monitored',value:booked},
    'carepath-watch':{label:'stale journeys requiring attention',value:stale},
    'population-health':{label:'synthetic patients represented',value:patients.length},
    'command-centre':{label:'open journeys monitored',value:open},
    'ayanda-orchestrator':{label:'specialist agents available',value:agentCatalogue.length-1}
  };
  return map[agentId]||{label:'agent ready',value:1};
}

router.get('/',(req:Request,res:Response)=>{
  const user=req.currentUser!;
  res.json({
    syntheticData:true,
    permissionPolicy:'Every executable agent task requires explicit user approval. Agents may observe, understand, reason and prepare without approval, but may not execute a task until the authorised user approves it.',
    referencePolicy:'Use the CarePath Journey Reference (CPJ-YYYY-######) across referral, appointment, transfer, communication, agent action and audit discussions for the same patient journey.',
    agents:agentCatalogue.map(a=>({...a,framework:frameworkText(a),summary:activeSummary(a.id),status:'ACTIVE'})),
    proposals:proposals.filter(p=>p.requestedByUserId===user.id||user.role==='ADMIN').slice(0,50)
  });
});

router.get('/references',(req:Request,res:Response)=>{
  const user=req.currentUser!;
  res.json({references:referenceRows(user),standalone:standaloneEngagements.filter(x=>x.createdBy===user.id||user.role==='ADMIN')});
});

router.post('/references',(req:Request,res:Response)=>{
  const user=req.currentUser!;
  const title=String(req.body?.title||'CarePath engagement').trim().slice(0,160);
  const patientId=req.body?.patientId?String(req.body.patientId):undefined;
  if(patientId&&user.role==='PATIENT'&&patientId!==user.patientId)return res.status(403).json({error:'Patient is outside authorised scope'});
  const reference=`CPJ-${new Date().getFullYear()}-${String(hashNumber(`${user.id}-${Date.now()}-${randomUUID()}`)).padStart(6,'0')}`;
  const item={reference,patientId,title,createdAt:now(),createdBy:user.id};standaloneEngagements.unshift(item);
  audit(user,'agent.reference.create','Engagement',reference,title);
  res.status(201).json({engagement:item});
});

router.get('/references/:reference',(req:Request,res:Response)=>{
  const user=req.currentUser!,reference=String(req.params.reference);
  const row=referenceRows(user).find(r=>r.reference===reference);
  if(row)return res.json({journey:row});
  const standalone=standaloneEngagements.find(x=>x.reference===reference&&(x.createdBy===user.id||user.role==='ADMIN'));
  if(standalone)return res.json({journey:standalone});
  return res.status(404).json({error:'CarePath journey reference not found in authorised scope'});
});

router.post('/proposals',(req:Request,res:Response)=>{
  const user=req.currentUser!;
  const agent=agentCatalogue.find(a=>a.id===String(req.body?.agentId||''));
  if(!agent)return res.status(400).json({error:'Unknown CarePath agent'});
  const engagementRef=String(req.body?.engagementRef||'').trim();
  if(!/^CPJ-\d{4}-\d{6}$/.test(engagementRef))return res.status(400).json({error:'A valid CarePath Journey Reference is required before an agent can prepare a task'});
  const authorisedRef=referenceRows(user).some(r=>r.reference===engagementRef)||standaloneEngagements.some(x=>x.reference===engagementRef&&(x.createdBy===user.id||user.role==='ADMIN'));
  if(!authorisedRef)return res.status(403).json({error:'Journey reference is outside authorised scope'});
  const action=String(req.body?.action||'').trim().slice(0,500);
  const rationale=String(req.body?.rationale||'Agent-prepared administrative action').trim().slice(0,500);
  if(action.length<4)return res.status(400).json({error:'Describe the task the agent should prepare'});
  const proposal:AgentProposal={id:randomUUID(),agentId:agent.id,agentName:agent.name,engagementRef,requestedByUserId:user.id,requestedBy:user.displayName,action,rationale,patientId:req.body?.patientId?String(req.body.patientId):undefined,referralId:req.body?.referralId?String(req.body.referralId):undefined,status:'PENDING_APPROVAL',createdAt:now()};
  proposals.unshift(proposal);
  audit(user,'agent.action.proposed','AgentProposal',proposal.id,`${agent.name} prepared action for ${engagementRef}; awaiting explicit user approval`);
  res.status(201).json({proposal,permissionRequired:true,message:'Action prepared. Nothing has been executed. Please review and explicitly approve or reject the task.'});
});

router.post('/proposals/:id/decision',(req:Request,res:Response)=>{
  const user=req.currentUser!,proposal=proposals.find(p=>p.id===String(req.params.id));
  if(!proposal)return res.status(404).json({error:'Agent proposal not found'});
  if(proposal.requestedByUserId!==user.id&&user.role!=='ADMIN')return res.status(403).json({error:'Only the requesting authorised user or administrator may decide this proposal'});
  if(proposal.status!=='PENDING_APPROVAL')return res.status(409).json({error:`Proposal is already ${proposal.status.toLowerCase().replaceAll('_',' ')}`});
  const decision=String(req.body?.decision||'').toUpperCase();
  if(!['APPROVE','REJECT'].includes(decision))return res.status(400).json({error:'Decision must be APPROVE or REJECT'});
  proposal.decidedAt=now();proposal.decisionBy=user.displayName;
  if(decision==='REJECT'){
    proposal.status='REJECTED';proposal.executionNote='The user declined permission. No task was executed.';
    audit(user,'agent.action.rejected','AgentProposal',proposal.id,`${proposal.agentName}; ${proposal.engagementRef}`);
    return res.json({proposal,message:'Permission declined. No action was executed.'});
  }
  proposal.status='EXECUTED';
  proposal.executionNote='Explicit user approval recorded. The hackathon agent executed the approved administrative demo action only; no autonomous diagnosis, prescribing, clinical triage, record merge, Break Glass grant or other restricted clinical decision was performed.';
  audit(user,'agent.action.executed_after_approval','AgentProposal',proposal.id,`${proposal.agentName}; ${proposal.engagementRef}; explicit approval by ${user.displayName}`);
  return res.json({proposal,message:'Approved action executed within the CarePath demo boundary and recorded in the audit trail.'});
});

router.get('/proposals',(req:Request,res:Response)=>{const user=req.currentUser!;res.json({proposals:proposals.filter(p=>p.requestedByUserId===user.id||user.role==='ADMIN').slice(0,100)})});

export function registerAgentRoutes(app:express.Application){app.use('/api/agents',router)}
