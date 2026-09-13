import './facility-explorer.css';

type Facility={id:string;name:string;type:string;province:string;district:string;city?:string;services:string[];capacity?:any[];totalAvailableBeds?:number};

type ExplorerData={facilities:Facility[];referrals:any[];appointments:any[];transfers:any[];ambulances:any[];outcomes:any[]};

const cityByFacility:Record<string,string>={
  'fac-clinic-1':'Polokwane',
  'fac-clinic-2':'Johannesburg',
  'fac-hosp-1':'Johannesburg',
  'fac-hosp-2':'Pretoria',
  'fac-hosp-3':'Soweto',
  'fac-hosp-4':'Polokwane',
  'fac-hosp-5':'Midrand',
  'fac-lab-1':'Johannesburg',
  'fac-lab-2':'Polokwane',
  'fac-pharm-1':'Johannesburg'
};

const esc=(value:any)=>String(value??'').replace(/[&<>'"]/g,(ch)=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch] as string));
const api=async(path:string)=>{const r=await fetch(path,{credentials:'include'});if(!r.ok)throw new Error(`${path} ${r.status}`);return r.json()};
const cityOf=(f:Facility)=>f.city||cityByFacility[f.id]||f.district||'Not specified';
const capClass=(n:number)=>n===0?'full':n<=2?'warn':'good';
const typeLabel=(type:string)=>type==='PUBLIC'?'Public':type==='PRIVATE'?'Private':type==='LAB'?'Laboratory':'Pharmacy';

let cache:ExplorerData|null=null;
let mounting=false;

async function loadData():Promise<ExplorerData>{
  if(cache)return cache;
  const [facilitiesResult,referralsResult,appointmentsResult,transfersResult,ambulancesResult,outcomesResult]=await Promise.all([
    api('/api/facilities'),
    api('/api/referrals').catch(()=>({referrals:[]})),
    api('/api/appointments').catch(()=>({appointments:[]})),
    api('/api/transfers').catch(()=>({transfers:[]})),
    api('/api/ambulances').catch(()=>({ambulances:[]})),
    api('/api/outcomes').catch(()=>({facilities:[]}))
  ]);
  cache={
    facilities:facilitiesResult.facilities||[],
    referrals:referralsResult.referrals||[],
    appointments:appointmentsResult.appointments||[],
    transfers:transfersResult.transfers||[],
    ambulances:ambulancesResult.ambulances||[],
    outcomes:outcomesResult.facilities||[]
  };
  return cache;
}

function findFacilityPage(){
  const headings=[...document.querySelectorAll<HTMLElement>('.page-title')];
  return headings.find(h=>h.textContent?.includes('Facilities & capacity'))||null;
}

function originalFacilityGrid(pageTitle:HTMLElement){
  let node:Element|null=pageTitle.nextElementSibling;
  while(node){
    if(node.classList.contains('cards-grid'))return node as HTMLElement;
    node=node.nextElementSibling;
  }
  return null;
}

function renderList(root:HTMLElement,data:ExplorerData){
  const provinces=[...new Set(data.facilities.map(f=>f.province))].sort();
  root.innerHTML=`
    <div class="facility-filterbar">
      <label>Search facility or service<input id="fx-search" type="search" placeholder="e.g. cardiology, hospital, pharmacy"></label>
      <label>Province<select id="fx-province"><option value="ALL">All provinces</option>${provinces.map(p=>`<option value="${esc(p)}">${esc(p)}</option>`).join('')}</select></label>
      <label>City<select id="fx-city"><option value="ALL">All cities</option></select></label>
      <label>Facility type<select id="fx-type"><option value="ALL">All types</option><option value="PUBLIC">Public</option><option value="PRIVATE">Private</option><option value="LAB">Laboratory</option><option value="PHARMACY">Pharmacy</option></select></label>
    </div>
    <div class="facility-results-meta"><span id="fx-count"></span><span>Select a facility to open its full operational view</span></div>
    <div id="fx-grid" class="facility-explorer-grid"></div>`;

  const search=root.querySelector<HTMLInputElement>('#fx-search')!;
  const province=root.querySelector<HTMLSelectElement>('#fx-province')!;
  const city=root.querySelector<HTMLSelectElement>('#fx-city')!;
  const type=root.querySelector<HTMLSelectElement>('#fx-type')!;
  const grid=root.querySelector<HTMLElement>('#fx-grid')!;
  const count=root.querySelector<HTMLElement>('#fx-count')!;

  const updateCities=()=>{
    const cities=[...new Set(data.facilities.filter(f=>province.value==='ALL'||f.province===province.value).map(cityOf))].sort();
    const current=city.value;
    city.innerHTML=`<option value="ALL">All cities</option>${cities.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('')}`;
    if(cities.includes(current))city.value=current;
  };

  const draw=()=>{
    const q=search.value.trim().toLowerCase();
    const filtered=data.facilities.filter(f=>{
      const cityName=cityOf(f);
      const matchesSearch=!q||`${f.name} ${f.type} ${f.province} ${f.district} ${cityName} ${f.services.join(' ')}`.toLowerCase().includes(q);
      return matchesSearch&&(province.value==='ALL'||f.province===province.value)&&(city.value==='ALL'||cityName===city.value)&&(type.value==='ALL'||f.type===type.value);
    });
    count.textContent=`${filtered.length} of ${data.facilities.length} facilities shown`;
    grid.innerHTML=filtered.length?filtered.map(f=>{
      const incoming=data.referrals.filter(r=>r.destinationFacilityId===f.id).length;
      const appts=data.appointments.filter(a=>a.facilityId===f.id&&!['CANCELLED','COMPLETED','NO_SHOW'].includes(a.status)).length;
      const activeTransfers=data.transfers.filter(t=>!['COMPLETED','CANCELLED'].includes(t.status)&&(t.destinationFacilityId===f.id||t.pickupFacilityId===f.id)).length;
      return `<button class="facility-explorer-card" data-facility="${esc(f.id)}">
        <header><span class="facility-type ${esc(f.type.toLowerCase())}">${esc(typeLabel(f.type))}</span>${['PUBLIC','PRIVATE'].includes(f.type)?`<span class="capacity-pill ${capClass(f.totalAvailableBeds||0)}"><b>${f.totalAvailableBeds||0}</b> beds</span>`:''}</header>
        <h3>${esc(f.name)}</h3>
        <p>${esc(cityOf(f))} • ${esc(f.district)} • ${esc(f.province)}</p>
        <div class="facility-service-grid">${f.services.slice(0,5).map(s=>`<span>${esc(s)}</span>`).join('')}${f.services.length>5?`<span>+${f.services.length-5} more</span>`:''}</div>
        <div class="facility-card-kpis"><div><b>${incoming}</b><span>incoming referrals</span></div><div><b>${appts}</b><span>active bookings</span></div><div><b>${activeTransfers}</b><span>active transfers</span></div></div>
        <div class="facility-open-link"><span>Open full facility view</span><strong>→</strong></div>
      </button>`;
    }).join(''):`<div class="facility-empty">No facilities match the selected province, city, type or search term.</div>`;
    grid.querySelectorAll<HTMLElement>('[data-facility]').forEach(card=>card.addEventListener('click',()=>renderDetail(root,data,card.dataset.facility!)));
  };

  province.addEventListener('change',()=>{updateCities();draw()});
  city.addEventListener('change',draw);
  type.addEventListener('change',draw);
  search.addEventListener('input',draw);
  updateCities();draw();
}

function renderDetail(root:HTMLElement,data:ExplorerData,id:string){
  const f=data.facilities.find(x=>x.id===id);if(!f)return;
  const incoming=data.referrals.filter(r=>r.destinationFacilityId===f.id);
  const outgoing=data.referrals.filter(r=>r.sourceFacilityId===f.id);
  const appointments=data.appointments.filter(a=>a.facilityId===f.id);
  const activeAppointments=appointments.filter(a=>!['CANCELLED','COMPLETED','NO_SHOW'].includes(a.status));
  const transfers=data.transfers.filter(t=>t.destinationFacilityId===f.id||t.pickupFacilityId===f.id);
  const activeTransfers=transfers.filter(t=>!['COMPLETED','CANCELLED'].includes(t.status));
  const ambulances=data.ambulances.filter(a=>a.stationFacilityId===f.id||a.activeTransfer?.destinationFacilityName===f.name);
  const outcome=data.outcomes.find(o=>o.facilityId===f.id);
  const staffed=(f.capacity||[]).reduce((n:number,c:any)=>n+(c.staffedBeds||0),0);
  const occupied=(f.capacity||[]).reduce((n:number,c:any)=>n+(c.occupiedBeds||0),0);
  root.innerHTML=`<div class="facility-detail">
    <div class="facility-detail-top">
      <div><button id="fx-back" class="back">← All facilities</button><div style="margin-top:12px"><span class="facility-type ${esc(f.type.toLowerCase())}">${esc(typeLabel(f.type))}</span><h2>${esc(f.name)}</h2><p>${esc(cityOf(f))} • ${esc(f.district)} • ${esc(f.province)} • Synthetic demonstration facility</p><div class="tags">${f.services.map(s=>`<span>${esc(s)}</span>`).join('')}</div></div></div>
      <div class="facility-detail-actions"><button id="fx-appointments">Appointment Centre</button><button id="fx-transfers">Transfer Centre</button></div>
    </div>
    <div class="facility-detail-kpis"><div><b>${f.totalAvailableBeds||0}</b><span>beds available</span></div><div><b>${incoming.length}</b><span>incoming referrals</span></div><div><b>${activeAppointments.length}</b><span>active appointments</span></div><div><b>${activeTransfers.length}</b><span>active transfers</span></div><div><b>${ambulances.filter(a=>a.status==='AVAILABLE').length}</b><span>ambulances available</span></div></div>
    <div class="facility-detail-grid">
      <section class="facility-section"><h3>Services available</h3><div class="facility-service-grid">${f.services.map(s=>`<span>${esc(s)}</span>`).join('')}</div><div class="facility-disclaimer">Service-directory entries are synthetic and demonstrate how CarePath can support referral discovery.</div></section>
      <section class="facility-section"><h3>Bed capacity</h3>${f.capacity?.length?f.capacity.map((c:any)=>`<div class="facility-bed-row"><div><b>${esc(String(c.bedType).replaceAll('_',' '))}</b><span>${c.occupiedBeds} occupied • ${c.reservedBeds} reserved • ${c.staffedBeds} staffed</span></div><span class="capacity-pill ${capClass(c.availableBeds)}"><b>${c.availableBeds}</b> available</span></div>`).join(''):`<div class="facility-empty">No inpatient bed inventory for this endpoint.</div>`}<div class="facility-disclaimer">Total staffed ${staffed} • total occupied ${occupied}. Capacity is synthetic, not a live hospital feed.</div></section>
      <section class="facility-section"><h3>Referral activity</h3>${incoming.slice(0,6).map(r=>`<div class="facility-activity-row"><div><b>${esc(r.patientName||r.patientId)} — ${esc(r.service)}</b><span>Incoming • ${esc(String(r.status).replaceAll('_',' '))}</span></div><small>${esc(r.priority||'ROUTINE')}</small></div>`).join('')||'<div class="facility-empty">No visible incoming referrals.</div>'}<div class="facility-disclaimer">${incoming.length} incoming • ${outgoing.length} outgoing referrals visible in the current authorised scope.</div></section>
      <section class="facility-section"><h3>Appointments</h3>${appointments.slice(0,6).map(a=>`<div class="facility-activity-row"><div><b>${esc(a.patientName||a.patientId)} — ${esc(a.service)}</b><span>${esc(new Date(a.startAt).toLocaleString('en-ZA'))}</span></div><small>${esc(String(a.status).replaceAll('_',' '))}</small></div>`).join('')||'<div class="facility-empty">No visible appointments.</div>'}</section>
      <section class="facility-section"><h3>Ambulance & transfer availability</h3>${ambulances.slice(0,6).map(a=>`<div class="facility-activity-row"><div><b>${esc(a.callSign)} — ${esc(a.type)}</b><span>${esc(a.crew||'Synthetic crew')} • ETA ${esc(a.etaMinutes||'—')} min</span></div><small>${esc(a.status)}</small></div>`).join('')||'<div class="facility-empty">No ambulance is based at this facility in the current synthetic fleet.</div>'}<div class="facility-disclaimer">${activeTransfers.length} active transfer(s) currently involve this facility.</div></section>
      <section class="facility-section"><h3>Observed synthetic referral outcomes</h3>${outcome?`<div class="facility-outcome-box"><div><b>${outcome.referred}</b><span>referred</span></div><div><b>${outcome.recovered}</b><span>recovered</span></div><div><b>${outcome.improved}</b><span>improved</span></div><div><b>${outcome.deceased}</b><span>deceased</span></div></div><div class="facility-disclaimer">Observed favourable: ${outcome.favourableObservedPct??'—'}%. This is synthetic and not risk adjusted; it must not be interpreted as a hospital quality ranking.</div>`:'<div class="facility-empty">No outcome analytics are available for this facility in the current authorised scope.</div>'}</section>
    </div>
  </div>`;
  root.querySelector('#fx-back')?.addEventListener('click',()=>renderList(root,data));
  root.querySelector('#fx-appointments')?.addEventListener('click',()=>clickNav('Appointment Centre'));
  root.querySelector('#fx-transfers')?.addEventListener('click',()=>clickNav('Ambulance & Transfers'));
}

function clickNav(label:string){
  const button=[...document.querySelectorAll<HTMLButtonElement>('.topbar nav button')].find(b=>b.textContent?.includes(label));button?.click();
}

async function mount(){
  if(mounting)return;
  const page=findFacilityPage();
  if(!page)return;
  if(document.querySelector('.facility-explorer-root'))return;
  const grid=originalFacilityGrid(page);if(!grid)return;
  mounting=true;
  try{
    const data=await loadData();
    if(!findFacilityPage())return;
    grid.style.display='none';
    const root=document.createElement('section');root.className='facility-explorer-root';
    grid.parentElement?.insertBefore(root,grid);
    renderList(root,data);
  }catch(error){console.error('CarePath facility explorer failed to initialise',error)}finally{mounting=false}
}

const observer=new MutationObserver(()=>void mount());
observer.observe(document.documentElement,{subtree:true,childList:true});
window.addEventListener('carepath-refresh',()=>{cache=null;document.querySelector('.facility-explorer-root')?.remove();void mount()});
void mount();
