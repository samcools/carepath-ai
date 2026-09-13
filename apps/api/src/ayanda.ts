import type { Facility, Patient, Referral } from './domain.js';
import { openAIFallback } from './aiSettings.js';

export interface AyandaContext {
  patients: Patient[];
  referrals: Referral[];
  facilities: Facility[];
  ambulances?: Array<{ id:string; callSign:string; status:string; type:string; etaMinutes:number; capabilities:string[] }>;
}

const normalise = (input: string) => input.trim().replace(/^hey\s*,?\s*ayanda[:,]?\s*/i, '').toLowerCase();
function findPatient(q: string, patients: Patient[]) {
  return patients.find(p => q.includes(`${p.firstName} ${p.surname}`.toLowerCase())) || patients.find(p => q.includes(p.firstName.toLowerCase()) && p.firstName.length > 4);
}
function patientLabel(p: Patient) { return `${p.firstName} ${p.surname}`; }

export async function answerAyanda(input: string, ctx: AyandaContext) {
  const q = normalise(input);
  const patient = findPatient(q, ctx.patients);

  if (patient && (q.includes('open') || q.includes('record') || q.includes('history') || q.includes('summary'))) {
    const condition = patient.conditions[0]?.label || 'no active condition in the demo record';
    const med = patient.medications[0]?.label || 'no current medication recorded';
    const allergy = patient.allergies[0]?.label || 'no allergy recorded';
    return { intent:'OPEN_PATIENT', navigate:'patients', patientId:patient.id, text:`${patientLabel(patient)} is a synthetic demo patient. The authorised record currently shows ${condition}, ${med}, and ${allergy}. I can open the full OneRecord view with provenance.` };
  }
  if (patient && q.includes('allerg')) {
    const items = patient.allergies.length ? patient.allergies.map(a => `${a.label} (source: ${a.sourceFacility}, ${a.recordedAt.slice(0,10)})`).join('; ') : 'no allergies in the synthetic record';
    return { intent:'READ_ALLERGIES', text:`${patientLabel(patient)}: ${items}.` };
  }
  if (patient && (q.includes('medication') || q.includes('medicine'))) {
    const items = patient.medications.length ? patient.medications.map(m => `${m.label}${m.detail ? ` — ${m.detail}` : ''}`).join('; ') : 'no current medication in the synthetic record';
    return { intent:'READ_MEDICATION', navigate:'medication', text:`${patientLabel(patient)}: ${items}. Opening Medication & Vaccine Management for the authorised longitudinal view.` };
  }
  if (patient && q.includes('referral')) {
    const items = ctx.referrals.filter(r => r.patientId === patient.id);
    return { intent:'PATIENT_REFERRALS', navigate:'referrals', text:`${patientLabel(patient)} has ${items.length} visible synthetic referral${items.length===1?'':'s'} in your authorised scope.` };
  }

  // v0.5 federated-platform navigation. v05View is handled by the browser
  // bridge and intentionally remains separate from the original React View enum.
  if (q.includes('my workspace') || q.includes('professional workspace') || q.includes('clinical workspace') || q.includes('worklist')) {
    return { intent:'OPEN_V05_WORKSPACE', v05View:'workspace', text:'Opening the Healthcare Professional Workspace with authorised tasks, hand-offs, referrals, appointments and follow-up items.' };
  }
  if (q.includes('break glass') || q.includes('emergency access') || q.includes('emergency patient')) {
    return { intent:'OPEN_V05_EMERGENCY', v05View:'emergency', text:'Opening Emergency Patient Access. Break Glass requires a specific reason, demo re-authentication, minimum-necessary access and creates a high-visibility audit event.' };
  }
  if (q.includes('consent') || q.includes('identity centre') || q.includes('patient identity') || q.includes('mpi') || q.includes('master patient')) {
    return { intent:'OPEN_V05_IDENTITY', v05View:'identity', text:'Opening Consent & Identity. CarePath uses a federated identity/MPI abstraction and preserves source identifiers rather than inventing a competing national patient number.' };
  }
  if (q.includes('carepath watch') || q.includes('early warning') || q.includes('sla breach') || q.includes('pathway risk')) {
    return { intent:'OPEN_V05_WATCH', v05View:'watch', text:'Opening CarePath Watch. It explains operational pathway risks such as overdue referrals, missed appointments, missing feedback and capacity constraints. These are workflow findings, not diagnoses.' };
  }
  if (q.includes('population health') || q.includes('population intelligence') || q.includes('health authority')) {
    return { intent:'OPEN_V05_POPULATION', v05View:'population', text:'Opening Population Health Intelligence with aggregated and appropriately de-identified synthetic operational information.' };
  }
  if (q.includes('national command') || q.includes('provincial command') || q.includes('province view') || q.includes('district view')) {
    return { intent:'OPEN_V05_COMMAND', v05View:'commandv05', text:'Opening the hierarchical CarePath Command Centre for national, provincial, district and facility operational drill-down.' };
  }
  if (q.includes('fhir') || q.includes('interoperability') || q.includes('exchange gateway') || q.includes('source system')) {
    return { intent:'OPEN_V05_EXCHANGE', v05View:'exchange', text:'Opening CarePath Exchange. The demonstrator shows mock source adapters and FHIR R4-style resources while clearly avoiding claims of live national integration or formal profile certification.' };
  }

  if ((q.includes('waiting') || q.includes('stale') || q.includes('overdue')) && (q.includes('24') || q.includes('day'))) {
    const stale = ctx.referrals.filter(r => ['SUBMITTED','RECEIVED','INFO_REQUESTED'].includes(r.status) && Date.now() - Date.parse(r.updatedAt) > 24*3600000);
    return { intent:'FILTER_STALE_REFERRALS', navigate:'referrals', filter:'stale', text:`${stale.length} visible referral${stale.length===1?'':'s'} have been waiting more than 24 hours.` };
  }
  if (q.includes('ambulance') || q.includes('patient transfer') || q.includes('transport availability') || q.includes('transfer centre')) {
    const available = (ctx.ambulances || []).filter(a=>a.status==='AVAILABLE');
    const detail = available.length ? `${available.length} synthetic ambulances are currently marked available in the demonstration fleet.` : 'I will open the ambulance and patient-transfer view.';
    return { intent:'OPEN_TRANSFERS', navigate:'transfers', text:`${detail} CarePath can link transfer requests to referrals, destination bed capacity and appointment timing. This is synthetic availability, not a live EMS feed.` };
  }
  if (q.includes('notification') || q.includes('alert') || q.includes('reminder')) {
    return { intent:'OPEN_NOTIFICATIONS', navigate:'notifications', text:'Opening the Notification Centre for referral, appointment, medication, vaccination, capacity and patient-transfer alerts.' };
  }
  if (q.includes('vaccine') || q.includes('vaccination') || q.includes('immunisation') || q.includes('immunization')) {
    return { intent:'OPEN_MEDICATION_VACCINE', navigate:'medication', text:'Opening Medication & Vaccine Management. CarePath shows authorised medication history, reconciliation status and synthetic vaccination records with due dates.' };
  }
  if (q.includes('medication centre') || q.includes('medication management') || q.includes('medicine management')) {
    return { intent:'OPEN_MEDICATION_VACCINE', navigate:'medication', text:'Opening Medication & Vaccine Management.' };
  }
  if (q.includes('mobile') || q.includes('phone app') || q.includes('mobile app')) {
    return { intent:'OPEN_MOBILE', navigate:'mobile', text:'Opening the Mobile App Preview so you can demonstrate how CarePath works for patients and clinical users on a phone.' };
  }
  if (q.includes('bed') || q.includes('capacity') || q.includes('available hospital')) {
    return { intent:'OPEN_CAPACITY', navigate:'facilities', text:'Opening Facilities & Capacity. CarePath will show synthetic staffed, occupied, reserved and available beds by hospital and bed type. Bed-dependent bookings are blocked when the selected destination has no synthetic capacity.' };
  }
  if (q.includes('appointment') || q.includes('booking') || q.includes('book visit') || q.includes('schedule visit')) {
    return { intent:'OPEN_APPOINTMENTS', navigate:'appointments', text:'Opening the Appointment Management Centre. Authorised users can book referral-linked or standalone appointments, check in, complete, cancel or mark no-show according to role.' };
  }
  if (q.includes('outcome') || q.includes('recover') || q.includes('died') || q.includes('mortality') || q.includes('best hospital') || q.includes('referral performance')) {
    return { intent:'OPEN_OUTCOMES', navigate:'outcomes', text:'Opening Referral Outcomes. The hospital-level figures are synthetic observed outcomes, not risk-adjusted quality rankings. Production comparison would need case-mix adjustment, minimum sample sizes and validated outcome definitions.' };
  }
  if (q.includes('create') && q.includes('referral') && patient) {
    const service = ['cardiology','neurology','oncology','orthopaedics','internal medicine','surgery'].find(s => q.includes(s)) || 'Cardiology';
    const candidate = ctx.facilities.find(f => f.services.some(s => s.toLowerCase().includes(service.toLowerCase().split(' ')[0]))) || ctx.facilities.find(f => f.type === 'PUBLIC');
    return { intent:'PROPOSE_CREATE_REFERRAL', confirmationRequired:true, proposedAction:{tool:'create_referral_draft',patientId:patient.id,service,destinationFacilityId:candidate?.id}, text:`I can create a ${service} referral draft for ${patientLabel(patient)}${candidate?` to ${candidate.name}`:''}. CarePath will validate synthetic bed capacity when admission is required. I will create a draft only; an authorised clinician must review and submit it. Confirm to continue.` };
  }
  if (q.includes('care gap') || q.includes('gap')) return { intent:'NAVIGATE', navigate:'caregaps', text:'Opening Care Gaps and Follow-up.' };
  if (q.includes('health passport') || q.includes('passport')) return { intent:'NAVIGATE', navigate:'passport', text:'Opening the CarePath Health Passport.' };
  if (q.includes('command centre') || q.includes('dashboard') || q === 'home') return { intent:'NAVIGATE', navigate:'command', text:'Opening the CarePath Command Centre.' };
  if (q.includes('patient')) return { intent:'NAVIGATE', navigate:'patients', text:'Opening patient records.' };
  if (q.includes('referral')) return { intent:'NAVIGATE', navigate:'referrals', text:'Opening referrals.' };
  if (q.includes('facilit') || q.includes('hospital')) return { intent:'NAVIGATE', navigate:'facilities', text:'Opening facilities and services.' };
  if (q.includes('audit')) return { intent:'NAVIGATE', navigate:'audit', text:'Opening the audit trail.' };
  if (q.includes('setting') || q.includes('openai')) return { intent:'NAVIGATE', navigate:'admin', text:'Opening Administration. OpenAI API settings are restricted to administrators.' };

  const modelText = await openAIFallback(input);
  if (modelText) return { intent:'OPENAI_FALLBACK', provider:'OpenAI', text:modelText };
  return { intent:'HELP', text:'I can open authorised patient records, appointments, notifications, medication and vaccines, facilities, hospital capacity, ambulances, transfers, Health Passport and referral outcomes. In CarePath v0.5 I can also open My Workspace, Emergency Break Glass, Consent & Identity, CarePath Watch, the hierarchical National Command Centre, Population Health Intelligence and the FHIR-style Exchange Gateway.' };
}