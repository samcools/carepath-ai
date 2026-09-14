import './simple-ux.css';

const text=(el:Element|null)=>el?.textContent?.trim()||'';
const visible=(el:HTMLElement)=>getComputedStyle(el).display!=='none';

const primaryMatchers=[
  (s:string)=>/Command Centre|My Overview|Home/i.test(s),
  (s:string)=>/Care Flow/i.test(s),
  (s:string)=>/^Patients$|My Record/i.test(s),
  (s:string)=>/Appointment Centre|My Appointments/i.test(s),
  (s:string)=>/^Facilities$/i.test(s)
];

function clickNav(match:RegExp){
  const btn=[...document.querySelectorAll<HTMLButtonElement>('.topbar nav button')].find(b=>match.test(text(b)));
  btn?.click();
}

function simplifyNav(){
  const nav=document.querySelector<HTMLElement>('.topbar nav');
  if(!nav)return;
  const buttons=[...nav.querySelectorAll<HTMLButtonElement>(':scope > button')].filter(b=>b.id!=='ux-more-btn');
  if(!buttons.length)return;

  for(const b of buttons){
    const label=text(b);
    const isPrimary=primaryMatchers.some(m=>m(label));
    b.classList.toggle('ux-secondary-hidden',!isPrimary);
    if(/Command Centre|My Overview/i.test(label)&&!b.dataset.uxHome){b.dataset.uxHome='1';b.innerHTML='<span>⌂</span>Home'}
  }

  let wrap=nav.querySelector<HTMLElement>('.ux-more');
  if(!wrap){
    wrap=document.createElement('div');wrap.className='ux-more';
    wrap.innerHTML='<button id="ux-more-btn" type="button"><span>•••</span>More</button><div class="ux-more-menu"></div>';
    nav.appendChild(wrap);
    wrap.querySelector<HTMLButtonElement>('#ux-more-btn')?.addEventListener('click',e=>{e.stopPropagation();wrap?.classList.toggle('open');buildMoreMenu()});
  }
  buildMoreMenu();
}

function buildMoreMenu(){
  const nav=document.querySelector<HTMLElement>('.topbar nav');
  const menu=nav?.querySelector<HTMLElement>('.ux-more-menu');
  if(!nav||!menu)return;
  const hidden=[...nav.querySelectorAll<HTMLButtonElement>(':scope > button.ux-secondary-hidden')];
  const common=hidden.filter(b=>!/Audit|Admin|FHIR|Exchange|Population|Identity|Emergency|Watch|Workspace/i.test(text(b)));
  const advanced=hidden.filter(b=>!common.includes(b));
  const group=(label:string,items:HTMLButtonElement[])=>items.length?`<div class="ux-more-heading">${label}</div>`+items.map((b,i)=>`<button type="button" data-ux-more="${label}-${i}">${text(b)}</button>`).join(''):'';
  menu.innerHTML=group('Care tools',common)+group('Advanced & governance',advanced);
  [...menu.querySelectorAll<HTMLButtonElement>('button[data-ux-more]')].forEach((m,i)=>m.addEventListener('click',()=>{
    const all=[...common,...advanced];const label=text(m);const target=all.find(b=>text(b)===label)||all[i];target?.click();nav.querySelector('.ux-more')?.classList.remove('open');
  }));
}

function simplifyUserSwitch(){
  const box=document.querySelector<HTMLElement>('.user-type-switch');
  if(!box)return;
  box.title='Switch the demo role to see what each healthcare user is allowed to do.';
  const sel=box.querySelector('select');if(sel)sel.setAttribute('aria-label','View CarePath as user type');
}

function addHomeActions(){
  const heading=document.querySelector<HTMLElement>('.page-heading');
  if(!heading||!document.querySelector('.metric-grid')||document.querySelector('.ux-home-actions'))return;
  const section=document.createElement('section');section.className='ux-home-actions';
  section.innerHTML=`<header><div><h2>What would you like to do?</h2><p>Start with the patient. CarePath will guide you to the right next step.</p></div></header><div class="ux-home-action-grid"><button data-go="flow"><b>Start a patient journey</b><span>Choose a patient, care need, hospital, bed, booking and transport.</span></button><button data-go="patient"><b>Find a patient</b><span>Open the authorised longitudinal record, history, medicines and results.</span></button><button data-go="facility"><b>Find a hospital or clinic</b><span>Browse by province, city, services and available synthetic capacity.</span></button></div>`;
  heading.insertAdjacentElement('afterend',section);
  section.querySelector<HTMLButtonElement>('[data-go="flow"]')?.addEventListener('click',()=>clickNav(/Care Flow/i));
  section.querySelector<HTMLButtonElement>('[data-go="patient"]')?.addEventListener('click',()=>clickNav(/^Patients$|My Record/i));
  section.querySelector<HTMLButtonElement>('[data-go="facility"]')?.addEventListener('click',()=>clickNav(/^Facilities$/i));

  const tools=document.querySelector<HTMLElement>('.feature-grid');
  if(tools&&!document.querySelector('.ux-tools-toggle')){
    tools.classList.add('ux-tools-collapsed');
    const toggle=document.createElement('button');toggle.className='ux-tools-toggle';toggle.type='button';toggle.textContent='Show all CarePath tools';
    tools.insertAdjacentElement('beforebegin',toggle);
    toggle.addEventListener('click',()=>{const hidden=tools.classList.toggle('ux-tools-collapsed');toggle.textContent=hidden?'Show all CarePath tools':'Hide extra tools'});
  }
}

function simplifyBanner(){
  const banner=document.querySelector<HTMLElement>('.synthetic-banner');
  if(!banner||banner.dataset.uxSimple)return;banner.dataset.uxSimple='1';
  const strong=banner.querySelector('strong');if(strong)strong.textContent='Demo mode';
  const span=[...banner.querySelectorAll('span')].find(s=>!s.classList.contains('pulse'));if(span)span.textContent='Synthetic patients, beds and ambulances — no live health-system data.';
}

let wizardStep=0;
const wizardNames=['Patient & need','Hospital','Booking','Transport','Review'];
function setWizardStep(step:number){
  const builder=document.querySelector<HTMLElement>('.cf-builder');if(!builder)return;
  const grid=builder.querySelector<HTMLElement>('.cf-builder-grid');const cards=[...builder.querySelectorAll<HTMLElement>('.cf-form-card')];const footer=builder.querySelector<HTMLElement>('footer');
  if(!grid||cards.length<4||!footer)return;
  wizardStep=Math.max(0,Math.min(4,step));builder.dataset.uxStep=String(wizardStep);
  cards.forEach((c,i)=>c.classList.toggle('ux-current-step',i===wizardStep));
  footer.classList.toggle('ux-hidden-review',wizardStep!==4);
  builder.querySelectorAll<HTMLElement>('.ux-wizard-step').forEach((s,i)=>{s.classList.toggle('active',i===wizardStep);s.classList.toggle('done',i<wizardStep)});
  const count=builder.querySelector<HTMLElement>('#ux-step-count');if(count)count.textContent=`Step ${wizardStep+1} of 5`;
  const title=builder.querySelector<HTMLElement>('#ux-step-title');if(title)title.textContent=wizardNames[wizardStep];
  const prev=builder.querySelector<HTMLButtonElement>('#ux-prev');if(prev)prev.disabled=wizardStep===0;
  const next=builder.querySelector<HTMLButtonElement>('#ux-next');if(next){next.style.display=wizardStep===4?'none':'';next.textContent=wizardStep===3?'Review allocation':'Continue'}
  if(wizardStep===4&&!footer.querySelector('.ux-review-intro'))footer.insertAdjacentHTML('afterbegin','<div class="ux-review-intro"><b>Review before sending</b><span>Check the selected patient, receiving facility, capacity, booking preference and transport plan. The receiving facility must still accept the allocation.</span></div>');
  builder.scrollIntoView({behavior:'smooth',block:'start'});
}

function validateStep(step:number){
  if(step===0){
    const reason=(document.querySelector<HTMLTextAreaElement>('#cf-reason')?.value||'').trim();
    if(reason.length<5){alert('Add a short reason for the care request before continuing.');document.querySelector<HTMLTextAreaElement>('#cf-reason')?.focus();return false}
  }
  if(step===1&&!document.querySelector<HTMLInputElement>('input[name="cf-facility"]:checked')){alert('Select a receiving hospital or clinic before continuing.');return false}
  return true;
}

function simplifyCareFlow(){
  const builder=document.querySelector<HTMLElement>('.cf-builder');
  if(!builder||builder.dataset.uxGuided)return;builder.dataset.uxGuided='1';
  const hero=document.querySelector<HTMLElement>('.cf-hero');
  if(hero){const h=hero.querySelector('h1');const p=hero.querySelector('p');if(h)h.textContent='Move the patient to the right care';if(p)p.textContent='CarePath guides you through the patient, hospital, capacity, booking and transport in a few simple steps.'}
  const header=builder.querySelector('header h2');if(header)header.textContent='Start a new patient journey';
  const grid=builder.querySelector<HTMLElement>('.cf-builder-grid');if(!grid)return;grid.classList.add('ux-guided');
  const wizard=document.createElement('div');wizard.className='ux-wizard';
  wizard.innerHTML=`<div class="ux-wizard-top"><div><b id="ux-step-title">Patient & need</b><span>Follow the guided steps — advanced details stay in the background.</span></div><span id="ux-step-count">Step 1 of 5</span></div><div class="ux-wizard-steps">${wizardNames.map((n,i)=>`<button class="ux-wizard-step" type="button" data-step="${i}"><b>${i+1}</b>${n}</button>`).join('')}</div><div class="ux-wizard-controls"><button id="ux-prev" class="ux-btn" type="button">Back</button><div class="ux-right"><button id="ux-next" class="ux-btn primary" type="button">Continue</button></div></div>`;
  grid.insertAdjacentElement('beforebegin',wizard);
  wizard.querySelectorAll<HTMLButtonElement>('[data-step]').forEach(b=>b.addEventListener('click',()=>{const step=Number(b.dataset.step);if(step<=wizardStep||validateStep(wizardStep))setWizardStep(step)}));
  wizard.querySelector<HTMLButtonElement>('#ux-prev')?.addEventListener('click',()=>setWizardStep(wizardStep-1));
  wizard.querySelector<HTMLButtonElement>('#ux-next')?.addEventListener('click',()=>{if(validateStep(wizardStep))setWizardStep(wizardStep+1)});
  setWizardStep(0);
}

function simplifyLogin(){
  const card=document.querySelector<HTMLElement>('.login-card');if(!card||card.dataset.uxSimple)return;card.dataset.uxSimple='1';
  const p=card.querySelector('p');if(p)p.textContent='Choose the role you want to demonstrate.';
  const hero=document.querySelector<HTMLElement>('.hero-copy p');if(hero)hero.textContent='One simple patient journey from record to hospital, booking, transport, care and follow-up.';
}

function run(){simplifyNav();simplifyUserSwitch();simplifyBanner();addHomeActions();simplifyCareFlow();simplifyLogin()}

document.addEventListener('click',e=>{const t=e.target as Node;if(!document.querySelector('.ux-more')?.contains(t))document.querySelector('.ux-more')?.classList.remove('open')});
const observer=new MutationObserver(()=>window.requestAnimationFrame(run));observer.observe(document.documentElement,{childList:true,subtree:true});
run();
