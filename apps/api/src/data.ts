import bcrypt from 'bcryptjs';
import type { AuditEvent, DemoUser, Facility, Patient, Referral } from './domain.js';

const now = new Date();
const isoDaysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();
const isoHoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();

export const facilities: Facility[] = [
  { id: 'fac-clinic-1', name: 'Mahlasedi Community Clinic (Demo)', type: 'PUBLIC', province: 'Limpopo', district: 'Capricorn', services: ['Primary Care', 'Chronic Care', 'Referrals'], demo: true },
  { id: 'fac-hosp-1', name: 'Gauteng Cardiac Centre (Demo)', type: 'PRIVATE', province: 'Gauteng', district: 'Johannesburg', services: ['Cardiology', 'Echocardiography'], demo: true },
  { id: 'fac-hosp-2', name: 'Tshwane Regional Hospital (Demo)', type: 'PUBLIC', province: 'Gauteng', district: 'Tshwane', services: ['Cardiology', 'Internal Medicine', 'Imaging'], demo: true },
  { id: 'fac-lab-1', name: 'Ubuntu Pathology Network (Demo)', type: 'LAB', province: 'Gauteng', district: 'Johannesburg', services: ['Pathology', 'Haematology', 'Chemistry'], demo: true },
  { id: 'fac-pharm-1', name: 'CareLink Pharmacy (Demo)', type: 'PHARMACY', province: 'Gauteng', district: 'Johannesburg', services: ['Dispensing', 'Medication Reconciliation'], demo: true }
];

export const patients: Patient[] = [
  {
    id: 'pat-thandi', syntheticId: 'SYN-CP-0001', firstName: 'Thandi', surname: 'Mokoena', dateOfBirth: '1978-06-12', preferredLanguage: 'isiZulu', phone: '+27 60 000 0001', synthetic: true,
    allergies: [
      { id: 'all-1', label: 'Penicillin', detail: 'Documented rash after prior exposure', recordedAt: '2025-03-03T09:20:00Z', sourceFacility: 'Mahlasedi Community Clinic (Demo)', status: 'Active' }
    ],
    conditions: [
      { id: 'cond-1', label: 'Hypertension', detail: 'Chronic condition', recordedAt: '2026-02-14T10:10:00Z', sourceFacility: 'Mahlasedi Community Clinic (Demo)', status: 'Active' }
    ],
    medications: [
      { id: 'med-1', label: 'Amlodipine 5 mg', detail: 'Once daily', recordedAt: '2026-02-14T10:15:00Z', sourceFacility: 'Mahlasedi Community Clinic (Demo)', status: 'Current' }
    ],
    results: [
      { id: 'res-1', label: 'Creatinine', detail: '78 µmol/L — synthetic demonstration result', recordedAt: '2026-07-20T08:00:00Z', sourceFacility: 'Ubuntu Pathology Network (Demo)', status: 'Final' }
    ],
    encounters: [
      { id: 'enc-1', label: 'Chronic care review', detail: 'Blood pressure follow-up', recordedAt: '2026-07-20T08:40:00Z', sourceFacility: 'Mahlasedi Community Clinic (Demo)', status: 'Completed' }
    ]
  },
  {
    id: 'pat-lerato', syntheticId: 'SYN-CP-0002', firstName: 'Lerato', surname: 'Nkosi', dateOfBirth: '1989-11-04', preferredLanguage: 'Sesotho', phone: '+27 60 000 0002', synthetic: true,
    allergies: [], conditions: [{ id: 'cond-2', label: 'Type 2 diabetes', recordedAt: isoDaysAgo(90), sourceFacility: 'Tshwane Regional Hospital (Demo)', status: 'Active' }],
    medications: [{ id: 'med-2', label: 'Metformin 500 mg', detail: 'Twice daily', recordedAt: isoDaysAgo(90), sourceFacility: 'Tshwane Regional Hospital (Demo)', status: 'Current' }],
    results: [], encounters: []
  }
];

export const referrals: Referral[] = [
  {
    id: 'ref-1001', patientId: 'pat-thandi', service: 'Cardiology', reason: 'Persistent hypertension; specialist review requested', sourceFacilityId: 'fac-clinic-1', destinationFacilityId: 'fac-hosp-2', owner: 'Receiving Coordination Team', status: 'SUBMITTED', priority: 'ROUTINE', createdAt: isoHoursAgo(30), updatedAt: isoHoursAgo(30),
    events: [{ id: 'evt-1', at: isoHoursAgo(30), actor: 'Dr Naledi Dlamini', to: 'SUBMITTED', note: 'Referral submitted', source: 'UI' }]
  },
  {
    id: 'ref-1002', patientId: 'pat-lerato', service: 'Internal Medicine', reason: 'Diabetes review', sourceFacilityId: 'fac-hosp-2', destinationFacilityId: 'fac-hosp-2', owner: 'Medical Outpatients', status: 'SCHEDULED', priority: 'ROUTINE', createdAt: isoDaysAgo(3), updatedAt: isoHoursAgo(8), appointmentAt: new Date(now.getTime() + 86400000).toISOString(),
    events: [{ id: 'evt-2', at: isoHoursAgo(8), actor: 'Care Coordinator', from: 'ACCEPTED', to: 'SCHEDULED', note: 'Appointment scheduled', source: 'UI' }]
  }
];

export const auditEvents: AuditEvent[] = [
  { id: 'aud-1', at: isoHoursAgo(30), actor: 'Dr Naledi Dlamini', action: 'referral.submit', objectType: 'Referral', objectId: 'ref-1001', source: 'UI', outcome: 'SUCCESS' },
  { id: 'aud-2', at: isoHoursAgo(8), actor: 'Care Coordinator', action: 'appointment.schedule', objectType: 'Referral', objectId: 'ref-1002', source: 'UI', outcome: 'SUCCESS' }
];

export const users: DemoUser[] = [
  { id: 'usr-clin', username: 'clinician', displayName: 'Dr Naledi Dlamini', role: 'CLINICIAN', facilityId: 'fac-clinic-1', passwordHash: bcrypt.hashSync('CarePath!2026', 10) },
  { id: 'usr-coord', username: 'coordinator', displayName: 'Care Coordinator', role: 'COORDINATOR', facilityId: 'fac-hosp-2', passwordHash: bcrypt.hashSync('CarePath!2026', 10) },
  { id: 'usr-manager', username: 'manager', displayName: 'District Manager', role: 'MANAGER', facilityId: null, passwordHash: bcrypt.hashSync('CarePath!2026', 10) },
  { id: 'usr-auditor', username: 'auditor', displayName: 'Audit & Compliance', role: 'AUDITOR', facilityId: null, passwordHash: bcrypt.hashSync('CarePath!2026', 10) },
  { id: 'usr-admin', username: 'admin', displayName: 'CarePath Administrator', role: 'ADMIN', facilityId: null, passwordHash: bcrypt.hashSync('CarePath!2026', 10) }
];
