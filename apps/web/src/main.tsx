import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type User = { id: string; username: string; displayName: string; role: string; facilityId: string | null };
type Dashboard = { metrics: Record<string, number>; staleReferrals: any[]; recentAudit: any[] };
type PatientSummary = { id: string; syntheticId: string; firstName: string; surname: string; dateOfBirth: string; preferredLanguage: string; allergies: number; conditions: number; medications: number; results: number; encounters: number };
type PatientDetail = { patient: any; referrals: any[] };
type Referral = any;
type View = 'command' | 'patients' | 'referrals' | 'facilities' | 'audit';

const api = async (path: string, init?: RequestInit) => {
  const res = await fetch(path, { credentials: 'include', headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) }, ...init });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `Request failed (${res.status})`);
  return res.json();
};

const languages = [
  ['en-ZA','English'],['af-ZA','Afrikaans'],['zu-ZA','isiZulu'],['xh-ZA','isiXhosa'],['st-ZA','Sesotho'],['tn-ZA','Setswana'],['nso-ZA','Sepedi'],['ts-ZA','XiTsonga'],['ve-ZA','Tshivenda'],['ss-ZA','siSwati'],['nr-ZA','isiNdebele']
];

function Login({ onLogin }: { onLogin: (u: User) => void }) {
  const [username, setUsername] = useState('clinician');
  const [password, setPassword] = useState('CarePath!2026');
  const [error, setError] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    try { const data = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }); onLogin(data.user); }
    catch (err: any) { setError(err.message); }
  };
  return <div className="login-shell">
    <div className="login-visual">
      <img className="pyrneo-logo" src="/pyrneo.svg" alt="Pyrneo" />
      <div className="hero-copy">
        <div className="carepath-brand"><img src="/carepath-mark.svg" alt=""/><div><strong>CarePath AI</strong><span>One Patient. One Journey. One Trusted Health Record.</span></div></div>
        <h1>From referral to care — without losing the patient in between.</h1>
        <p>A secure synthetic-data demonstrator for longitudinal records, public-private interoperability and accountable care coordination.</p>
        <div className="hero-chips"><span>OneRecord</span><span>Exchange</span><span>Journey</span><span>Ayanda</span></div>
      </div>
    </div>
    <form className="login-card" onSubmit={submit}>
      <span className="eyebrow">HACKATHON DEMO</span>
      <h2>Sign in to CarePath</h2>
      <p>Use the seeded synthetic-data accounts.</p>
      <label>Username<input value={username} onChange={e=>setUsername(e.target.value)} /></label>
      <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></label>
      {error && <div className="error-banner">{error}</div>}
      <button className="primary" type="submit">Sign in</button>
      <div className="demo-note">Demo accounts: clinician, coordinator, manager, auditor, admin<br/>Password: <code>CarePath!2026</code></div>
    </form>
  </div>;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('command');
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientDetail | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [audit, setAudit] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [language, setLanguage] = useState('en-ZA');
  const [toast, setToast] = useState('');

  const refresh = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [d,p,r,f] = await Promise.all([api('/api/dashboard'), api('/api/patients'), api(`/api/referrals${filter==='stale'?'?filter=stale':''}`), api('/api/facilities')]);
      setDashboard(d); setPatients(p.patients); setReferrals(r.referrals); setFacilities(f.facilities);
      if (['AUDITOR','MANAGER','ADMIN'].includes(user.role)) { const a = await api('/api/audit'); setAudit(a.auditEvents); }
    } finally { setLoading(false); }
  };

  useEffect(() => { api('/api/auth/me').then(d=>setUser(d.user)).catch(()=>{}); }, []);
  useEffect(() => { if (user) refresh(); }, [user, filter]);

  const openPatient = async (id: string) => { setSelectedPatient(await api(`/api/patients/${id}`)); setView('patients'); };
  const logout = async () => { try { await api('/api/auth/logout', {method:'POST'}); } finally { setUser(null); } };

  if (!user) return <Login onLogin={setUser} />;

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand-row"><img className="top-pyrneo" src="/pyrneo.svg" alt="Pyrneo"/><span className="divider"/><img className="mini-mark" src="/carepath-mark.svg" alt=""/><strong>CarePath AI</strong></div>
      <nav>{[
        ['command','Command Centre'],['patients','Patients'],['referrals','Referrals'],['facilities','Facilities'], ...( ['AUDITOR','MANAGER','ADMIN'].includes(user.role) ? [['audit','Audit']] : [] )
      ].map(([id,label]) => <button key={id} className={view===id?'active':''} onClick={()=>setView(id as View)}>{label}</button>)}</nav>
      <div className="userbox"><span>{user.displayName}<small>{user.role}</small></span><button onClick={logout}>Sign out</button></div>
    </header>
    <main className="content">
      <div className="synthetic-banner"><strong>Synthetic Demo Data</strong><span>No live patient or health-system data is connected.</span>{loading && <span className="pulse">Refreshing…</span>}</div>
      {view === 'command' && <CommandCentre dashboard={dashboard} setView={setView}/>} 
      {view === 'patients' && <Patients patients={patients} selected={selectedPatient} onOpen={openPatient} onBack={()=>setSelectedPatient(null)} />}
      {view === 'referrals' && <Referrals referrals={referrals} filter={filter} setFilter={setFilter} refresh={refresh} user={user}/>} 
      {view === 'facilities' && <Facilities facilities={facilities}/>} 
      {view === 'audit' && <Audit events={audit}/>} 
    </main>
    <Ayanda language={language} setLanguage={setLanguage} onNavigate={(v:View)=>setView(v)} onOpenPatient={openPatient} onFilter={(f:string)=>{setFilter(f); setView('referrals');}} onChanged={()=>{refresh(); setToast('CarePath updated successfully.');}}/>
    {toast && <div className="toast" onAnimationEnd={()=>setToast('')}>{toast}</div>}
  </div>;
}

function CommandCentre({ dashboard, setView }: any) {
  if (!dashboard) return <Empty message="Loading CarePath Command Centre…"/>;
  const m = dashboard.metrics;
  return <>
    <section className="page-heading"><div><span className="eyebrow">CAREPATH COMMAND</span><h1>Continuity of care, visible.</h1><p>One operational view across longitudinal records, referrals, exceptions and accountable next actions.</p></div><div className="northstar">One Patient.<br/><b>One Journey.</b><br/>One Trusted Health Record.</div></section>
    <section className="metric-grid">
      <Metric label="Synthetic patients" value={m.patients} icon="◎" />
      <Metric label="Open referrals" value={m.openReferrals} icon="↗" />
      <Metric label="Awaiting acceptance" value={m.awaitingAcceptance} icon="◷" warn />
      <Metric label="Scheduled" value={m.scheduled} icon="□" />
      <Metric label="Stale >24h" value={m.stale} icon="!" critical />
      <Metric label="Connected demo facilities" value={m.facilities} icon="⌂" />
    </section>
    <section className="two-col">
      <Panel title="Referral leakage / action queue" action={<button onClick={()=>setView('referrals')}>Open referrals</button>}>
        {dashboard.staleReferrals.length ? dashboard.staleReferrals.map((r:any)=><div className="list-row" key={r.id}><div><b>{r.patientName}</b><span>{r.service} • {r.destinationName}</span></div><Status status={r.status}/><small>{age(r.updatedAt)}</small></div>) : <Empty message="No stale referrals."/>}
      </Panel>
      <Panel title="Recent governed activity">
        {dashboard.recentAudit.map((a:any)=><div className="activity" key={a.id}><span className="activity-dot"/><div><b>{a.action}</b><span>{a.actor}</span></div><small>{formatTime(a.at)}</small></div>)}
      </Panel>
    </section>
    <section className="journey-strip"><div><span>IDENTITY</span><b>Trusted patient match</b></div><i>→</i><div><span>ONERECORD</span><b>Longitudinal context</b></div><i>→</i><div><span>EXCHANGE</span><b>Authorised interoperability</b></div><i>→</i><div><span>JOURNEY</span><b>Referral to closure</b></div></section>
  </>;
}

function Patients({patients, selected, onOpen, onBack}: any) {
  if (selected) return <PatientRecord data={selected} onBack={onBack}/>;
  return <><PageTitle eyebrow="CAREPATH ONERECORD" title="Patients" desc="Synthetic longitudinal patient records with source provenance."/><div className="cards-grid">{patients.map((p:any)=><button className="patient-card" key={p.id} onClick={()=>onOpen(p.id)}><div className="avatar">{p.firstName[0]}{p.surname[0]}</div><div><h3>{p.firstName} {p.surname}</h3><span>{p.syntheticId} • {p.preferredLanguage}</span><div className="patient-stats"><small>{p.conditions} conditions</small><small>{p.medications} medications</small><small>{p.allergies} allergies</small></div></div><span className="chevron">›</span></button>)}</div></>;
}

function PatientRecord({data,onBack}: any) {
  const p=data.patient;
  const sections=[['Allergies',p.allergies,'critical'],['Conditions',p.conditions,'blue'],['Current medication',p.medications,'green'],['Results',p.results,'blue'],['Encounters',p.encounters,'']];
  return <><button className="back" onClick={onBack}>← All patients</button><section className="patient-hero"><div className="avatar large">{p.firstName[0]}{p.surname[0]}</div><div><span className="eyebrow">SYNTHETIC LONGITUDINAL RECORD</span><h1>{p.firstName} {p.surname}</h1><p>{p.syntheticId} • DOB {p.dateOfBirth} • Preferred language: {p.preferredLanguage}</p></div><div className="trust-badge">✓ Trusted demo view<span>Source provenance visible</span></div></section>
    <div className="record-layout"><div>{sections.map(([title,items,tone]:any)=><Panel key={title} title={title}><div className="record-list">{items.length?items.map((it:any)=><div className={`record-item ${tone}`} key={it.id}><div><b>{it.label}</b><span>{it.detail}</span></div><div className="provenance"><strong>{it.status}</strong><span>{it.sourceFacility}</span><small>{formatDate(it.recordedAt)}</small></div></div>):<Empty message={`No ${title.toLowerCase()} recorded in the synthetic dataset.`}/>}</div></Panel>)}</div><aside><Panel title="Care journey"><div className="timeline">{data.referrals.map((r:any)=><div className="timeline-item" key={r.id}><span/><div><b>{r.service} referral</b><small>{r.sourceFacilityName} → {r.destinationFacilityName}</small><Status status={r.status}/></div></div>)}</div></Panel><div className="safety-note"><b>Clinical safety boundary</b><p>CarePath organises and explains authorised information. It does not diagnose, prescribe or replace clinical judgement.</p></div></aside></div>
  </>;
}

function Referrals({ referrals, filter, setFilter, refresh, user }: any) {
  const allowed = user.role==='CLINICIAN' || user.role==='ADMIN';
  const transition = async (id:string,to:string) => { await api(`/api/referrals/${id}/transition`, {method:'POST',body:JSON.stringify({to})}); await refresh(); };
  return <><PageTitle eyebrow="CAREPATH JOURNEY" title="Referrals" desc="Governed hand-offs with explicit state, ownership, exceptions and auditability."/><div className="toolbar"><button className={filter==='all'?'active':''} onClick={()=>setFilter('all')}>All referrals</button><button className={filter==='stale'?'active':''} onClick={()=>setFilter('stale')}>Waiting &gt;24h</button></div><Panel title={`${referrals.length} referral${referrals.length===1?'':'s'}`}><div className="table-wrap"><table><thead><tr><th>Patient</th><th>Service</th><th>From</th><th>Destination</th><th>Status</th><th>Age</th><th>Next action</th></tr></thead><tbody>{referrals.map((r:any)=><tr key={r.id}><td><b>{r.patientName}</b><small>{r.id}</small></td><td>{r.service}<small>{r.priority}</small></td><td>{r.sourceFacilityName}</td><td>{r.destinationFacilityName}</td><td><Status status={r.status}/></td><td>{age(r.updatedAt)}</td><td>{allowed&&r.status==='DRAFT'?<button onClick={()=>transition(r.id,'SUBMITTED')}>Submit</button>:r.status==='SUBMITTED'&&user.role!=='CLINICIAN'?<button onClick={()=>transition(r.id,'RECEIVED')}>Receive</button>:<span className="muted">Governed state</span>}</td></tr>)}</tbody></table></div></Panel></>;
}

function Facilities({facilities}:any){return <><PageTitle eyebrow="CAREPATH EXCHANGE" title="Facilities & services" desc="Configured synthetic facilities for interoperability and routing demonstrations."/><div className="cards-grid">{facilities.map((f:any)=><div className="facility-card" key={f.id}><span className={`facility-type ${f.type.toLowerCase()}`}>{f.type}</span><h3>{f.name}</h3><p>{f.district}, {f.province}</p><div className="tags">{f.services.map((s:string)=><span key={s}>{s}</span>)}</div><small>Demo/configured record — not live capacity data</small></div>)}</div></>}
function Audit({events}:any){return <><PageTitle eyebrow="GOVERNANCE" title="Audit & provenance" desc="Who did what, when, through which channel, and with what outcome."/><Panel title="Audit events"><div className="audit-list">{events.map((a:any)=><div className="audit-row" key={a.id}><span className={`outcome ${a.outcome.toLowerCase()}`}>{a.outcome}</span><div><b>{a.action}</b><span>{a.objectType} • {a.objectId}</span></div><div><b>{a.actor}</b><span>{a.source}</span></div><small>{formatTime(a.at)}</small></div>)}</div></Panel></>}

function Ayanda({ language, setLanguage, onNavigate, onOpenPatient, onFilter, onChanged}:any){
  const [open,setOpen]=useState(false); const [input,setInput]=useState(''); const [messages,setMessages]=useState<any[]>([{who:'ai',text:'Sawubona. I’m Ayanda. I can help you navigate CarePath, inspect authorised synthetic records and propose governed workflow actions.'}]); const [pending,setPending]=useState<any>(null); const [listening,setListening]=useState(false); const speechRef=useRef<any>(null);
  const speak=(text:string)=>{ if(!('speechSynthesis' in window))return; window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang=language; window.speechSynthesis.speak(u); };
  const send=async(text=input,source='TEXT')=>{ if(!text.trim())return; setMessages(m=>[...m,{who:'user',text}]); setInput(''); try{const r=await api('/api/ayanda',{method:'POST',body:JSON.stringify({input:text,source:source==='VOICE'?'VOICE':'AI'})}); setMessages(m=>[...m,{who:'ai',text:r.text}]); if(r.navigate)onNavigate(r.navigate); if(r.patientId)onOpenPatient(r.patientId); if(r.filter)onFilter(r.filter); if(r.confirmationRequired)setPending(r.proposedAction); speak(r.text);}catch(e:any){setMessages(m=>[...m,{who:'ai',text:e.message}]);}};
  const confirm=async()=>{const r=await api('/api/ayanda/execute',{method:'POST',body:JSON.stringify({confirmed:true,action:pending})});setPending(null);setMessages(m=>[...m,{who:'ai',text:r.text}]);onChanged();speak(r.text)};
  const listen=()=>{ const SR=(window as any).SpeechRecognition||(window as any).webkitSpeechRecognition; if(!SR){setMessages(m=>[...m,{who:'ai',text:'Voice recognition is not available in this browser. Text chat remains available.'}]);return;} if(speechRef.current){speechRef.current.stop();return;} const rec=new SR();speechRef.current=rec;rec.lang=language;rec.interimResults=false;rec.continuous=false;rec.onstart=()=>setListening(true);rec.onend=()=>{setListening(false);speechRef.current=null};rec.onerror=()=>{setListening(false);speechRef.current=null};rec.onresult=(e:any)=>{const t=e.results[0][0].transcript;setInput(t);send(t,'VOICE')};rec.start(); };
  return <><button className={`ayanda-launcher ${open?'open':''}`} onClick={()=>setOpen(!open)}><img src="/carepath-mark.svg" alt=""/><span>Ayanda</span></button>{open&&<aside className="ayanda-panel"><header><div><b>Ayanda</b><span>CarePath AI assistant</span></div><select value={language} onChange={e=>setLanguage(e.target.value)}>{languages.map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></header><div className="assistant-safety">Administrative and information support only — clinical decisions remain with authorised professionals.</div><div className="messages">{messages.map((m,i)=><div key={i} className={`message ${m.who}`}>{m.text}</div>)}</div>{pending&&<div className="confirmation"><b>Confirmation required</b><p>This will create a referral draft through a governed server-side tool.</p><div><button onClick={()=>setPending(null)}>Cancel</button><button className="primary" onClick={confirm}>Confirm</button></div></div>}<div className="composer"><button className={listening?'listening':''} onClick={listen} aria-label="Voice input">{listening?'■':'◉'}</button><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')send()}} placeholder='Try “Hey Ayanda, open Thandi Mokoena”'/><button className="send" onClick={()=>send()}>Send</button></div></aside>}</>;
}

function Metric({label,value,icon,warn,critical}:any){return <div className={`metric ${warn?'warn':''} ${critical?'critical':''}`}><span className="metric-icon">{icon}</span><div><b>{value}</b><span>{label}</span></div></div>}
function Status({status}:any){return <span className={`status s-${String(status).toLowerCase()}`}>{String(status).replaceAll('_',' ')}</span>}
function Panel({title,children,action}:any){return <section className="panel"><header><h2>{title}</h2>{action}</header><div>{children}</div></section>}
function PageTitle({eyebrow,title,desc}:any){return <section className="page-title"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{desc}</p></section>}
function Empty({message}:any){return <div className="empty">{message}</div>}
const age=(iso:string)=>{const h=Math.max(0,Math.floor((Date.now()-Date.parse(iso))/3600000));return h<24?`${h}h`:`${Math.floor(h/24)}d ${h%24}h`};
const formatTime=(iso:string)=>new Date(iso).toLocaleString('en-ZA',{dateStyle:'medium',timeStyle:'short'});
const formatDate=(iso:string)=>new Date(iso).toLocaleDateString('en-ZA',{dateStyle:'medium'});

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
