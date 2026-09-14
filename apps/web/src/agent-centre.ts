import './agent-centre.css';

type Agent={id:string;name:string;userGroup:string;problem:string;impact:string;primaryUser:string;outcome:string;understand:string;reason:string;act:string;keyActions:string;humanRole:string;metrics:[string,string,string];autonomy:string;category:string;framework:string;status:string;summary:{label:string;value:number}};
type JourneyRef={reference:string;referralId?:string;patientId?:string;patientName?:string;service?:string;status?:string;sourceFacilityName?:string;destinationFacilityName?:string;createdAt?:string;appointments?:any[]};
type Proposal={id:string;agentId:string;agentName:string;engagementRef:string;requestedBy:string;action:string;rationale:string;status:string;createdAt:string;executionNote?:string};

type CentreState={agents:Agent[];references:JourneyRef[];standalone:JourneyRef[];proposals:Proposal[];permissionPolicy:string;referencePolicy:string;activeCategory:string;selectedRef:string};
const state:CentreState={agents:[],references:[],standalone:[],proposals:[],permissionPolicy:'',referencePolicy:'',activeCategory:'ALL',selectedRef:''};
let active=false;
const api=async(path:string,init?:RequestInit)=>{const r=await fetch(path,{credentials:'include',headers:{'Content-Type':'application/json',...(init?.headers||{})},...init});const b=await r.json().catch(()=>({}));if(!r.ok)throw new Error(b.error||`Request failed (${r.status})`);return b};
const esc=(v:any)=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]||c));
const content=()=>document.querySelector<HTMLElement>('main.content');
const nav=()=>document.querySelector<HTMLElement>('.topbar nav');
const fmt=(iso?:string)=>iso?new Date(iso).toLocaleString('en-ZA',{dateStyle:'medium',timeStyle:'short'}):'—';

function ensureNav(){
  const n=nav();if(!n||document.querySelector('#agent-centre-nav'))return;
  const b=document.createElement('button');b.id='agent-centre-nav';b.className='ux-secondary-hidden';b.innerHTML='<span>✦</span>Agent Centre';b.title='CarePath governed autonomous agents';
  const careFlow=[...n.querySelectorAll<HTMLButtonElement>(':scope > button')].find(x=>/Care Flow/i.test(x.textContent||''));
  if(careFlow)careFlow.insertAdjacentElement('afterend',b);else n.appendChild(b);
  b.addEventListener('click',()=>openCentre());
  n.addEventListener('click',e=>{if(!(e.target as HTMLElement).closest('#agent-centre-nav')){active=false;b.classList.remove('active')}});
}

function ensureHomeAction(){
  const grid=document.querySelector<HTMLElement>('.ux-home-action-grid');if(!grid||grid.querySelector('[data-go="agents"]'))return;
  const b=document.createElement('button');b.dataset.go='agents';b.innerHTML='<b>Open Agent Centre</b><span>See all CarePath agents, journey references and approval requests.</span>';b.onclick=()=>openCentre();grid.appendChild(b);
}

async function load(){
  const [catalogue,refs]=await Promise.all([api('/api/agents'),api('/api/agents/references')]);
  state.agents=catalogue.agents||[];state.proposals=catalogue.proposals||[];state.permissionPolicy=catalogue.permissionPolicy||'';state.referencePolicy=catalogue.referencePolicy||'';
  state.references=refs.references||[];state.standalone=refs.standalone||[];
  if(!state.selectedRef)state.selectedRef=(state.references[0]?.reference||state.standalone[0]?.reference||'');
}

async function openCentre(){
  active=true;document.querySelectorAll('.topbar nav button').forEach(b=>b.classList.remove('active'));document.querySelector('#agent-centre-nav')?.classList.add('active');
  const root=content();if(!root)return;root.innerHTML='<div class="ag-loading">Loading CarePath agents…</div>';
  try{await load();render()}catch(e:any){root.innerHTML=`<div class="ag-error"><b>Unable to load Agent Centre.</b><span>${esc(e.message)}</span></div>`}
}

function refOptions(){const all=[...state.references,...state.standalone];return all.map(r=>`<option value="${esc(r.reference)}" ${r.reference===state.selectedRef?'selected':''}>${esc(r.reference)}${r.patientName?` — ${esc(r.patientName)}`:''}${r.service?` — ${esc(r.service)}`:''}</option>`).join('')}
function categoryLabel(c:string){return ({CARE_FLOW:'Care flow',CLINICAL_SUPPORT:'Clinical support',PATIENT_ENGAGEMENT:'Patient engagement',GOVERNANCE:'Governance',OPERATIONS:'Operations',INTEROPERABILITY:'Interoperability'} as Record<string,string>)[c]||c}
function pending(){return state.proposals.filter(p=>p.status==='PENDING_APPROVAL')}

function render(){
  const root=content();if(!root)return;
  const cats=['ALL',...new Set(state.agents.map(a=>a.category))];
  const agents=state.activeCategory==='ALL'?state.agents:state.agents.filter(a=>a.category===state.activeCategory);
  root.innerHTML=`<section class="ag-shell">
    <header class="ag-hero"><div><span>CAREPATH AGENT CENTRE</span><h1>Governed digital care workforce</h1><p>Agents can understand, reason and prepare work. <b>Nothing is executed until an authorised user explicitly approves the task.</b></p></div><div class="ag-hero-stat"><b>${state.agents.length}</b><span>specialised agents</span><small>${pending().length} awaiting approval</small></div></header>
    <section class="ag-reference"><div><span>Journey reference</span><h2>${state.selectedRef?esc(state.selectedRef):'Create or select a reference'}</h2><p>${esc(state.referencePolicy)}</p></div><div class="ag-reference-actions"><select id="ag-ref-select"><option value="">Select a journey reference</option>${refOptions()}</select><button id="ag-new-ref" type="button">+ New engagement reference</button></div></section>
    <section class="ag-policy"><div class="ag-lock">✓</div><div><b>Permission required before every executable task</b><p>${esc(state.permissionPolicy)}</p></div></section>
    ${pending().length?approvalQueue():''}
    <section class="ag-toolbar"><div>${cats.map(c=>`<button data-cat="${esc(c)}" class="${state.activeCategory===c?'active':''}">${c==='ALL'?'All agents':esc(categoryLabel(c))}</button>`).join('')}</div><span>${agents.length} shown</span></section>
    <section class="ag-grid">${agents.map(agentCard).join('')}</section>
    <section id="ag-detail" class="ag-detail"><div class="ag-empty">Select an agent to view its framework or prepare a task.</div></section>
  </section>`;
  bind();decorateReferences();
}

function agentCard(a:Agent){return `<article class="ag-card" data-agent="${esc(a.id)}"><header><span class="ag-dot"></span><div><small>${esc(categoryLabel(a.category))}</small><h3>${esc(a.name)}</h3></div><span class="ag-status">${esc(a.status)}</span></header><p>${esc(a.outcome)}</p><div class="ag-card-metric"><b>${esc(a.summary.value)}</b><span>${esc(a.summary.label)}</span></div><small class="ag-autonomy">${esc(a.autonomy)}</small><footer><button data-framework="${esc(a.id)}">View framework</button><button class="primary" data-prepare="${esc(a.id)}">Prepare task</button></footer></article>`}

function approvalQueue(){return `<section class="ag-approvals"><header><div><span>APPROVAL QUEUE</span><h2>Your permission is required</h2></div><b>${pending().length}</b></header>${pending().map(p=>`<article><div><small>${esc(p.engagementRef)} • ${esc(p.agentName)}</small><h3>${esc(p.action)}</h3><p>${esc(p.rationale)}</p><span>Prepared ${fmt(p.createdAt)} by ${esc(p.requestedBy)}. No action has been executed.</span></div><div><button data-reject="${esc(p.id)}">Reject</button><button class="approve" data-approve="${esc(p.id)}">Approve & execute</button></div></article>`).join('')}</section>`}

function bind(){
  document.querySelector<HTMLSelectElement>('#ag-ref-select')?.addEventListener('change',e=>{state.selectedRef=(e.target as HTMLSelectElement).value;render()});
  document.querySelector<HTMLButtonElement>('#ag-new-ref')?.addEventListener('click',createReference);
  document.querySelectorAll<HTMLButtonElement>('[data-cat]').forEach(b=>b.onclick=()=>{state.activeCategory=b.dataset.cat||'ALL';render()});
  document.querySelectorAll<HTMLButtonElement>('[data-framework]').forEach(b=>b.onclick=()=>showFramework(b.dataset.framework||''));
  document.querySelectorAll<HTMLButtonElement>('[data-prepare]').forEach(b=>b.onclick=()=>prepareTask(b.dataset.prepare||''));
  document.querySelectorAll<HTMLButtonElement>('[data-approve]').forEach(b=>b.onclick=()=>decide(b.dataset.approve||'','APPROVE'));
  document.querySelectorAll<HTMLButtonElement>('[data-reject]').forEach(b=>b.onclick=()=>decide(b.dataset.reject||'','REJECT'));
}

function showFramework(id:string){const a=state.agents.find(x=>x.id===id),target=document.querySelector<HTMLElement>('#ag-detail');if(!a||!target)return;target.innerHTML=`<header><div><span>${esc(categoryLabel(a.category))}</span><h2>${esc(a.name)}</h2></div><span class="ag-autonomy-pill">${esc(a.autonomy)}</span></header><div class="ag-framework"><h3>Agent value statement</h3><p>${esc(a.framework)}</p></div><div class="ag-three"><div><b>Understand</b><span>${esc(a.understand)}</span></div><div><b>Reason</b><span>${esc(a.reason)}</span></div><div><b>Act</b><span>${esc(a.act)}</span></div></div><div class="ag-metrics"><b>Success measures</b>${a.metrics.map(m=>`<span>${esc(m)}</span>`).join('')}</div>`;target.scrollIntoView({behavior:'smooth',block:'nearest'})}

function prepareTask(id:string){const a=state.agents.find(x=>x.id===id),target=document.querySelector<HTMLElement>('#ag-detail');if(!a||!target)return;if(!state.selectedRef){target.innerHTML='<div class="ag-warning"><b>Select or create a CarePath Journey Reference first.</b><span>The same reference is used throughout the engagement and audit trail.</span></div>';return}target.innerHTML=`<header><div><span>PREPARE — DO NOT EXECUTE</span><h2>${esc(a.name)}</h2></div><span class="ag-ref-pill">${esc(state.selectedRef)}</span></header><div class="ag-permission-note"><b>Step 1: prepare only</b><span>The agent may understand and reason now. It will not execute the task until you review the proposal and click “Approve & execute”.</span></div><form id="ag-task-form"><label>Task to prepare<textarea name="action" required placeholder="Describe what you want the agent to prepare for this journey."></textarea></label><label>Why is this needed?<textarea name="rationale" placeholder="Optional rationale or context"></textarea></label><button type="submit">Prepare task for my approval</button></form>`;target.querySelector<HTMLFormElement>('#ag-task-form')?.addEventListener('submit',async e=>{e.preventDefault();const f=new FormData(e.currentTarget);const action=String(f.get('action')||'').trim(),rationale=String(f.get('rationale')||'').trim();if(action.length<4)return;target.insertAdjacentHTML('beforeend','<div class="ag-loading-inline">Preparing proposal…</div>');try{const d=await api('/api/agents/proposals',{method:'POST',body:JSON.stringify({agentId:a.id,engagementRef:state.selectedRef,action,rationale})});state.proposals.unshift(d.proposal);render();setTimeout(()=>document.querySelector('.ag-approvals')?.scrollIntoView({behavior:'smooth'}),50)}catch(err:any){target.insertAdjacentHTML('beforeend',`<div class="ag-error">${esc(err.message)}</div>`)}});target.scrollIntoView({behavior:'smooth',block:'nearest'})}

async function decide(id:string,decision:'APPROVE'|'REJECT'){const p=state.proposals.find(x=>x.id===id);if(!p)return;if(decision==='APPROVE'){const ok=window.confirm(`Permission required\n\nJourney: ${p.engagementRef}\nAgent: ${p.agentName}\nTask: ${p.action}\n\nApprove this agent to execute this task within the CarePath demo boundary?`);if(!ok)return}try{const d=await api(`/api/agents/proposals/${encodeURIComponent(id)}/decision`,{method:'POST',body:JSON.stringify({decision})});state.proposals=state.proposals.map(x=>x.id===id?d.proposal:x);render();const target=document.querySelector<HTMLElement>('#ag-detail');if(target)target.innerHTML=`<div class="ag-result ${decision==='APPROVE'?'success':''}"><b>${decision==='APPROVE'?'Approved and executed':'Permission declined'}</b><span>${esc(d.message)}</span><small>${esc(d.proposal.executionNote||'')}</small><strong>${esc(d.proposal.engagementRef)}</strong></div>`}catch(e:any){alert(e.message)}}

async function createReference(){const title=window.prompt('Name this CarePath engagement. A reference number will be used throughout the process.','New patient care engagement');if(!title)return;try{const d=await api('/api/agents/references',{method:'POST',body:JSON.stringify({title})});state.standalone.unshift(d.engagement);state.selectedRef=d.engagement.reference;render()}catch(e:any){alert(e.message)}}

async function decorateReferences(){
  let refs=state.references;if(!refs.length){try{refs=(await api('/api/agents/references')).references||[]}catch{return}}
  const map=new Map(refs.filter(r=>r.referralId).map(r=>[r.referralId!,r.reference]));
  document.querySelectorAll<HTMLElement>('[data-referral]').forEach(el=>{const id=el.dataset.referral,ref=id?map.get(id):undefined;if(!ref||el.querySelector('.ag-ref-badge'))return;const badge=document.createElement('span');badge.className='ag-ref-badge';badge.textContent=ref;badge.title='CarePath Journey Reference — use this number throughout the engagement';el.prepend(badge)});
}

function run(){ensureNav();ensureHomeAction();if(active)decorateReferences();else decorateReferences()}
const observer=new MutationObserver(()=>window.requestAnimationFrame(run));observer.observe(document.documentElement,{childList:true,subtree:true});run();
