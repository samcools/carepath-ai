import './referral-experience.css';

type DemoUser = { id:string; username:string; displayName:string; role:string; facilityId:string|null; patientId?:string };
type Facility = { id:string; name:string; type:string; province:string; district:string; city?:string; services:string[]; totalAvailableBeds?:number; capacity?:Array<{bedType:string;staffedBeds:number;occupiedBeds:number;reservedBeds:number;availableBeds:number}> };
type Referral = { id:string; patientId:string; patientName:string; service:string; priority:string; status:string; sourceFacilityId:string; sourceFacilityName:string; destinationFacilityId:string; destinationFacilityName:string; requiresBed?:boolean; bedType?:string; bedAvailability?:{available:number}; updatedAt:string };

type SessionState = { user?:DemoUser; users:DemoUser[]; facilities:Facility[]; referrals:Referral[] };
const state:SessionState={users:[],facilities:[],referrals:[]};
const roleNames:Record<string,string>={ADMIN:'Administrator',CLINICIAN:'Referring clinician',SPECIALIST:'Specialist',NURSE:'Nurse',COORDINATOR:'Care coordinator',PHARMACIST:'Pharmacist',LAB_TECH:'Lab technologist',PATIENT_NAVIGATOR:'Patient navigator',MANAGER:'District manager',AUDITOR:'Auditor',PATIENT:'Patient'};

const esc=(value:unknown)=>String(value??'').replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch] as string));
const request=async(path:string,init?:RequestInit)=>{const r=await fetch(path,{credentials:'include',headers:{'Content-Type':'application/json',...(init?.headers||{})},...init});const body=await r.json().catch(()=>({}));if(!r.ok)throw new Error(body.error||body.message||`Request failed (${r.status})`);return body};
const fmt=(iso?:string)=>iso?new Date(iso).toLocaleString('en-ZA',{dateStyle:'medium',timeStyle:'short'}):'—';

async function loadState(force=false){
  if(!document.querySelector('.app-shell'))return false;
  if(force||!state.user){const me=await request('/api/auth/me');state.user=me.user;}
  if(force||!state.users.length){const u=await request('/api/demo/users');state.users=u.users||[];}
  if(force||!state.facilities.length){const f=await request('/api/facilities');state.facilities=f.facilities||[];}
  if(force||!state.referrals.length){const r=await request('/api/referrals');state.referrals=r.referrals||[];}
  return true;
}

function facilityName(id:string|null|undefined){return state.facilities.find(f=>f.id===id)?.name||'Cross-facility / national scope';}

async function ensureRoleConsole(){
  if(!document.querySelector('.app-shell')||document.querySelector('.carepath-role-console'))return;
  try{if(!await loadState())return;}catch{return;}
  const host=document.querySelector<HTMLElement>('.content');if(!host||!state.user)return;
  const bar=document.createElement('section');bar.className='carepath-role-console';
  const options=state.users.map(u=>`<option value="${esc(u.username)}" ${u.username===state.user?.username?'selected':''}>${esc(roleNames[u.role]||u.role)} — ${esc(u.displayName)}</option>`).join('');
  bar.innerHTML=`<div class="role-console-copy"><span>DEMO USER CONTEXT</span><b>${esc(roleNames[state.user.role]||state.user.role)}</b><small>${esc(facilityName(state.user.facilityId))}</small></div><label>Switch user<select id="carepath-demo-user">${options}</select></label><div class="role-console-note">Change role instantly to demonstrate referring clinic, receiving hospital, management, audit and patient views.</div>`;
  const banner=host.querySelector('.synthetic-banner');banner?.insertAdjacentElement('afterend',bar);if(!banner)host.prepend(bar);
  const roleSelect=bar.querySelector<HTMLSelectElement>('#carepath-demo-user');
  roleSelect?.addEventListener('change',async()=>{if(!roleSelect)return;roleSelect.disabled=true;try{await request('/api/auth/switch-demo',{method:'POST',body:JSON.stringify({username:roleSelect.value})});window.location.reload()}catch(err){roleSelect.disabled=false;alert(err instanceof Error?err.message:String(err))}});
}

function navButton(text:string){return [...document.querySelectorAll<HTMLButtonElement>('.topbar nav button')].find(b=>b.textContent?.toLowerCase().includes(text.toLowerCase()));}
function clickNav(text:string){navButton(text)?.click();}
function later(fn:()=>void,delay=160){window.setTimeout(fn,delay)}

function openReferralList(stale=false){clickNav('Referrals');if(stale)later(()=>{[...document.querySelectorAll<HTMLButtonElement>('.toolbar button')].find(b=>b.textContent?.includes('24h'))?.click()},220)}

function ensureMetricDrilldowns(){
  document.querySelectorAll<HTMLElement>('.metric').forEach(card=>{
    if(card.dataset.drillBound)return;
    const label=card.textContent?.toLowerCase()||'';
    let action:(()=>void)|undefined;
    if(label.includes('patient'))action=()=>clickNav('Patients');
    else if(label.includes('stale')||label.includes('waiting'))action=()=>openReferralList(true);
    else if(label.includes('referral')||label.includes('acceptance'))action=()=>openReferralList(false);
    else if(label.includes('appointment')||label.includes('scheduled'))action=()=>clickNav('Appointment');
    else if(label.includes('bed')||label.includes('facilit'))action=()=>clickNav('Facilities');
    else if(label.includes('ambulance'))action=()=>clickNav('Ambulance');
    else if(label.includes('notification'))action=()=>clickNav('Notifications');
    else if(label.includes('vaccine')||label.includes('medication'))action=()=>clickNav('Medication');
    if(!action)return;
    card.dataset.drillBound='1';card.classList.add('metric-clickable');card.setAttribute('role','button');card.tabIndex=0;card.title='Open details';
    card.addEventListener('click',action);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();action?.()}});
  });
}

function referralPage(){const title=document.querySelector<HTMLElement>('.page-title');return Boolean(title?.textContent?.toLowerCase().includes('carepath journey')||title?.querySelector('h1')?.textContent?.startsWith('Referrals'))}

function facilityCard(f:Facility){
  const bedRows=(f.capacity||[]).map(c=>`<div class="destination-bed"><span>${esc(String(c.bedType).replaceAll('_',' '))}</span><b>${c.availableBeds} available</b></div>`).join('');
  return `<article class="destination-card" data-facility-id="${esc(f.id)}"><header><div><span>${esc(f.type)}</span><h3>${esc(f.name)}</h3><p>${esc(f.city||f.district)} • ${esc(f.province)}</p></div><strong>${f.totalAvailableBeds??0}<small>beds*</small></strong></header><div class="destination-services">${(f.services||[]).map(s=>`<span>${esc(s)}</span>`).join('')}</div>${bedRows?`<div class="destination-beds">${bedRows}</div>`:''}<button type="button" class="destination-open">View hospital / clinic</button></article>`;
}

async function ensureReferralPlanner(){
  if(!referralPage()||document.querySelector('.referral-planner'))return;
  try{await loadState();}catch{return;}
  const anchor=document.querySelector<HTMLElement>('.toolbar')||document.querySelector<HTMLElement>('.page-title');if(!anchor)return;
  const services=[...new Set(state.facilities.flatMap(f=>f.services||[]))].sort();
  const wrapper=document.createElement('section');wrapper.className='referral-planner';
  wrapper.innerHTML=`<div class="planner-heading"><div><span>REFERRAL PLANNING</span><h2>Choose the right destination with context</h2><p>Referring clinicians can compare the receiving facility, available services and synthetic capacity before or while managing a referral.</p></div><div class="planner-trust">Patient history remains available to the authorised referring care team for continuity of care.</div></div><div class="planner-controls"><label>Search destination<input id="referral-destination-search" placeholder="Hospital, city, province or service"></label><label>Service<select id="referral-service-filter"><option value="ALL">All services</option>${services.map(s=>`<option value="${esc(s)}">${esc(s)}</option>`).join('')}</select></label></div><div id="referral-destinations" class="destination-grid"></div><small class="planner-disclaimer">* Synthetic demonstration capacity and directory information; not a live national bed or facility registry.</small>`;
  anchor.insertAdjacentElement('afterend',wrapper);
  const search=wrapper.querySelector<HTMLInputElement>('#referral-destination-search')!;const service=wrapper.querySelector<HTMLSelectElement>('#referral-service-filter')!;const grid=wrapper.querySelector<HTMLElement>('#referral-destinations')!;
  const draw=()=>{const q=search.value.trim().toLowerCase(),s=service.value;const list=state.facilities.filter(f=>['PUBLIC','PRIVATE'].includes(f.type)).filter(f=>(!q||`${f.name} ${f.city||''} ${f.district} ${f.province} ${(f.services||[]).join(' ')}`.toLowerCase().includes(q))&&(s==='ALL'||(f.services||[]).includes(s)));grid.innerHTML=list.map(facilityCard).join('')||'<div class="destination-empty">No destination matches the selected criteria.</div>';grid.querySelectorAll<HTMLButtonElement>('.destination-open').forEach(btn=>btn.onclick=()=>{const card=btn.closest<HTMLElement>('[data-facility-id]');if(card)openFacility(card.dataset.facilityId||'')})};
  search.addEventListener('input',draw);service.addEventListener('change',draw);draw();
}

function openFacility(id:string){clickNav('Facilities');let attempts=0;const timer=window.setInterval(()=>{attempts++;const card=[...document.querySelectorAll<HTMLElement>('[data-facility]')].find(x=>x.dataset.facility===id);if(card){window.clearInterval(timer);card.click();card.scrollIntoView({behavior:'smooth',block:'start'})}else if(attempts>20)window.clearInterval(timer)},140)}
function openPatientByName(name:string){clickNav('Patients');let attempts=0;const timer=window.setInterval(()=>{attempts++;const card=[...document.querySelectorAll<HTMLButtonElement>('.patient-card')].find(x=>x.textContent?.includes(name));if(card){window.clearInterval(timer);card.click();card.scrollIntoView({behavior:'smooth',block:'center'})}else if(attempts>20)window.clearInterval(timer)},140)}

function provenanceList(items:any[],empty:string){return items?.length?items.map(it=>`<div class="history-row"><div><b>${esc(it.label||it.vaccine||it.service||'Record')}</b><span>${esc(it.detail||it.dose||'')}</span></div><small>${esc(it.status||'Recorded')} • ${esc(it.sourceFacility||it.administeredFacility||'Source recorded')} • ${esc(it.recordedAt?fmt(it.recordedAt):it.administeredAt?fmt(it.administeredAt):'')}</small></div>`).join(''):`<div class="history-empty">${esc(empty)}</div>`}

async function openReferralWorkspace(referralId:string){
  let overlay=document.querySelector<HTMLElement>('.referral-workspace-overlay');if(!overlay){overlay=document.createElement('div');overlay.className='referral-workspace-overlay';document.body.appendChild(overlay)}
  overlay.innerHTML='<div class="referral-workspace"><div class="workspace-loading">Loading authorised referral context…</div></div>';
  try{await loadState(true);const r=state.referrals.find(x=>x.id===referralId);if(!r)throw new Error('Referral is not visible in this user scope.');const patientData=await request(`/api/patients/${encodeURIComponent(r.patientId)}`);const p=patientData.patient;const destination=state.facilities.find(f=>f.id===r.destinationFacilityId);const source=state.facilities.find(f=>f.id===r.sourceFacilityId);const capacity=destination?.capacity||[];overlay.innerHTML=`<div class="referral-workspace"><header class="workspace-header"><div><span>REFERRAL CONTEXT WORKSPACE</span><h2>${esc(r.patientName)} → ${esc(r.destinationFacilityName)}</h2><p>${esc(r.service)} • ${esc(r.priority)} • ${esc(r.status.replaceAll('_',' '))}</p></div><button class="workspace-close" aria-label="Close">×</button></header><section class="workspace-summary"><div><span>Referring facility</span><b>${esc(source?.name||r.sourceFacilityName)}</b><small>${esc(source?.city||source?.district||'')} ${esc(source?.province||'')}</small></div><div><span>Receiving facility</span><b>${esc(destination?.name||r.destinationFacilityName)}</b><small>${esc(destination?.city||destination?.district||'')} ${esc(destination?.province||'')}</small></div><div><span>Referral status</span><b>${esc(r.status.replaceAll('_',' '))}</b><small>Updated ${esc(fmt(r.updatedAt))}</small></div><div><span>Capacity context</span><b>${r.requiresBed?`${r.bedAvailability?.available??destination?.totalAvailableBeds??0} ${esc(r.bedType||'beds')} available*`:'Outpatient referral'}</b><small>Synthetic demonstration availability</small></div></section><div class="workspace-columns"><section class="workspace-panel patient-history"><header><div><span>AUTHORISED LONGITUDINAL HISTORY</span><h3>${esc(p.firstName)} ${esc(p.surname)}</h3><p>${esc(p.syntheticId)} • DOB ${esc(p.dateOfBirth)} • ${esc(p.preferredLanguage)}</p></div><button id="workspace-open-patient">Open full OneRecord</button></header><div class="history-critical"><h4>Allergies</h4>${provenanceList(p.allergies,'No allergies recorded.')}</div><div class="history-section"><h4>Conditions</h4>${provenanceList(p.conditions,'No conditions recorded.')}</div><div class="history-section"><h4>Current medication</h4>${provenanceList(p.medications,'No medication recorded.')}</div><div class="history-section"><h4>Recent results</h4>${provenanceList((p.results||[]).slice(0,5),'No recent results recorded.')}</div><div class="history-section"><h4>Recent encounters</h4>${provenanceList((p.encounters||[]).slice(0,5),'No encounters recorded.')}</div></section><section class="workspace-panel destination-detail"><header><div><span>RECEIVING FACILITY VIEW</span><h3>${esc(destination?.name||r.destinationFacilityName)}</h3><p>${esc(destination?.city||destination?.district||'')} • ${esc(destination?.province||'')} • ${esc(destination?.type||'Facility')}</p></div><button id="workspace-open-facility">Open facility</button></header><h4>Services available</h4><div class="destination-services">${(destination?.services||[]).map(s=>`<span class="${s.toLowerCase().includes(r.service.toLowerCase().split(' ')[0])?'match':''}">${esc(s)}</span>`).join('')||'<span>Service directory unavailable</span>'}</div><h4>Bed / capacity context</h4><div class="capacity-detail">${capacity.length?capacity.map(c=>`<div><span>${esc(String(c.bedType).replaceAll('_',' '))}</span><b>${c.availableBeds} available</b><small>${c.occupiedBeds} occupied • ${c.reservedBeds} reserved • ${c.staffedBeds} staffed</small></div>`).join(''):'<div class="history-empty">No inpatient bed inventory for this endpoint.</div>'}</div><div class="destination-safety"><b>Referral decision support</b><p>CarePath presents service match, location, pathway and synthetic capacity as explainable administrative context. The referring clinician remains responsible for the referral decision.</p></div><button id="workspace-open-appointments" class="workspace-primary">Open Appointment Centre</button></section></div><footer class="workspace-footer"><span>Access reason: active referral / continuity of care.</span><span>Patient-history reads remain subject to role, facility and referral scope.</span></footer></div>`;overlay.querySelector<HTMLButtonElement>('.workspace-close')!.onclick=()=>overlay?.remove();overlay.addEventListener('click',e=>{if(e.target===overlay)overlay?.remove()},{once:true});overlay.querySelector<HTMLButtonElement>('#workspace-open-patient')!.onclick=()=>{overlay?.remove();openPatientByName(r.patientName)};overlay.querySelector<HTMLButtonElement>('#workspace-open-facility')!.onclick=()=>{overlay?.remove();openFacility(r.destinationFacilityId)};overlay.querySelector<HTMLButtonElement>('#workspace-open-appointments')!.onclick=()=>{overlay?.remove();clickNav('Appointment')};
  }catch(err){overlay.innerHTML=`<div class="referral-workspace error"><header class="workspace-header"><div><span>REFERRAL CONTEXT WORKSPACE</span><h2>Unable to open referral context</h2></div><button class="workspace-close">×</button></header><p>${esc(err instanceof Error?err.message:String(err))}</p></div>`;overlay.querySelector<HTMLButtonElement>('.workspace-close')!.onclick=()=>overlay?.remove()}
}

async function ensureReferralRows(){
  if(!referralPage())return;try{await loadState();}catch{return;}
  const known=new Set(state.referrals.map(r=>r.id));document.querySelectorAll<HTMLTableRowElement>('.table-wrap tbody tr').forEach(row=>{if(row.dataset.referralWorkspace)return;const id=[...row.querySelectorAll('small')].map(x=>x.textContent?.trim()||'').find(x=>known.has(x));if(!id)return;row.dataset.referralWorkspace=id;row.classList.add('referral-row-clickable');row.title='Open patient history and receiving-facility context';const action=(row.querySelector<HTMLElement>('td.action-cell')||row.lastElementChild) as HTMLElement|null;if(action){const btn=document.createElement('button');btn.type='button';btn.className='referral-context-button';btn.textContent='View context';btn.onclick=e=>{e.stopPropagation();void openReferralWorkspace(id)};action.appendChild(btn)}row.addEventListener('click',e=>{const target=e.target as HTMLElement;if(target.closest('button,select,input,a'))return;void openReferralWorkspace(id)})});
}

let busy=false;
async function enhance(){if(busy)return;busy=true;try{await ensureRoleConsole();ensureMetricDrilldowns();await ensureReferralPlanner();await ensureReferralRows()}finally{busy=false}}
const observer=new MutationObserver(()=>void enhance());observer.observe(document.documentElement,{subtree:true,childList:true});
window.addEventListener('carepath:user-changed',()=>{state.user=undefined;state.users=[];state.facilities=[];state.referrals=[];document.querySelector('.carepath-role-console')?.remove();void enhance()});
void enhance();

export {};
