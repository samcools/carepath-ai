export type ReferralStatus =
  | 'DRAFT' | 'SUBMITTED' | 'RECEIVED' | 'INFO_REQUESTED' | 'ACCEPTED'
  | 'DECLINED' | 'REDIRECTED' | 'SCHEDULED' | 'PATIENT_NOTIFIED'
  | 'ATTENDED' | 'MISSED' | 'CANCELLED' | 'FEEDBACK_PENDING'
  | 'FOLLOWUP_REQUIRED' | 'CLOSED' | 'REOPENED';

export const transitions: Record<ReferralStatus, ReferralStatus[]> = {
  DRAFT: ['SUBMITTED'],
  SUBMITTED: ['RECEIVED', 'CANCELLED'],
  RECEIVED: ['INFO_REQUESTED', 'ACCEPTED', 'DECLINED', 'REDIRECTED'],
  INFO_REQUESTED: ['SUBMITTED', 'CANCELLED'],
  ACCEPTED: ['SCHEDULED', 'REDIRECTED', 'CANCELLED'],
  DECLINED: [],
  REDIRECTED: ['RECEIVED'],
  SCHEDULED: ['PATIENT_NOTIFIED', 'CANCELLED', 'MISSED', 'ATTENDED'],
  PATIENT_NOTIFIED: ['ATTENDED', 'MISSED', 'CANCELLED'],
  ATTENDED: ['FEEDBACK_PENDING', 'CLOSED'],
  MISSED: ['FOLLOWUP_REQUIRED', 'SCHEDULED', 'CANCELLED'],
  CANCELLED: [],
  FEEDBACK_PENDING: ['CLOSED'],
  FOLLOWUP_REQUIRED: ['SCHEDULED', 'CLOSED'],
  CLOSED: ['REOPENED'],
  REOPENED: ['RECEIVED', 'ACCEPTED']
};

export function canTransition(from: ReferralStatus, to: ReferralStatus) {
  return transitions[from]?.includes(to) ?? false;
}

export type Role =
  | 'ADMIN' | 'CLINICIAN' | 'SPECIALIST' | 'NURSE' | 'COORDINATOR'
  | 'PHARMACIST' | 'LAB_TECH' | 'PATIENT_NAVIGATOR' | 'MANAGER' | 'AUDITOR' | 'PATIENT';

export interface DemoUser {
  id: string;
  username: string;
  displayName: string;
  role: Role;
  facilityId: string | null;
  patientId?: string;
  passwordHash: string;
}

export interface ClinicalItem {
  id: string;
  label: string;
  detail?: string;
  recordedAt: string;
  sourceFacility: string;
  status?: string;
}

export interface Patient {
  id: string;
  syntheticId: string;
  firstName: string;
  surname: string;
  dateOfBirth: string;
  preferredLanguage: string;
  phone: string;
  synthetic: true;
  allergies: ClinicalItem[];
  conditions: ClinicalItem[];
  medications: ClinicalItem[];
  results: ClinicalItem[];
  encounters: ClinicalItem[];
}

export interface Facility {
  id: string;
  name: string;
  type: 'PUBLIC' | 'PRIVATE' | 'LAB' | 'PHARMACY';
  province: string;
  district: string;
  city?: string;
  services: string[];
  demo: true;
}

export type BedType = 'GENERAL' | 'HIGH_CARE' | 'ICU' | 'MATERNITY' | 'PAEDIATRIC';
export interface BedCapacity {
  facilityId: string;
  bedType: BedType;
  staffedBeds: number;
  occupiedBeds: number;
  reservedBeds: number;
  updatedAt: string;
  synthetic: true;
}

export interface ReferralEvent {
  id: string;
  at: string;
  actor: string;
  from?: ReferralStatus;
  to?: ReferralStatus;
  note: string;
  source: 'UI' | 'VOICE' | 'AI' | 'SYSTEM';
}

export type CareOutcome = 'RECOVERED' | 'IMPROVED' | 'ONGOING' | 'DECEASED' | 'UNKNOWN';

export interface Referral {
  id: string;
  patientId: string;
  service: string;
  reason: string;
  sourceFacilityId: string;
  destinationFacilityId: string;
  owner: string;
  status: ReferralStatus;
  priority: 'ROUTINE' | 'PRIORITY';
  createdAt: string;
  updatedAt: string;
  appointmentAt?: string;
  acknowledgedAt?: string;
  requiresBed?: boolean;
  bedType?: BedType;
  outcome?: CareOutcome;
  outcomeAt?: string;
  outcomeNote?: string;
  events: ReferralEvent[];
}

export type AppointmentStatus = 'REQUESTED' | 'BOOKED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export interface Appointment {
  id: string;
  patientId: string;
  facilityId: string;
  referralId?: string;
  service: string;
  startAt: string;
  durationMinutes: number;
  status: AppointmentStatus;
  bookedBy: string;
  bookingSource: 'UI' | 'VOICE' | 'AI' | 'SYSTEM';
  requiresBed: boolean;
  bedType?: BedType;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditEvent {
  id: string;
  at: string;
  actor: string;
  action: string;
  objectType: string;
  objectId: string;
  source: 'UI' | 'VOICE' | 'AI' | 'SYSTEM';
  outcome: 'SUCCESS' | 'DENIED';
  reason?: string;
}

export interface OpenAISettings {
  enabled: boolean;
  model: string;
  baseUrl: string;
  hasApiKey: boolean;
  allowSyntheticDemoData: boolean;
}
