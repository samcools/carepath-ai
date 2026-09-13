import bcrypt from 'bcryptjs';
import type { Appointment, AuditEvent, BedCapacity, BedType, CareOutcome, DemoUser, Facility, Patient, Referral, ReferralStatus } from './domain.js';

const now = new Date();
const isoDaysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();
const isoHoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();
const isoDaysAhead = (d: number, hour = 9) => { const x = new Date(now.getTime() + d * 86400000); x.setHours(hour,0,0,0); return x.toISOString(); };

export const facilities: Facility[] = [
  { id: 'fac-clinic-1', name: 'Mahlasedi Community Clinic (Demo)', type: 'PUBLIC', province: 'Limpopo', district: 'Capricorn', city:'Polokwane', services: ['Primary Care', 'Chronic Care', 'Referrals'], demo: true },
  { id: 'fac-clinic-2', name: 'Ubuntu Community Health Centre (Demo)', type: 'PUBLIC', province: 'Gauteng', district: 'Johannesburg', city:'Johannesburg', services: ['Primary Care', 'Maternal Health', 'Referrals'], demo: true },
  { id: 'fac-hosp-1', name: 'Gauteng Cardiac Centre (Demo)', type: 'PRIVATE', province: 'Gauteng', district: 'Johannesburg', city:'Johannesburg', services: ['Cardiology', 'Echocardiography', 'Internal Medicine'], demo: true },
  { id: 'fac-hosp-2', name: 'Tshwane Regional Hospital (Demo)', type: 'PUBLIC', province: 'Gauteng', district: 'Tshwane', city:'Pretoria', services: ['Cardiology', 'Internal Medicine', 'Imaging', 'Surgery', 'Maternity', 'Paediatrics'], demo: true },
  { id: 'fac-hosp-3', name: 'Maponya Specialist Hospital (Demo)', type: 'PRIVATE', province: 'Gauteng', district: 'Johannesburg', city:'Soweto', services: ['Oncology', 'Neurology', 'Orthopaedics', 'Surgery'], demo: true },
  { id: 'fac-hosp-4', name: 'Polokwane Academic Hospital (Demo)', type: 'PUBLIC', province: 'Limpopo', district: 'Capricorn', city:'Polokwane', services: ['Internal Medicine', 'Cardiology', 'Neurology', 'Surgery', 'Maternity', 'Paediatrics'], demo: true },
  { id: 'fac-hosp-5', name: 'Midrand Day Hospital (Demo)', type: 'PRIVATE', province: 'Gauteng', district: 'Johannesburg', city:'Midrand', services: ['General Surgery', 'Orthopaedics', 'Imaging'], demo: true },
  { id: 'fac-hosp-6', name: 'Gqeberha Coastal Hospital (Demo)', type: 'PUBLIC', province: 'Eastern Cape', district: 'Nelson Mandela Bay', city:'Gqeberha', services: ['Internal Medicine', 'Cardiology', 'Surgery', 'Maternity', 'Paediatrics', 'Imaging'], demo: true },
  { id: 'fac-hosp-7', name: 'Bloemfontein Central Hospital (Demo)', type: 'PUBLIC', province: 'Free State', district: 'Mangaung', city:'Bloemfontein', services: ['Internal Medicine', 'Cardiology', 'Oncology', 'Surgery', 'Maternity', 'Paediatrics'], demo: true },
  { id: 'fac-hosp-8', name: 'Durban Bay Specialist Hospital (Demo)', type: 'PRIVATE', province: 'KwaZulu-Natal', district: 'eThekwini', city:'Durban', services: ['Cardiology', 'Neurology', 'Oncology', 'Orthopaedics', 'Surgery', 'Imaging'], demo: true },
  { id: 'fac-hosp-9', name: 'Mbombela Regional Hospital (Demo)', type: 'PUBLIC', province: 'Mpumalanga', district: 'Ehlanzeni', city:'Mbombela', services: ['Internal Medicine', 'Cardiology', 'Surgery', 'Maternity', 'Paediatrics'], demo: true },
  { id: 'fac-hosp-10', name: 'Rustenburg Provincial Hospital (Demo)', type: 'PUBLIC', province: 'North West', district: 'Bojanala', city:'Rustenburg', services: ['Internal Medicine', 'Orthopaedics', 'Surgery', 'Maternity', 'Paediatrics'], demo: true },
  { id: 'fac-hosp-11', name: 'Kimberley Regional Hospital (Demo)', type: 'PUBLIC', province: 'Northern Cape', district: 'Frances Baard', city:'Kimberley', services: ['Internal Medicine', 'Surgery', 'Maternity', 'Paediatrics', 'Imaging'], demo: true },
  { id: 'fac-hosp-12', name: 'Cape Metro Specialist Hospital (Demo)', type: 'PRIVATE', province: 'Western Cape', district: 'City of Cape Town', city:'Cape Town', services: ['Cardiology', 'Neurology', 'Oncology', 'Orthopaedics', 'Surgery', 'Imaging'], demo: true },
  { id: 'fac-lab-1', name: 'Ubuntu Pathology Network (Demo)', type: 'LAB', province: 'Gauteng', district: 'Johannesburg', city:'Johannesburg', services: ['Pathology', 'Haematology', 'Chemistry'], demo: true },
  { id: 'fac-lab-2', name: 'Limpopo Diagnostics Lab (Demo)', type: 'LAB', province: 'Limpopo', district: 'Capricorn', city:'Polokwane', services: ['Pathology', 'Microbiology', 'Chemistry'], demo: true },
  { id: 'fac-pharm-1', name: 'CareLink Pharmacy (Demo)', type: 'PHARMACY', province: 'Gauteng', district: 'Johannesburg', city:'Johannesburg', services: ['Dispensing', 'Medication Reconciliation'], demo: true }
];

export const bedCapacity: BedCapacity[] = [
  { facilityId:'fac-hosp-1', bedType:'GENERAL', staffedBeds:42, occupiedBeds:34, reservedBeds:2, updatedAt:isoHoursAgo(1), synthetic:true },
  { facilityId:'fac-hosp-1', bedType:'HIGH_CARE', staffedBeds:10, occupiedBeds:8, reservedBeds:1, updatedAt:isoHoursAgo(1), synthetic:true },
  { facilityId:'fac-hosp-1', bedType:'ICU', staffedBeds:8, occupiedBeds:7, reservedBeds:0, updatedAt:isoHoursAgo(1), synthetic:true },
  { facilityId:'fac-hosp-2', bedType:'GENERAL', staffedBeds:160, occupiedBeds:143, reservedBeds:6, updatedAt:isoHoursAgo(2), synthetic:true },
  { facilityId:'fac-hosp-2', bedType:'HIGH_CARE', staffedBeds:24, occupiedBeds:20, reservedBeds:1, updatedAt:isoHoursAgo(2), synthetic:true },
  { facilityId:'fac-hosp-2', bedType:'ICU', staffedBeds:18, occupiedBeds:17, reservedBeds:1, updatedAt:isoHoursAgo(2), synthetic:true },
  { facilityId:'fac-hosp-2', bedType:'MATERNITY', staffedBeds:45, occupiedBeds:34, reservedBeds:3, updatedAt:isoHoursAgo(2), synthetic:true },
  { facilityId:'fac-hosp-2', bedType:'PAEDIATRIC', staffedBeds:36, occupiedBeds:29, reservedBeds:2, updatedAt:isoHoursAgo(2), synthetic:true },
  { facilityId:'fac-hosp-3', bedType:'GENERAL', staffedBeds:75, occupiedBeds:58, reservedBeds:5, updatedAt:isoHoursAgo(1), synthetic:true },
  { facilityId:'fac-hosp-3', bedType:'HIGH_CARE', staffedBeds:16, occupiedBeds:11, reservedBeds:2, updatedAt:isoHoursAgo(1), synthetic:true },
  { facilityId:'fac-hosp-3', bedType:'ICU', staffedBeds:12, occupiedBeds:8, reservedBeds:1, updatedAt:isoHoursAgo(1), synthetic:true },
  { facilityId:'fac-hosp-4', bedType:'GENERAL', staffedBeds:190, occupiedBeds:181, reservedBeds:4, updatedAt:isoHoursAgo(3), synthetic:true },
  { facilityId:'fac-hosp-4', bedType:'HIGH_CARE', staffedBeds:20, occupiedBeds:18, reservedBeds:1, updatedAt:isoHoursAgo(3), synthetic:true },
  { facilityId:'fac-hosp-4', bedType:'ICU', staffedBeds:14, occupiedBeds:14, reservedBeds:0, updatedAt:isoHoursAgo(3), synthetic:true },
  { facilityId:'fac-hosp-4', bedType:'MATERNITY', staffedBeds:42, occupiedBeds:35, reservedBeds:2, updatedAt:isoHoursAgo(3), synthetic:true },
  { facilityId:'fac-hosp-4', bedType:'PAEDIATRIC', staffedBeds:34, occupiedBeds:30, reservedBeds:1, updatedAt:isoHoursAgo(3), synthetic:true },
  { facilityId:'fac-hosp-5', bedType:'GENERAL', staffedBeds:38, occupiedBeds:26, reservedBeds:4, updatedAt:isoHoursAgo(1), synthetic:true },
  { facilityId:'fac-hosp-5', bedType:'HIGH_CARE', staffedBeds:6, occupiedBeds:4, reservedBeds:0, updatedAt:isoHoursAgo(1), synthetic:true },
  { facilityId:'fac-hosp-6', bedType:'GENERAL', staffedBeds:145, occupiedBeds:119, reservedBeds:5, updatedAt:isoHoursAgo(2), synthetic:true },
  { facilityId:'fac-hosp-6', bedType:'HIGH_CARE', staffedBeds:18, occupiedBeds:12, reservedBeds:2, updatedAt:isoHoursAgo(2), synthetic:true },
  { facilityId:'fac-hosp-6', bedType:'ICU', staffedBeds:12, occupiedBeds:9, reservedBeds:1, updatedAt:isoHoursAgo(2), synthetic:true },
  { facilityId:'fac-hosp-6', bedType:'MATERNITY', staffedBeds:38, occupiedBeds:27, reservedBeds:2, updatedAt:isoHoursAgo(2), synthetic:true },
  { facilityId:'fac-hosp-6', bedType:'PAEDIATRIC', staffedBeds:32, occupiedBeds:24, reservedBeds:2, updatedAt:isoHoursAgo(2), synthetic:true },
  { facilityId:'fac-hosp-7', bedType:'GENERAL', staffedBeds:170, occupiedBeds:142, reservedBeds:5, updatedAt:isoHoursAgo(2), synthetic:true },
  { facilityId:'fac-hosp-7', bedType:'HIGH_CARE', staffedBeds:20, occupiedBeds:15, reservedBeds:1, updatedAt:isoHoursAgo(2), synthetic:true },
  { facilityId:'fac-hosp-7', bedType:'ICU', staffedBeds:14, occupiedBeds:11, reservedBeds:1, updatedAt:isoHoursAgo(2), synthetic:true },
  { facilityId:'fac-hosp-7', bedType:'MATERNITY', staffedBeds:40, occupiedBeds:30, reservedBeds:2, updatedAt:isoHoursAgo(2), synthetic:true },
  { facilityId:'fac-hosp-7', bedType:'PAEDIATRIC', staffedBeds:35, occupiedBeds:29, reservedBeds:1, updatedAt:isoHoursAgo(2), synthetic:true },
  { facilityId:'fac-hosp-8', bedType:'GENERAL', staffedBeds:95, occupiedBeds:68, reservedBeds:5, updatedAt:isoHoursAgo(1), synthetic:true },
  { facilityId:'fac-hosp-8', bedType:'HIGH_CARE', staffedBeds:18, occupiedBeds:12, reservedBeds:2, updatedAt:isoHoursAgo(1), synthetic:true },
  { facilityId:'fac-hosp-8', bedType:'ICU', staffedBeds:14, occupiedBeds:9, reservedBeds:1, updatedAt:isoHoursAgo(1), synthetic:true },
  { facilityId:'fac-hosp-9', bedType:'GENERAL', staffedBeds:135, occupiedBeds:111, reservedBeds:4, updatedAt:isoHoursAgo(2), synthetic:true },
  { facilityId:'fac-hosp-9', bedType:'HIGH_CARE', staffedBeds:16, occupiedBeds:12, reservedBeds:1, updatedAt:isoHoursAgo(2), synthetic:true },
  { facilityId:'fac-hosp-9', bedType:'ICU', staffedBeds:10, occupiedBeds:8, reservedBeds:0, updatedAt:isoHoursAgo(2), synthetic:true },
  { facilityId:'fac-hosp-9', bedType:'MATERNITY', staffedBeds:36, occupiedBeds:26, reservedBeds:2, updatedAt:isoHoursAgo(2), synthetic:true },
  { facilityId:'fac-hosp-9', bedType:'PAEDIATRIC', staffedBeds:28, occupiedBeds:21, reservedBeds:1, updatedAt:isoHoursAgo(2), synthetic:true },
  { facilityId:'fac-hosp-10', bedType:'GENERAL', staffedBeds:125, occupiedBeds:101, reservedBeds:4, updatedAt:isoHoursAgo(3), synthetic:true },
  { facilityId:'fac-hosp-10', bedType:'HIGH_CARE', staffedBeds:14, occupiedBeds:10, reservedBeds:1, updatedAt:isoHoursAgo(3), synthetic:true },
  { facilityId:'fac-hosp-10', bedType:'ICU', staffedBeds:10, occupiedBeds:8, reservedBeds:1, updatedAt:isoHoursAgo(3), synthetic:true },
  { facilityId:'fac-hosp-10', bedType:'MATERNITY', staffedBeds:34, occupiedBeds:25, reservedBeds:2, updatedAt:isoHoursAgo(3), synthetic:true },
  { facilityId:'fac-hosp-10', bedType:'PAEDIATRIC', staffedBeds:26, occupiedBeds:19, reservedBeds:1, updatedAt:isoHoursAgo(3), synthetic:true },
  { facilityId:'fac-hosp-11', bedType:'GENERAL', staffedBeds:105, occupiedBeds:87, reservedBeds:3, updatedAt:isoHoursAgo(3), synthetic:true },
  { facilityId:'fac-hosp-11', bedType:'HIGH_CARE', staffedBeds:12, occupiedBeds:9, reservedBeds:1, updatedAt:isoHoursAgo(3), synthetic:true },
  { facilityId:'fac-hosp-11', bedType:'ICU', staffedBeds:8, occupiedBeds:7, reservedBeds:0, updatedAt:isoHoursAgo(3), synthetic:true },
  { facilityId:'fac-hosp-11', bedType:'MATERNITY', staffedBeds:30, occupiedBeds:22, reservedBeds:1, updatedAt:isoHoursAgo(3), synthetic:true },
  { facilityId:'fac-hosp-11', bedType:'PAEDIATRIC', staffedBeds:22, occupiedBeds:17, reservedBeds:1, updatedAt:isoHoursAgo(3), synthetic:true },
  { facilityId:'fac-hosp-12', bedType:'GENERAL', staffedBeds:88, occupiedBeds:61, reservedBeds:4, updatedAt:isoHoursAgo(1), synthetic:true },
  { facilityId:'fac-hosp-12', bedType:'HIGH_CARE', staffedBeds:16, occupiedBeds:10, reservedBeds:1, updatedAt:isoHoursAgo(1), synthetic:true },
  { facilityId:'fac-hosp-12', bedType:'ICU', staffedBeds:14, occupiedBeds:9, reservedBeds:1, updatedAt:isoHoursAgo(1), synthetic:true }
];

const firstNames = ['Thandi','Lerato','Sipho','Nomsa','Kabelo','Ayanda','Lindiwe','Mpho','Thabo','Zanele','Neo','Busisiwe','Tshepo','Nandi','Karabo','Palesa','Sibusiso','Dineo','Andile','Naledi','Tumelo','Nokuthula','Bongani','Refiloe','Khanyisa','Lesedi','Themba','Boitumelo','Nhlanhla','Precious'];
const surnames = ['Mokoena','Nkosi','Dlamini','Mahlangu','Molefe','Ndlovu','Khumalo','Mabena','Sithole','Mthembu','Motaung','Maseko','Baloyi','Mokoena','Radebe','Mhlongo','Modise','Shabangu','Mabaso','Mthethwa','Mokoena','Mofokeng','Mahlangu','Radebe','Nkomo','Molefe','Ndlovu','Masango','Mabena','Mokoena'];
const languages = ['isiZulu','Sesotho','English','Setswana','Sepedi','isiXhosa','Afrikaans','Tshivenda','XiTsonga','siSwati'];
const conditionPool = ['Hypertension','Type 2 diabetes','Asthma','Hyperlipidaemia','Chronic kidney disease','Migraine','Osteoarthritis','Heart failure','Epilepsy','COPD'];
const medicationPool = ['Amlodipine 5 mg','Metformin 500 mg','Salbutamol inhaler','Atorvastatin 20 mg','Enalapril 10 mg','Paracetamol 500 mg','Hydrochlorothiazide 25 mg','Carbamazepine 200 mg'];
const allergyPool = ['Penicillin','Sulfonamides','Ibuprofen','Latex','No known drug allergies'];

function createPatient(i: number): Patient {
  const num = i + 1;
  const firstName = firstNames[i % firstNames.length];
  const surname = surnames[(i * 7) % surnames.length];
  const cond = conditionPool[i % conditionPool.length];
  const med = medicationPool[i % medicationPool.length];
  const hasAllergy = i % 4 === 0;
  const source = i % 3 === 0 ? 'Mahlasedi Community Clinic (Demo)' : i % 3 === 1 ? 'Tshwane Regional Hospital (Demo)' : 'Ubuntu Community Health Centre (Demo)';
  return {
    id: i === 0 ? 'pat-thandi' : `pat-${String(num).padStart(3,'0')}`,
    syntheticId: `SYN-CP-${String(num).padStart(4,'0')}`,
    firstName, surname,
    dateOfBirth: `${1960 + (i % 42)}-${String((i % 12) + 1).padStart(2,'0')}-${String((i % 26) + 1).padStart(2,'0')}`,
    preferredLanguage: languages[i % languages.length],
    phone: `+27 60 000 ${String(num).padStart(4,'0')}`,
    synthetic: true,
    allergies: hasAllergy ? [{ id: `all-${num}`, label: i === 0 ? 'Penicillin' : allergyPool[i % allergyPool.length], detail: i === 0 ? 'Documented rash after prior exposure' : 'Synthetic allergy record', recordedAt: i === 0 ? '2025-03-03T09:20:00Z' : isoDaysAgo(150 + i), sourceFacility: source, status: 'Active' }] : [],
    conditions: [{ id: `cond-${num}`, label: i === 0 ? 'Hypertension' : cond, detail: 'Synthetic chronic condition', recordedAt: i === 0 ? '2026-02-14T10:10:00Z' : isoDaysAgo(30 + i), sourceFacility: source, status: 'Active' }],
    medications: [{ id: `med-${num}`, label: i === 0 ? 'Amlodipine 5 mg' : med, detail: i === 0 ? 'Once daily' : 'Synthetic current medication', recordedAt: i === 0 ? '2026-02-14T10:15:00Z' : isoDaysAgo(28 + i), sourceFacility: source, status: 'Current' }],
    results: i % 3 === 0 ? [{ id: `res-${num}`, label: i === 0 ? 'Creatinine' : 'Routine pathology panel', detail: i === 0 ? '78 µmol/L — synthetic demonstration result' : 'Synthetic result available', recordedAt: isoDaysAgo(6 + (i % 20)), sourceFacility: i % 2 === 0 ? 'Ubuntu Pathology Network (Demo)' : 'Limpopo Diagnostics Lab (Demo)', status: 'Final' }] : [],
    encounters: [{ id: `enc-${num}`, label: i % 2 === 0 ? 'Chronic care review' : 'Primary care consultation', detail: 'Synthetic completed encounter', recordedAt: isoDaysAgo(10 + (i % 40)), sourceFacility: source, status: 'Completed' }]
  };
}

export const patients: Patient[] = Array.from({ length: 60 }, (_, i) => createPatient(i));

const hospitalIds = ['fac-hosp-1','fac-hosp-2','fac-hosp-3','fac-hosp-4','fac-hosp-5','fac-hosp-6','fac-hosp-7','fac-hosp-8','fac-hosp-9','fac-hosp-10','fac-hosp-11','fac-hosp-12'];
const services = ['Cardiology','Internal Medicine','Neurology','Orthopaedics','Oncology','General Surgery'];
const bedTypeForService = (service:string): BedType | undefined => service === 'General Surgery' || service === 'Oncology' ? 'GENERAL' : service === 'Cardiology' && Math.random() < 0 ? 'HIGH_CARE' : undefined;
const outcomePattern: CareOutcome[] = ['RECOVERED','IMPROVED','RECOVERED','ONGOING','RECOVERED','DECEASED','IMPROVED','RECOVERED','ONGOING','RECOVERED'];
const outcomesByHospital: Record<string, CareOutcome[]> = Object.fromEntries(hospitalIds.map((id,index)=>[id,outcomePattern.map((_,i)=>outcomePattern[(i+index)%outcomePattern.length])])) as Record<string,CareOutcome[]>;
const closedStatuses: ReferralStatus[] = ['CLOSED','CLOSED','CLOSED','CLOSED','ATTENDED','FEEDBACK_PENDING'];

export const referrals: Referral[] = [];
let referralCounter = 1001;
for (let i = 0; i < 60; i++) {
  const patient = patients[i % patients.length];
  const destination = hospitalIds[i % hospitalIds.length];
  const service = i === 0 ? 'Cardiology' : services[i % services.length];
  const completed = i < 42;
  const status: ReferralStatus = i === 0 ? 'SUBMITTED' : completed ? closedStatuses[i % closedStatuses.length] : (['SUBMITTED','RECEIVED','ACCEPTED','SCHEDULED','PATIENT_NOTIFIED','MISSED','FOLLOWUP_REQUIRED'] as ReferralStatus[])[i % 7];
  const createdAgo = completed ? 10 + i : 1 + (i % 6);
  const updatedAgoHours = completed ? 4 + i : (status === 'SUBMITTED' && i % 2 === 0 ? 32 + i : 2 + i);
  const outcome = completed ? outcomesByHospital[destination][i % outcomesByHospital[destination].length] : undefined;
  const bedType = bedTypeForService(service);
  referrals.push({
    id: `ref-${referralCounter++}`,
    patientId: patient.id,
    service,
    reason: i === 0 ? 'Persistent hypertension; specialist review requested' : `Synthetic ${service.toLowerCase()} referral`,
    sourceFacilityId: i % 2 === 0 ? 'fac-clinic-1' : 'fac-clinic-2',
    destinationFacilityId: i === 0 ? 'fac-hosp-2' : destination,
    owner: status === 'SUBMITTED' ? 'Receiving Coordination Team' : 'Care Coordination Team',
    status,
    priority: i % 5 === 0 ? 'PRIORITY' : 'ROUTINE',
    createdAt: i === 0 ? isoHoursAgo(30) : isoDaysAgo(createdAgo),
    updatedAt: i === 0 ? isoHoursAgo(30) : isoHoursAgo(updatedAgoHours),
    acknowledgedAt: completed || status !== 'SUBMITTED' ? isoHoursAgo(Math.max(1, updatedAgoHours - 2)) : undefined,
    appointmentAt: ['SCHEDULED','PATIENT_NOTIFIED'].includes(status) ? isoDaysAhead(1 + (i % 4), 8 + (i % 7)) : undefined,
    requiresBed: Boolean(bedType),
    bedType,
    outcome,
    outcomeAt: outcome ? isoDaysAgo(Math.max(1, i % 14)) : undefined,
    outcomeNote: outcome ? `Synthetic referral outcome: ${outcome.toLowerCase()}` : undefined,
    events: [{ id: `evt-${i+1}`, at: i === 0 ? isoHoursAgo(30) : isoDaysAgo(createdAgo), actor: i % 2 === 0 ? 'Dr Naledi Dlamini' : 'Dr Sipho Nkosi', to: status, note: 'Synthetic referral activity', source: 'SYSTEM' }]
  });
}

export const appointments: Appointment[] = referrals
  .filter(r => r.appointmentAt)
  .slice(0, 20)
  .map((r, i) => ({
    id:`appt-${2001+i}`,
    patientId:r.patientId,
    facilityId:r.destinationFacilityId,
    referralId:r.id,
    service:r.service,
    startAt:r.appointmentAt!,
    durationMinutes:i%3===0?60:30,
    status:i%5===0?'REQUESTED':'BOOKED',
    bookedBy:i%2===0?'Care Coordinator':'Dr Naledi Dlamini',
    bookingSource:'SYSTEM',
    requiresBed:Boolean(r.requiresBed),
    bedType:r.bedType,
    note:r.requiresBed?'Synthetic booking includes bed-capacity validation':'Synthetic outpatient booking',
    createdAt:isoDaysAgo(2+i),
    updatedAt:isoHoursAgo(3+i)
  }));

export const auditEvents: AuditEvent[] = [
  { id: 'aud-1', at: isoHoursAgo(2), actor: 'System', action: 'demo.seed', objectType: 'Dataset', objectId: 'carepath-v0.4', source: 'SYSTEM', outcome: 'SUCCESS' },
  { id: 'aud-2', at: isoHoursAgo(4), actor: 'Care Coordinator', action: 'referral.review', objectType: 'Referral', objectId: 'ref-1008', source: 'UI', outcome: 'SUCCESS' },
  { id: 'aud-3', at: isoHoursAgo(7), actor: 'Dr Naledi Dlamini', action: 'patient.read', objectType: 'Patient', objectId: 'pat-thandi', source: 'UI', outcome: 'SUCCESS' }
];

const demoPassword = 'CarePath!2026';
const hash = () => bcrypt.hashSync(demoPassword, 10);
export const users: DemoUser[] = [
  { id: 'usr-clin', username: 'clinician', displayName: 'Dr Naledi Dlamini', role: 'CLINICIAN', facilityId: 'fac-clinic-1', passwordHash: hash() },
  { id: 'usr-spec', username: 'specialist', displayName: 'Dr Sibusiso Khumalo', role: 'SPECIALIST', facilityId: 'fac-hosp-2', passwordHash: hash() },
  { id: 'usr-nurse', username: 'nurse', displayName: 'Sr Lerato Maseko', role: 'NURSE', facilityId: 'fac-hosp-2', passwordHash: hash() },
  { id: 'usr-coord', username: 'coordinator', displayName: 'Care Coordinator', role: 'COORDINATOR', facilityId: 'fac-hosp-2', passwordHash: hash() },
  { id: 'usr-pharm', username: 'pharmacist', displayName: 'Demo Pharmacist', role: 'PHARMACIST', facilityId: 'fac-pharm-1', passwordHash: hash() },
  { id: 'usr-lab', username: 'labtech', displayName: 'Demo Lab Technologist', role: 'LAB_TECH', facilityId: 'fac-lab-1', passwordHash: hash() },
  { id: 'usr-nav', username: 'navigator', displayName: 'Patient Navigator', role: 'PATIENT_NAVIGATOR', facilityId: 'fac-clinic-2', passwordHash: hash() },
  { id: 'usr-manager', username: 'manager', displayName: 'District Manager', role: 'MANAGER', facilityId: null, passwordHash: hash() },
  { id: 'usr-auditor', username: 'auditor', displayName: 'Audit & Compliance', role: 'AUDITOR', facilityId: null, passwordHash: hash() },
  { id: 'usr-admin', username: 'admin', displayName: 'CarePath Administrator', role: 'ADMIN', facilityId: null, passwordHash: hash() },
  { id: 'usr-patient', username: 'patient', displayName: 'Thandi Mokoena', role: 'PATIENT', facilityId: null, patientId: 'pat-thandi', passwordHash: hash() }
];
