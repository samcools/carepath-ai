# CarePath AI v0.4 — Operations, Mobile, Notifications, Medication/Vaccine & Ambulance Addendum

This addendum extends `docs/prompts/CAREPATH-MASTER-PROMPT.md` and `CAREPATH-V0.3-APPOINTMENTS-CAPACITY-ADDENDUM.md`. It is mandatory for subsequent CarePath builds unless superseded by a later approved specification.

## 1. Synthetic population

The hackathon demonstrator must include at least **120 synthetic patients** with longitudinal health-record context sufficient to demonstrate:

- conditions;
- allergies;
- medication;
- vaccinations;
- laboratory/results context;
- encounters;
- referrals;
- appointments;
- patient transfers;
- provenance.

All synthetic records must remain clearly labelled as synthetic demonstration data.

## 2. User types and role switching

The demonstrator must expose multiple user types and visibly demonstrate different access scopes.

Required seeded roles:

- administrator;
- referring clinician;
- specialist;
- nurse;
- care coordinator;
- patient navigator;
- pharmacist;
- laboratory technologist;
- district/operational manager;
- auditor/compliance;
- patient.

Requirements:

- login page user-type dropdown;
- in-app demo user-type dropdown for hackathon demonstrations;
- server-side role enforcement remains authoritative;
- changing demo role changes the effective authorised session context;
- role switching is demo-only and must not be copied into production authentication design.

## 3. Appointment Management Centre

Retain the v0.3 appointment requirements and present them as a dedicated **Appointment Management Centre**.

The centre must show:

- requested;
- booked;
- checked-in;
- completed;
- cancelled;
- no-show;
- standalone and referral-linked appointments;
- patient;
- service;
- hospital/facility;
- appointment time and duration;
- bed requirement and current synthetic availability where applicable;
- permitted role-specific lifecycle actions;
- appointment-related notifications.

## 4. Notification Centre

CarePath must provide a role-aware Notification Centre.

Notification categories should include:

- referrals;
- appointments;
- hospital capacity;
- medications;
- vaccinations;
- patient transfers/ambulance;
- system/governance alerts where appropriate.

Requirements:

- unread count in the application header;
- notification list and filtering;
- mark-read and mark-all-read;
- role/patient/facility-aware visibility;
- audit consequential notification-triggering actions where applicable;
- notifications must never expose patient information outside authorised scope.

## 5. Medication & Vaccine Management Centre

CarePath must provide a governed medication and vaccination management view linked to OneRecord.

Medication requirements:

- show current and historical medication;
- source/provenance;
- medication status such as current, stopped or on hold;
- medication reconciliation support;
- authorised role-only additions/status changes;
- patient read-only view of own medication;
- no autonomous prescribing by AI.

Vaccination requirements:

- vaccine name;
- dose;
- administration date;
- administering facility;
- next due date where applicable;
- due/overdue indicators;
- patient and authorised care-team visibility;
- vaccination-related care gaps and notifications;
- no autonomous clinical eligibility decisions by AI.

## 6. Ambulance Availability & Patient Transfer Management

CarePath must include a dedicated **Ambulance Availability & Patient Transfer Management Centre**.

### 6.1 Ambulance fleet model

The hackathon fleet is synthetic and must be labelled as such.

Ambulance types should include:

- Basic;
- Advanced;
- ICU/Critical Care;
- Neonatal.

Fleet status:

`AVAILABLE | DISPATCHED | MAINTENANCE`

Each synthetic ambulance should show:

- call sign/unit identifier;
- type;
- home/station facility;
- crew descriptor;
- capabilities/equipment class;
- synthetic ETA;
- current status;
- active assigned transfer if any.

### 6.2 Patient transfer workflow

Minimum transfer state machine:

`REQUESTED → ASSIGNED → EN_ROUTE → PATIENT_ON_BOARD → ARRIVED → COMPLETED`

`CANCELLED` is supported where workflow rules permit.

Transfer data must include:

- patient;
- linked referral where applicable;
- pickup facility;
- destination facility;
- priority: routine, urgent or emergency;
- required ambulance level;
- requested/scheduled time;
- assigned ambulance;
- status;
- responsible/requesting user;
- notes;
- audit trail.

### 6.3 Capacity-aware transfer rules

Where a linked referral requires admission:

- re-check destination synthetic bed capacity before accepting the patient-transfer request;
- block the transfer when the required synthetic bed type has no availability;
- return compatible alternative destination facilities where appropriate;
- do not claim a real-time bed reservation or ambulance dispatch unless a live authorised source has actually been integrated.

### 6.4 Ambulance matching

The demonstrator may automatically match the first appropriate available synthetic ambulance according to required capability and synthetic ETA.

The system must distinguish this operational matching from clinical decision-making.

Examples:

- Basic requirement may use any compatible available unit;
- Advanced requires Advanced/ICU-capable transport;
- ICU requires a critical-care unit;
- Neonatal requires neonatal-capable transport.

If no compatible ambulance is available, the transfer remains requested/unassigned and generates an operational notification.

### 6.5 Transfer notifications and care gaps

Generate notifications for:

- transfer request;
- ambulance assignment;
- dispatch/en-route status;
- patient onboard;
- arrival;
- completion/cancellation;
- no compatible ambulance available;
- transfer delays.

Transfer delays may surface in Care Gaps.

## 7. Mobile-first experience

The responsive web application must remain fully usable on desktop, tablet and mobile.

In addition, include an explicit **Mobile App Preview** for the hackathon that demonstrates the intended future phone experience.

Preview modes:

- patient mobile app;
- clinician mobile app.

Patient mobile concepts should show:

- Health Passport;
- appointments;
- medication;
- vaccinations;
- notifications;
- referral status;
- transfer status;
- Ayanda access.

Clinician mobile concepts should show:

- authorised patient context;
- appointment queue;
- notifications;
- referral status;
- capacity/transfer operational context;
- Ayanda access.

The preview must be presented as a demonstrator. Do not claim a native mobile application has been published unless it has actually been built and released.

## 8. Ayanda v0.4 requirements

Ayanda must understand navigation and explanation intents for:

- Appointment Management Centre;
- Notification Centre;
- Medication & Vaccine Management;
- hospital bed capacity;
- ambulance availability;
- patient transfers;
- Mobile App Preview;
- referral outcomes;
- Care Gaps;
- Health Passport.

Examples:

- “Open appointment management.”
- “Show my notifications.”
- “Show medication and vaccines.”
- “Which ambulances are available?”
- “Open patient transfers.”
- “Show the mobile app.”

Ayanda must not autonomously prescribe, diagnose, determine vaccination eligibility, dispatch real ambulances, or fabricate live operational status.

## 9. Safety and truthful representation

The v0.4 release must explicitly state that the following are synthetic unless live authorised integrations are actually completed:

- patients;
- clinical records;
- appointments;
- bed capacity;
- ambulance availability;
- ambulance ETA;
- transfer status;
- medication/vaccination records;
- notifications;
- referral outcomes.

Do not claim live EMS/CAD, GPS, national vaccination registry, pharmacy-dispensing, hospital bed-management or clinical-system integration without evidence.

## 10. Definition of done

v0.4 is complete only when:

- at least 120 synthetic patients are available;
- login and in-app user-type dropdowns work;
- server-side role scope remains enforced;
- Appointment Management Centre works;
- Notification Centre works;
- Medication & Vaccine Management works for authorised roles;
- Mobile App Preview is available and responsive;
- ambulance fleet availability is visible;
- patient transfer requests can be created and managed;
- compatible ambulance matching works in synthetic mode;
- destination bed validation works for bed-dependent transfers;
- transfer actions generate notifications and audit events;
- Ayanda navigates the new centres;
- desktop/tablet/mobile layouts are usable;
- CI typecheck, tests and production build pass;
- all synthetic operational data is clearly labelled.
