import type { Facility, Patient, Referral } from './domain.js';

export interface AyandaContext {
  patients: Patient[];
  referrals: Referral[];
  facilities: Facility[];
}

export function answerAyanda(input: string, ctx: AyandaContext) {
  const q = input.trim().replace(/^hey\s*,?\s*ayanda[:,]?\s*/i, '').toLowerCase();
  const thandi = ctx.patients.find(p => p.id === 'pat-thandi')!;

  if (q.includes('thandi') && (q.includes('open') || q.includes('record') || q.includes('history') || q.includes('summary'))) {
    return {
      intent: 'OPEN_PATIENT',
      navigate: 'patients',
      patientId: thandi.id,
      text: `Thandi Mokoena is a synthetic demo patient. Her active record shows hypertension, current amlodipine 5 mg, a documented penicillin allergy, and a cardiology referral. The penicillin allergy was recorded by Mahlasedi Community Clinic (Demo) on 3 March 2025.`
    };
  }

  if (q.includes('allerg')) {
    const items = thandi.allergies.map(a => `${a.label} — ${a.detail ?? ''} (source: ${a.sourceFacility}, ${a.recordedAt.slice(0,10)})`).join('; ');
    return { intent: 'READ_ALLERGIES', text: `For the synthetic demo patient Thandi Mokoena: ${items}.` };
  }

  if (q.includes('medication') || q.includes('medicine')) {
    const items = thandi.medications.map(m => `${m.label}, ${m.detail ?? ''}`).join('; ');
    return { intent: 'READ_MEDICATION', text: `Thandi's current synthetic medication list shows: ${items}.` };
  }

  if ((q.includes('waiting') || q.includes('stale') || q.includes('overdue')) && q.includes('24')) {
    const stale = ctx.referrals.filter(r => ['SUBMITTED','RECEIVED','INFO_REQUESTED'].includes(r.status) && Date.now() - Date.parse(r.updatedAt) > 24*3600000);
    return {
      intent: 'FILTER_STALE_REFERRALS',
      navigate: 'referrals',
      filter: 'stale',
      text: `${stale.length} referral${stale.length === 1 ? '' : 's'} have been waiting more than 24 hours. ${stale.map(r => `${r.id} for ${ctx.patients.find(p=>p.id===r.patientId)?.firstName} ${ctx.patients.find(p=>p.id===r.patientId)?.surname}`).join(', ')}.`
    };
  }

  if (q.includes('create') && q.includes('referral') && q.includes('thandi')) {
    return {
      intent: 'PROPOSE_CREATE_REFERRAL',
      confirmationRequired: true,
      proposedAction: { tool: 'create_referral_draft', patientId: thandi.id, service: 'Cardiology', destinationFacilityId: 'fac-hosp-2' },
      text: 'I can create a cardiology referral draft for Thandi Mokoena to Tshwane Regional Hospital (Demo). I will create a draft only; an authorised clinician must review and submit it. Confirm to continue.'
    };
  }

  if (q.includes('command centre') || q.includes('dashboard')) return { intent: 'NAVIGATE', navigate: 'command', text: 'Opening the CarePath Command Centre.' };
  if (q.includes('patient')) return { intent: 'NAVIGATE', navigate: 'patients', text: 'Opening patient records.' };
  if (q.includes('referral')) return { intent: 'NAVIGATE', navigate: 'referrals', text: 'Opening referrals.' };
  if (q.includes('audit')) return { intent: 'NAVIGATE', navigate: 'audit', text: 'Opening the audit trail.' };

  return {
    intent: 'HELP',
    text: 'I can open Thandi Mokoena’s synthetic record, summarise allergies or medication, show referrals waiting more than 24 hours, navigate CarePath, or propose a governed referral draft.'
  };
}
