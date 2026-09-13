type DistrictResponse={province?:string;name?:string;metrics?:{facilities:number;openReferrals:number;availableBeds:number};facilities?:Array<{id:string;name:string;city?:string;type:string;services:string[];availableBeds:number}>};
const request=async(path:string)=>{const r=await fetch(path,{credentials:'include'});const b=await r.json().catch(()=>({}));if(!r.ok)throw new Error(b.error||`Request failed (${r.status})`);return b as DistrictResponse};
const escapeHtml=(v:unknown)=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]||c));
let activeKey='';

function provinceFromView(){const h=document.querySelector<HTMLElement>('.v05-hero h1');const text=h?.textContent?.trim()||'';return text.endsWith(' Command Centre')&&!text.startsWith('National')?text.replace(/ Command Centre$/,''):''}
function districtCard(){return [...document.querySelectorAll<HTMLElement>('.v05-card')].find(c=>c.querySelector('h2')?.textContent?.trim()==='Districts')||null}

function bindDistricts(){
  const province=provinceFromView();const card=districtCard();if(!province||!card)return;
  card.querySelectorAll<HTMLElement>('.v05-row').forEach(row=>{
    if(row.dataset.drillBound)return;row.dataset.drillBound='1';row.style.cursor='pointer';row.title='Open city, facility and service drill-down';
    row.addEventListener('click',async()=>{const district=row.querySelector('b')?.textContent?.trim();if(!district)return;await openDistrict(province,district)});
  });
}
async function openDistrict(province:string,district:string){
  const shell=document.querySelector<HTMLElement>('.v05-shell');if(!shell)return;const key=`${province}|${district}`;activeKey=key;
  let target=document.querySelector<HTMLElement>('#v05-district-detail');if(!target){target=document.createElement('section');target.id='v05-district-detail';target.className='v05-card full';shell.appendChild(target)}
  target.innerHTML='<div class="v05-empty">Loading city, facility and service drill-down…</div>';
  try{const data=await request(`/api/v05/command?level=district&province=${encodeURIComponent(province)}&district=${encodeURIComponent(district)}`);if(activeKey!==key)return;const facilities=data.facilities||[];const cities=[...new Set(facilities.map(f=>f.city||'Unspecified'))].sort();target.innerHTML=`<h2>${escapeHtml(district)} operational drill-down</h2><p>${escapeHtml(province)} • ${data.metrics?.facilities??facilities.length} facilities • ${data.metrics?.openReferrals??0} open referrals • ${data.metrics?.availableBeds??0} synthetic beds available</p><div class="v05-hierarchy"><span class="v05-chip good">South Africa</span><span class="v05-chip good">${escapeHtml(province)}</span><span class="v05-chip good">${escapeHtml(district)}</span><span class="v05-chip">City → Facility → Service</span></div>${cities.map(city=>`<div style="margin-top:18px"><h3>${escapeHtml(city)}</h3><div class="v05-grid">${facilities.filter(f=>(f.city||'Unspecified')===city).map(f=>`<article class="v05-card half" style="grid-column:span 6"><div style="display:flex;justify-content:space-between;gap:10px"><div><span class="v05-eyebrow">${escapeHtml(f.type)}</span><h3>${escapeHtml(f.name)}</h3></div><span class="v05-chip ${f.availableBeds===0?'critical':f.availableBeds<5?'warning':'good'}">${f.availableBeds} beds*</span></div><p><b>Services</b></p><div>${(f.services||[]).map(service=>`<span class="v05-chip">${escapeHtml(service)}</span>`).join('')}</div></article>`).join('')}</div></div>`).join('')}<p><small>* Synthetic capacity. Service entries are demonstration directory data, not a live national facility registry.</small></p>`;target.scrollIntoView({behavior:'smooth',block:'start'})}catch(e){target.innerHTML=`<div class="v05-alert danger">${escapeHtml(e instanceof Error?e.message:e)}</div>`}
}
const observer=new MutationObserver(()=>bindDistricts());observer.observe(document.documentElement,{subtree:true,childList:true});bindDistricts();
