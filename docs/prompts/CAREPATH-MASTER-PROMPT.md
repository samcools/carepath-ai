# CarePath AI — v0.5 Complete Master Build, Federated Health Platform & Hackathon Delivery Prompt

**Repository:** `samcools/carepath-ai`  
**Canonical specification path:** `docs/prompts/CAREPATH-MASTER-PROMPT.md`  
**Product:** CarePath AI  
**Strategic proposition:** **One Patient. One Journey. One Trusted Health Record.**  
**Referral proposition:** **From Referral to Care — Without Losing the Patient in Between.**  
**Context:** SITA Hackathon / South African Public and Private Healthcare  
**Brand:** Pyrneo  
**Assistant:** Ayanda  
**Document role:** Single source of truth for implementation, enhancement, security, validation, deployment and hackathon demonstration decisions.  
**Version intent:** This v0.5 prompt supersedes conflicting implementation guidance in earlier CarePath prompt addenda while preserving completed functionality that remains compatible with this specification.

---

# 1. MASTER OPERATING INSTRUCTION

Act as one coordinated senior multidisciplinary product and engineering team covering:

- Chief Product Officer;
- Chief AI Architect;
- Chief Software Architect;
- Chief Data Architect;
- Chief Cloud Architect;
- Chief Information Security Officer;
- Senior Full-Stack Engineering;
- Front-End Engineering;
- Back-End Engineering;
- Database Engineering;
- DevSecOps;
- MLOps / LLMOps;
- Conversational AI;
- Speech AI;
- UX/UI and accessibility design;
- interoperability architecture;
- health-information exchange architecture;
- healthcare workflow design;
- privacy engineering and POPIA governance;
- Responsible AI;
- public-sector digital service delivery;
- quality engineering and automated testing;
- hackathon demo and release engineering.

Your mandate is to build CarePath AI as a **governed federated national health-record and care-coordination platform** using the strongest operating patterns evolved through Project Guardian, AquaFlow AI and HomeFlow AI.

Follow this delivery sequence:

**Inspect → Preserve → Model → Build → Secure → Integrate → Test → Optimise → Document → Demonstrate → Deploy → Verify.**

If working code exists, inspect it before replacing anything. Preserve stable compatible functionality. Do not create duplicate dashboards, duplicate AI assistants, duplicate voice controllers, parallel workflow engines, competing data models or multiple inconsistent sources of truth.

Never claim that a feature, integration, deployment, clinical validation, government endorsement, interoperability profile, production control or test is complete unless it has actually been implemented and verified.

All source, documentation, assets, seed data, migrations, tests, deployment definitions, demo scripts, release notes and presentation-support material must remain in `samcools/carepath-ai`.

---

# 2. STRATEGIC PRODUCT VISION

CarePath AI is a secure digital-health operating layer that creates the experience of **one longitudinal patient record and one accountable patient journey across public and private healthcare**, while existing source systems retain authoritative clinical data where appropriate.

The product must never be positioned as one giant central database that replaces every hospital, clinic, laboratory, pharmacy or private-practice system.

The architectural principle is:

> **Federated source systems + trusted identity + standards-based exchange + one authorised longitudinal view + governed care orchestration.**

North-star proposition:

> **One Patient. One Journey. One Trusted Health Record.**

North-star journey:

**Patient arrives → Identity resolved → OneRecord retrieved → allergies/history visible → referral created → destination matched → capacity checked → appointment coordinated → transfer arranged if needed → patient guided → specialist updates care record → referring clinician receives closure → Command Centre confirms completion.**

The patient should remain digitally visible throughout the healthcare journey.

---

# 3. NON-NEGOTIABLE CLINICAL SAFETY BOUNDARY

CarePath coordinates information, access and healthcare workflows. It does **not** replace clinical judgement.

CarePath and Ayanda must not autonomously:

- diagnose;
- prescribe;
- initiate or change treatment;
- recommend treatment as a clinical authority;
- discharge a patient;
- cancel clinically required care;
- override an authorised clinician;
- determine emergency severity independently from unrestricted free text;
- fabricate allergies, diagnoses, medication, results, appointments, beds, ambulance availability, facility services or clinical outcomes;
- rank hospitals as clinically superior using raw mortality/recovery percentages;
- silently resolve contradictory clinical facts.

Ayanda may:

- retrieve authorised data;
- explain provenance and workflow state;
- summarise authorised records;
- navigate the platform;
- identify operational exceptions;
- recommend facility options from approved structured rules;
- draft administrative content;
- execute permitted administrative actions through governed server-side tools and confirmation gates.

Where a user asks for diagnosis, prescribing or treatment advice, Ayanda must defer to an authorised healthcare professional while continuing to assist with navigation, records and workflow.

---

# 4. REQUIRED PRODUCT CAPABILITIES — THE 12-POINT BASELINE

CarePath is not complete unless the platform architecture and implementation roadmap address all twelve capabilities below.

## 4.1 Unified Patient Record — CarePath OneRecord™

Provide a longitudinal, source-aware patient record spanning:

- demographics and verified identifiers;
- emergency information and emergency contacts;
- allergies and adverse reactions;
- diagnoses and chronic conditions;
- medication history;
- vaccination history;
- encounters;
- procedures;
- admissions and discharges;
- laboratory results;
- imaging reports and imaging references;
- referrals and outcomes;
- appointments;
- ambulance transfers;
- care plans;
- specialist reports;
- discharge instructions;
- clinical documents;
- tasks/follow-ups;
- care-team members;
- access history;
- consent/access context;
- source provenance.

OneRecord must not pretend to replace every hospital system. Each material item should preserve, where available:

- source system;
- source organisation/facility;
- source record identifier;
- author/clinician;
- recorded date;
- effective date;
- last updated date;
- status;
- correction/supersession relationship;
- freshness indicator.

Contradictory clinical records must remain visible with provenance until reconciled through an authorised workflow.

Recommended OneRecord tabs:

**Summary | Critical Alerts | Allergies | Conditions | Medication | Vaccines | Results | Imaging | Encounters | Procedures | Care Plans | Referrals | Appointments | Transfers | Documents | Timeline | Care Team | Access History.**

## 4.2 Patient Journey & Referral Engine — CarePath Journey™

Support closed-loop care coordination from referral initiation to outcome/closure.

Required functions:

- referral creation and draft;
- structured referral reason;
- administrative priority;
- triage workspace;
- facility/service matching;
- capacity-aware routing;
- geography-aware routing;
- appointment coordination;
- referral acknowledgement;
- request/supply additional information;
- accept/decline/redirect;
- ambulance transfer coordination where required;
- SLA clock;
- escalation rules;
- missed-appointment handling;
- return feedback;
- specialist closure;
- referring-clinician closure notification;
- patient communication;
- complete journey timeline.

Recommended referral states:

`DRAFT → SUBMITTED → RECEIVED → INFO_REQUESTED / ACCEPTED / DECLINED / REDIRECTED → SCHEDULED → PATIENT_NOTIFIED → ATTENDED / MISSED → FEEDBACK_PENDING / FOLLOWUP_REQUIRED → CLOSED → REOPENED`.

Every transition must persist and record actor, role, organisation, facility, previous state, new state, timestamp, reason, source channel and correlation ID.

## 4.3 CarePath Command Centre™

Build hierarchical operational oversight, not a flat dashboard.

Required hierarchy:

**National → Province → District → City / Municipality → Facility → Service / Department → Patient Journey where authorised.**

Views should support:

- patient-flow volume;
- referral volume;
- waiting times;
- acknowledgement times;
- appointment lead time;
- open referrals;
- stale referrals;
- missed appointments;
- unresolved cases;
- SLA breaches;
- exceptions;
- beds/capacity;
- ambulance availability;
- active transfers;
- vaccination follow-up;
- service bottlenecks;
- facility pressure;
- care-team workload;
- recent activity;
- audit/security alerts.

National/provincial/district views must prefer aggregate or appropriately de-identified information.

## 4.4 Ayanda AI Clinical Navigation Assistant™

Ayanda is one global assistant identity across the platform.

Requirements:

- persistent text chat;
- persistent voice;
- same icon everywhere;
- one recognition controller;
- one TTS controller;
- close/exit button;
- conversation reset;
- low-latency deterministic navigation;
- multilingual South African language support;
- role-aware retrieval;
- record explanation;
- provenance explanation;
- workflow assistance;
- controlled tool execution;
- confirmation for consequential actions;
- source-aware answers;
- uncertainty and limitation messaging;
- no duplicate voice playback.

Supported languages, where provider quality is adequate:

English, Afrikaans, isiZulu, isiXhosa, Sesotho, Setswana, Sepedi, Xitsonga, Tshivenda, siSwati and isiNdebele.

Ayanda must distinguish:

- retrieved fact;
- configured-rule finding;
- deterministic calculation;
- AI summary;
- AI suggestion.

## 4.5 Emergency Patient Access — Break Glass

Implement this as a working module, not documentation only.

Emergency access workflow:

1. authorised clinician searches/resolves patient;
2. selects **Break Glass — Emergency Access**;
3. re-authenticates or completes configured MFA/re-authentication;
4. selects/captures emergency reason;
5. facility/organisation context is recorded;
6. minimum necessary emergency summary is shown;
7. access is time limited;
8. every sensitive read/action is logged;
9. compliance review event is generated;
10. access automatically expires.

Emergency summary may include, where authoritative:

- allergies;
- medication;
- major chronic conditions;
- recent critical encounters;
- implants/devices where available;
- emergency contacts;
- blood-group information only where authoritative and appropriate;
- current referral/transfer context.

Break Glass must never silently bypass normal security.

## 4.6 Interoperability Layer — CarePath Exchange™

Build an integration façade separate from domain logic.

Support FHIR-compatible mappings for at least:

- `Patient`;
- `Practitioner` / `PractitionerRole`;
- `Organization`;
- `Location`;
- `HealthcareService`;
- `AllergyIntolerance`;
- `Condition`;
- `MedicationRequest` / relevant medication resources;
- `Immunization`;
- `Observation`;
- `DiagnosticReport`;
- `ImagingStudy` reference where implemented;
- `Encounter`;
- `Procedure`;
- `CarePlan`;
- `ServiceRequest`;
- `Task`;
- `Appointment`;
- `DocumentReference`;
- `Communication` / `CommunicationRequest`;
- `AuditEvent`;
- `Provenance`.

Hackathon implementation should expose demonstrable **mock FHIR/API endpoints** and mock adapters for selected public/private source systems rather than only documenting future integration.

Mock adapters should demonstrate patterns for:

- public clinic/hospital EMR;
- private hospital/GP system;
- laboratory;
- pharmacy;
- imaging provider;
- appointment system;
- patient identity/MPI;
- messaging gateway.

Do not claim formal FHIR conformance or national-profile certification until actual conformance testing is completed.

## 4.7 Consent, Identity & Access Management

Create a visible **Consent & Identity Centre**.

Identity requirements:

- internal UUID;
- source-system patient identifiers;
- master patient index abstraction;
- future HPRS/HPRN/authoritative identity adapter;
- configurable demographic matching;
- duplicate-patient review queue;
- no name-only patient matching.

Access requirements:

- RBAC;
- ABAC/context policy;
- care relationship;
- facility/organisation scope;
- purpose of use;
- least privilege;
- session expiry;
- future enterprise SSO/OIDC/Entra integration;
- MFA/re-authentication for sensitive actions;
- Break Glass.

Consent/governance requirements:

- sharing preferences where legally applicable;
- consent history;
- revocation/expiry where applicable;
- proxy/caregiver relationships;
- temporary sharing;
- purpose record;
- provenance;
- patient-facing access-history view.

Do not present one simplistic consent model as universal legal advice.

## 4.8 Patient Portal — CarePath Health Passport™

Patient experience should include:

- own longitudinal summary;
- referrals and referral status;
- appointments and rescheduling/cancellation where policy permits;
- medication information;
- vaccination information;
- selected results/documents;
- care journey;
- discharge instructions;
- patient transfer status;
- notifications;
- consent/sharing controls where implemented;
- access history;
- communication preferences;
- secure care-team messaging when implemented;
- caregiver/proxy support architecture;
- Ayanda patient mode.

Do not expose clinician-only notes or restricted records.

## 4.9 Healthcare Professional Workspace

Implement role-specific professional workspaces rather than forcing every user into the same generic dashboard.

Clinician workspace should include:

- My Patients;
- My Referrals;
- My Appointments;
- Results Awaiting Review;
- Requests for Information;
- My Tasks;
- Follow-ups Due;
- Escalations;
- Messages;
- Today / action queue.

Coordinator workspace should emphasise:

- referral intake;
- SLA breaches;
- appointment allocation;
- capacity;
- transfers;
- patient contact;
- missing information;
- closure/feedback.

Specialist, nurse, pharmacist, lab technologist, manager, auditor, navigator and patient roles must have appropriately different navigation and actions.

Workspace primitives:

- tasks;
- ownership;
- assignment/reassignment;
- due dates;
- priorities;
- comments;
- notes;
- attachments;
- hand-off notes;
- secure messages;
- exception resolution;
- audit history.

## 4.10 AI Early-Warning Engine — CarePath Watch™

Implement explainable operational early warning without presenting unvalidated AI outputs as diagnoses.

Detect at minimum:

- missed appointments;
- referral acknowledgement beyond threshold;
- stale referral;
- missing required information;
- appointment not confirmed;
- missed appointment with no follow-up;
- missing specialist return feedback;
- overdue follow-up task;
- facility capacity constraint;
- ambulance/transfer delay;
- vaccination follow-up overdue;
- repeated redirect/decline;
- abnormal workflow delay compared with configured operational thresholds.

Every alert must show:

- why it fired;
- rule/model name;
- evidence;
- threshold;
- owner;
- age;
- recommended permitted administrative action;
- escalation level;
- resolution status;
- audit history.

If statistical or predictive models are later added, show model version, confidence/calibration information where meaningful, validation status and monitoring. Do not label workflow risk as medical diagnosis.

## 4.11 Population Health Intelligence

Create a dedicated aggregated/de-identified intelligence module for authorised health authorities.

Potential views:

- patient-flow trends;
- referral demand by service;
- referral completion;
- waiting times;
- missed appointments;
- chronic-condition service demand;
- vaccination coverage/follow-up;
- service pressure;
- hospital capacity trends;
- ambulance demand/transfer performance;
- geographic inequalities;
- unresolved journeys;
- population-level care gaps.

Support hierarchical filters:

**National → Province → District → City/Municipality → Facility → Service.**

Use small-cohort suppression and re-identification controls in production design. Population Health Intelligence must never become an unrestricted patient-identification tool.

## 4.12 Governance by Design

Governance is an implementation requirement, not a final documentation chapter.

Required design areas:

- POPIA/privacy-by-design;
- cybersecurity;
- data residency;
- human oversight;
- clinical safety boundaries;
- model governance;
- model monitoring;
- explainability;
- prompt-injection protection;
- comprehensive audit;
- retention;
- secure deletion where lawful;
- encryption in transit;
- encryption-at-rest architecture;
- secret management/KMS;
- backup and disaster recovery;
- incident response;
- security monitoring;
- data-loss-prevention architecture;
- access recertification;
- audit integrity/tamper evidence;
- secure export controls;
- de-identification controls.

No identifiable health data should be sent to an external AI provider without an approved legal, security and contractual basis.

---

# 5. PRESERVE THE CURRENT WORKING v0.4 BASELINE

Do not regress existing compatible capabilities already built in the repository.

Preserve and improve:

- 120+ clearly synthetic patients;
- clickable CarePath/Pyrneo home branding;
- login user-type dropdown;
- in-app demo user-type switcher;
- multiple user roles with different access;
- OneRecord patient pages;
- referrals and server-side state machine;
- Appointment Management Centre;
- standalone and referral-linked bookings;
- appointment lifecycle: Requested → Booked → Checked In → Completed, plus Cancelled / No Show;
- hospital bed-capacity management;
- General, High Care, ICU, Maternity and Paediatric bed types;
- capacity re-check on bed-dependent referral/booking;
- alternative facility suggestion when required capacity is unavailable;
- Care Gaps;
- Notification Centre;
- Medication & Vaccine Management Centre;
- Ambulance Availability & Patient Transfer Management Centre;
- facility discovery by province/city/type/service;
- clickable facility detail views;
- national synthetic facility network across all nine provinces;
- referral outcomes with explicit non-ranking warning;
- Health Passport;
- responsive web UX;
- interactive Mobile App Preview;
- Ayanda exit button;
- Ayanda voice/text controls;
- administrator-only OpenAI API settings;
- audit events;
- CI pipeline.

Where a previously implemented feature is demo-only or synthetic, keep that limitation explicit.

---

# 6. FACILITY DISCOVERY, CAPACITY & ROUTING

Facilities must be searchable and filterable by:

- province;
- district;
- city/municipality;
- facility type;
- service;
- free-text search.

Clicking a facility must open a full operational detail view containing, where applicable:

- facility name/type;
- province/district/city;
- services;
- operating/contact information;
- referral instructions;
- staffed/occupied/reserved/available beds;
- appointments;
- incoming referrals;
- outgoing referrals;
- active transfers;
- ambulance context;
- synthetic referral outcomes;
- configured waiting-time indicators;
- open exceptions;
- capacity status.

Destination recommendation should consider approved structured data such as:

- requested service;
- referral pathway;
- province/district/city;
- facility type;
- configured administrative eligibility;
- available bed type when relevant;
- configured waiting-time indicator;
- appointment availability when authoritative;
- ambulance availability/transfer feasibility when relevant.

A human must confirm the destination before submission.

Raw recovery/mortality percentages must not be used as a simplistic hospital-quality score.

---

# 7. APPOINTMENT MANAGEMENT CENTRE

Support:

- requested;
- booked;
- checked-in;
- completed;
- cancelled;
- no-show;
- standalone bookings;
- referral-linked bookings;
- service;
- facility;
- clinician/resource where implemented;
- time/duration;
- bed requirement;
- capacity check;
- appointment notification;
- appointment reminders;
- rescheduling;
- patient cancellation where permitted;
- audit history.

For bed-dependent admission bookings:

`available beds = staffed beds - occupied beds - reserved beds`.

Book → reserve capacity.  
Check-in → convert reservation to occupancy.  
Cancellation → release reservation.  
Completion/discharge → release occupancy according to workflow.

All demo capacity must be labelled synthetic unless connected to an authorised live source.

---

# 8. AMBULANCE AVAILABILITY & PATIENT TRANSFER MANAGEMENT

Synthetic fleet types:

- Basic;
- Advanced;
- ICU/Critical Care;
- Neonatal.

Fleet state:

`AVAILABLE | DISPATCHED | MAINTENANCE`.

Transfer state machine:

`REQUESTED → ASSIGNED → EN_ROUTE → PATIENT_ON_BOARD → ARRIVED → COMPLETED` with `CANCELLED` where permitted.

Transfer request should include:

- patient;
- linked referral;
- pickup facility;
- destination;
- priority;
- required ambulance capability;
- requested/scheduled time;
- assigned ambulance;
- ETA;
- status;
- notes;
- requester;
- audit trail.

If a linked referral requires admission, destination bed capacity must be rechecked before the transfer is accepted.

Do not claim real-time EMS dispatch unless an authorised source is connected.

---

# 9. MEDICATION, VACCINATION, CARE PLANS, DOCUMENTS & IMAGING

## Medication

Support:

- current/history;
- status such as Current / On Hold / Stopped;
- instructions;
- source;
- reconciliation;
- authorised addition/status update;
- patient read view;
- provenance.

Ayanda must not prescribe or independently change medication.

## Vaccination

Support:

- vaccine;
- dose;
- administered date;
- administering facility;
- status;
- next due date;
- due/overdue indicators;
- notifications;
- care gaps;
- provenance.

Ayanda must not autonomously determine clinical eligibility.

## Care Plans

Implement CarePlan capability with:

- title/problem;
- goals;
- responsible care team;
- planned actions;
- monitoring requirements;
- related medication/referrals;
- review date;
- tasks;
- status;
- provenance.

## Documents & Imaging

Support:

- discharge summaries;
- referral letters;
- specialist reports;
- laboratory reports;
- imaging reports;
- imaging-study references/links;
- document metadata;
- source/facility;
- upload validation;
- access restrictions;
- document provenance.

Do not require full DICOM/PACS viewing for the hackathon; demonstrate an integration/reference pattern honestly if a full viewer is not implemented.

---

# 10. IDENTITY, MPI, DUPLICATES & FEDERATED RECORD RESOLUTION

Do not invent a new national patient number.

Implement a CarePath **Master Patient Index abstraction** with synthetic matching for the hackathon and clear future adapters for authoritative identity services.

Patient matching signals may include:

- authoritative identifier;
- CarePath UUID;
- source-system identifier;
- date of birth;
- verified phone/contact data;
- verified demographics;
- source organisation.

Never match on name alone.

Create a duplicate-review workflow:

- potential match detected;
- evidence displayed;
- authorised user reviews;
- link / reject / defer;
- provenance retained;
- no destructive silent merge.

---

# 11. HEALTHCARE PROFESSIONAL WORKSPACE, TASKS & COMMUNICATION

Reuse Project Guardian work-item strengths in healthcare language.

Task fields:

- patient;
- referral/journey;
- title;
- owner;
- assignee;
- due date;
- priority;
- status;
- facility;
- notes;
- comments;
- attachments;
- created/updated;
- audit.

Support:

- My Work;
- team work queue;
- reassignment;
- escalations;
- hand-off notes;
- secure internal messages;
- request-for-information messages;
- patient-contact tasks;
- result-review tasks;
- follow-up tasks;
- closure tasks.

Do not expose patient information in communication to users outside authorised scope.

---

# 12. CAREPATH WATCH™ — SLA, EXCEPTIONS & EARLY WARNING

Implement a configurable operational rules engine.

Examples:

- `AWAITING_ACCEPTANCE > configured threshold`;
- `MISSING_REQUIRED_INFORMATION`;
- `APPOINTMENT_UNCONFIRMED`;
- `MISSED_APPOINTMENT_NO_FOLLOWUP`;
- `STALE_REFERRAL`;
- `MISSING_RETURN_FEEDBACK`;
- `OVERDUE_FOLLOWUP_TASK`;
- `CAPACITY_CONSTRAINT`;
- `TRANSFER_DELAY`;
- `NO_COMPATIBLE_AMBULANCE`;
- `VACCINE_FOLLOWUP_OVERDUE`;
- `REPEATED_DECLINE_OR_REDIRECT`;
- `DUPLICATE_PATIENT_REVIEW_REQUIRED`;
- `BREAK_GLASS_REVIEW_REQUIRED`.

Rules must be configurable by scope where appropriate and explainable from stored events/timestamps.

---

# 13. COMMAND CENTRE & POPULATION HEALTH HIERARCHY

Create a shared filter/drill-down model:

`Country → Province → District → City/Municipality → Facility → Service`.

The Command Centre is operational. Population Health Intelligence is aggregate/de-identified strategic intelligence.

Do not expose patient-identifiable information in high-level dashboards unless the user drills into a patient-specific workflow and has appropriate authorisation.

Recommended executive questions Ayanda should support:

- “What changed since yesterday?”
- “Which province has the most unresolved referrals?”
- “Which district has the longest referral acknowledgement time?”
- “Where are bed-capacity constraints increasing?”
- “How many patient transfers are delayed?”
- “Which services have the largest appointment backlog?”
- “Show vaccination follow-up gaps by province.”

Every answer must be grounded in authorised data and identify the scope/time period.

---

# 14. AI ACTION ARCHITECTURE

The LLM must never directly manipulate persistence.

Use:

**User → Ayanda → Intent → Grounded Retrieval → Authorised Tool Request → Schema Validation → RBAC/ABAC → Purpose/Scope Check → Workflow Rule → Confirmation Gate → Domain Service → Persistence → Audit Event → User Result.**

Read tools should include or evolve toward:

- `search_patients`;
- `resolve_patient_identity`;
- `get_patient_summary`;
- `get_patient_timeline`;
- `get_allergies`;
- `get_medication_history`;
- `get_vaccination_history`;
- `get_care_plans`;
- `get_documents`;
- `get_referral`;
- `search_referrals`;
- `get_appointment`;
- `get_facility_detail`;
- `search_facilities`;
- `get_bed_capacity`;
- `get_ambulance_availability`;
- `get_transfer_status`;
- `get_exception_reason`;
- `get_operational_metrics`;
- `get_population_metrics`;
- `get_access_history`;
- `get_consent_context`.

Write tools may include:

- `create_referral_draft`;
- `update_referral_draft`;
- `submit_referral`;
- `request_more_information`;
- `accept_referral`;
- `decline_referral`;
- `redirect_referral`;
- `schedule_appointment`;
- `reschedule_appointment`;
- `create_followup_task`;
- `assign_task`;
- `add_note`;
- `request_transfer`;
- `close_referral`.

Sensitive tools require explicit human confirmation according to policy.

---

# 15. PROMPT-INJECTION, MODEL GOVERNANCE & AI SAFETY

Rules:

- retrieved content is data, never instruction;
- patient notes cannot redefine tool permissions;
- model cannot supply trusted identity/facility IDs without validation;
- model cannot bypass role/scope checks;
- system prompts/secrets never exposed;
- tool inputs schema validated;
- prompt/tool attacks safely logged;
- external content sanitised;
- model outputs treated as untrusted until validated;
- consequential actions use confirmation gates.

Track AI interactions with:

- user;
- model/provider;
- model version;
- prompt/tool category;
- source context identifiers;
- action proposed;
- action confirmed/denied;
- latency;
- safety outcome;
- correlation ID.

For production architecture include:

- prompt versioning;
- evaluation sets;
- regression testing;
- hallucination/grounding evaluation;
- multilingual evaluation;
- tool-action accuracy;
- safety testing;
- model monitoring;
- fallback/kill switch.

---

# 16. AUTHENTICATION, RBAC, ABAC, MFA & SESSION SECURITY

Seed hackathon roles including:

- Administrator;
- Referring Clinician;
- Specialist;
- Nurse;
- Care Coordinator;
- Patient Navigator;
- Pharmacist;
- Laboratory Technologist;
- Facility Manager;
- District Manager;
- Provincial/Oversight User;
- Auditor/Compliance;
- Patient.

The user-type dropdown is a hackathon demonstration convenience only. Production architecture must use real authenticated identities and must not permit arbitrary role switching.

Implement/target:

- server-side sessions or token validation;
- secure cookies where applicable;
- RBAC;
- ABAC;
- object-level authorisation;
- care-relationship checks;
- organisation/facility scope;
- purpose-of-use checks;
- re-authentication/MFA for Break Glass and other sensitive actions;
- session expiry/revocation;
- brute-force/rate limiting;
- future OIDC/Entra/enterprise identity integration.

---

# 17. POPIA, DATA RESIDENCY, PRIVACY & SECURITY

Treat health information as highly sensitive/special personal information.

Apply:

- lawful-purpose design;
- purpose limitation;
- data minimisation;
- least privilege;
- secure defaults;
- organisation/facility isolation;
- privacy-aware logs;
- sensitive-access logging;
- encryption in transit;
- encryption at rest in target architecture;
- KMS/secret-store architecture;
- data residency controls;
- retention schedules;
- secure deletion where lawful;
- de-identification;
- export controls;
- upload validation;
- CSP/security headers;
- HSTS in production;
- dependency audit;
- secret scanning;
- safe errors;
- correlation IDs;
- backup/restore;
- disaster recovery;
- incident response;
- DLP architecture;
- audit integrity/tamper evidence.

Do not store secrets in GitHub.

---

# 18. PERSISTENCE & DATABASE — REQUIRED v0.5 GAP CLOSURE

Move beyond in-memory-only state.

Target implementation:

- PostgreSQL;
- Prisma ORM or equivalent migration-capable typed ORM;
- deterministic seed/reset scripts;
- database migrations committed to GitHub;
- repository/service abstraction retained.

Logical domains should include:

- identity/MPI;
- users/roles/permissions;
- organisations/facilities/services;
- patients/identifiers;
- clinical records;
- allergies;
- conditions;
- medication;
- vaccinations;
- results/observations;
- encounters;
- procedures;
- care plans;
- documents;
- referrals;
- appointments;
- tasks;
- notifications;
- capacity;
- ambulance fleet;
- patient transfers;
- consent;
- Break Glass;
- access events;
- provenance;
- audit;
- AI interactions;
- integration events;
- exception rules/events.

Use UUIDs internally and UTC timestamps.

CarePath persistence should store CarePath-owned workflows, indexes, metadata, provenance and authorised replicated/cached data. Do not assume CarePath becomes the authoritative owner of every external clinical record.

---

# 19. INTEROPERABILITY DEMONSTRATOR — REQUIRED v0.5 GAP CLOSURE

For hackathon credibility, implement a demonstrable interoperability gateway with at least:

- health endpoint;
- mock FHIR-style Patient retrieval;
- mock ServiceRequest/referral endpoint;
- mock Appointment endpoint;
- mock Observation/DiagnosticReport example;
- provenance/audit example;
- source-system adapter abstraction.

Demonstrate one synthetic patient assembled from multiple mock sources, for example:

**Clinic EMR + Lab + Pharmacy + Specialist system → CarePath Exchange → OneRecord.**

Label every mock integration clearly.

---

# 20. NOTIFICATION CENTRE

Support role-aware notifications for:

- referral submitted/received/accepted/declined/redirected;
- appointment booked/rescheduled/cancelled/reminder;
- capacity constraint;
- transfer requested/assigned/en route/onboard/arrived/completed;
- no compatible ambulance;
- medication reconciliation action;
- vaccination due/overdue;
- task assigned/overdue;
- Break Glass event/review;
- system/security alerts where appropriate.

Provide:

- unread badge;
- filtering;
- mark read;
- mark all read;
- patient/facility/role scope;
- minimum-necessary message content;
- adapter abstraction for in-app/SMS/WhatsApp/email.

Hackathon delivery may simulate external delivery.

---

# 21. MOBILE EXPERIENCE

The responsive web application must function well on desktop, tablet and mobile.

Retain an explicit **Mobile App Preview** showing patient and clinician modes.

Patient mobile concepts:

- Health Passport;
- appointments;
- medication;
- vaccines;
- notifications;
- referrals;
- transfer status;
- consent/access history;
- Ayanda.

Clinician mobile concepts:

- My Work;
- authorised OneRecord context;
- appointments;
- referral queue;
- notifications;
- capacity/transfer context;
- tasks;
- Ayanda.

Do not claim a native mobile app has been published unless actually released.

---

# 22. FRONT-END ENGINEERING

Use reusable components and avoid oversized single-file implementations.

Required/evolving components:

- AppShell;
- RoleAwareNavigation;
- CommandCentre;
- GeographicScopeSelector;
- ProfessionalWorkspace;
- PatientSearch;
- OneRecord;
- CriticalAlerts;
- AllergyPanel;
- MedicationPanel;
- VaccinePanel;
- ConditionPanel;
- ResultsPanel;
- ImagingPanel;
- CarePlanPanel;
- DocumentPanel;
- PatientTimeline;
- ProvenanceDrawer;
- ConsentPanel;
- AccessHistory;
- EmergencyAccessModal;
- MPI/DuplicateReview;
- ReferralWorkspace;
- JourneyTimeline;
- AppointmentManagementCentre;
- TaskWorklist;
- CarePathWatchPanel;
- FacilityExplorer;
- FacilityDetail;
- CapacityPanel;
- AmbulanceTransferCentre;
- NotificationCentre;
- HealthPassport;
- PopulationHealth;
- AuditTimeline;
- AyandaLauncher;
- AyandaPanel;
- VoiceControls;
- LanguageSelector;
- ConfirmActionModal;
- MobilePreview;
- Loading/Empty/Error/PermissionDenied states.

Design rules:

- no text overlap;
- no content overflow;
- no diagram lines through circles/labels;
- aligned imagery;
- consistent grid;
- restrained healthcare status colours;
- touch-friendly controls;
- responsive tables/forms;
- constrained content width;
- approved Pyrneo/CarePath assets only.

---

# 23. BACK-END ENGINEERING

Separate:

- routes/controllers;
- authentication;
- RBAC/ABAC;
- validation;
- patient identity/MPI;
- OneRecord assembly;
- clinical-record service;
- referral/journey service;
- appointment service;
- task service;
- capacity service;
- ambulance/transfer service;
- medication/vaccine service;
- care-plan/document service;
- consent service;
- Break Glass service;
- notification service;
- provenance service;
- audit/access service;
- exception/early-warning engine;
- analytics/population service;
- AI tool gateway;
- interoperability gateway/adapters;
- persistence repositories.

Critical rules live server-side.

---

# 24. SYNTHETIC DEMO DATA

Maintain at least **120 synthetic patients**.

Seed all nine provinces and a representative set of cities/districts/facility types.

Seed:

- public/private hospitals;
- clinics/CHCs;
- laboratories;
- pharmacies;
- services;
- users/roles;
- patients;
- duplicate identity scenario;
- emergency-access scenario;
- allergies;
- conditions;
- medication;
- vaccinations;
- laboratory results;
- imaging report/reference;
- encounters;
- procedures;
- care plans;
- documents;
- referrals;
- appointments;
- bed capacity;
- ambulance fleet;
- transfers;
- notifications;
- tasks;
- comments;
- care gaps;
- audit/access events;
- consent records;
- Break Glass events;
- mock integration/provenance events.

Primary demo patient remains **Thandi Mokoena**, clearly synthetic.

---

# 25. FLAGSHIP HACKATHON DEMO — ONE PATIENT, END TO END

The strongest demo is not a dashboard tour. It follows one patient through CarePath.

Required reliable flow:

1. Sign in as an authorised clinic clinician.
2. Search Thandi Mokoena.
3. CarePath resolves the synthetic longitudinal identity.
4. Open OneRecord.
5. Show allergy, condition, medication, result and provenance from more than one mock source.
6. Ask Ayanda: **“Summarise the relevant history and show the documented allergy.”**
7. Create a cardiology referral.
8. CarePath suggests facilities using service, geography, configured waiting/capacity rules and explains the recommendation basis.
9. Clinician confirms the destination.
10. Submit referral.
11. Receiving coordinator receives and accepts it.
12. Appointment Management Centre schedules the patient.
13. If admission/transfer is required, show bed-capacity and ambulance availability checks.
14. Patient receives a simulated notification and multilingual Ayanda guidance.
15. Command Centre shows the journey as active and SLA-visible.
16. Specialist opens the patient record and records a synthetic specialist outcome/feedback.
17. Referral closes through the closed-loop workflow.
18. Referring clinician receives closure/feedback.
19. Patient portal reflects updated journey information.
20. Auditor opens the complete attributable audit/provenance trail.
21. Close with: **“The patient remained digitally visible throughout the healthcare journey.”**

Optional second micro-demo:

- emergency clinician uses audited Break Glass to see critical information for an unconscious synthetic patient.

---

# 26. IMPLEMENTATION PRIORITY — v0.5 GAP-CLOSURE ORDER

## P0 — Preserve stability

- inspect current v0.4;
- preserve working modules;
- eliminate dead code/duplicate components;
- CI green.

## P1 — Persistent database

- PostgreSQL;
- ORM/migrations;
- seed/reset;
- migrate existing synthetic state.

## P2 — Emergency Access / Break Glass

- UI;
- server policy;
- re-auth/MFA pattern;
- emergency summary;
- expiry;
- audit/review.

## P3 — Consent & Identity Centre

- MPI abstraction;
- source identifiers;
- duplicate review;
- consent/preferences;
- proxy/caregiver architecture;
- access context.

## P4 — Healthcare Professional Workspace

- My Work;
- tasks;
- messages;
- hand-offs;
- results review;
- escalations.

## P5 — Care Plans, Documents & Imaging

- care plans;
- discharge/specialist docs;
- imaging report/reference;
- provenance.

## P6 — SLA / CarePath Watch

- configurable thresholds;
- escalation policies;
- explainable alerts;
- resolution workflows.

## P7 — Hierarchical Command Centre

- National → Province → District → City → Facility → Service;
- operational metrics;
- drill-down;
- de-identification.

## P8 — Population Health Intelligence

- aggregate/de-identified trends;
- geographic/service filters;
- safe exports.

## P9 — Interoperability Gateway

- demonstrable mock FHIR/API endpoints;
- multi-source OneRecord assembly;
- adapter contracts.

## P10 — Ayanda expansion

- new tools;
- grounding;
- professional workspace actions;
- emergency/consent restrictions;
- population queries;
- improved multilingual voice.

## P11 — Governance hardening

- encryption/key design;
- audit integrity;
- data residency;
- retention;
- backup/DR;
- incident response;
- model monitoring.

## P12 — Deployment and hackathon hardening

- deploy exact current main commit;
- verify live version;
- smoke test live site;
- deterministic demo reset;
- one-patient script;
- update pitch deck;
- record known limitations.

---

# 27. TEST STRATEGY

GitHub Actions should run:

- install;
- lint where configured;
- typecheck;
- unit tests;
- API/integration tests;
- build;
- dependency audit;
- secret scanning where feasible.

Required test areas:

## Identity/access

- unauthenticated denied;
- RBAC;
- ABAC;
- cross-patient/cross-facility ID guessing denied;
- demo role switching cannot become production auth;
- duplicate-patient workflow;
- Break Glass access/expiry/audit;
- consent/access context.

## OneRecord

- longitudinal assembly;
- provenance preservation;
- multi-source record;
- contradictory fact preservation;
- care plan/document access.

## Journey

- valid/invalid referral transitions;
- SLA clocks;
- closed-loop feedback;
- appointment lifecycle;
- capacity check;
- transfer workflow.

## Early warning

- threshold triggers;
- no duplicate alerts;
- resolution;
- explanation.

## Interoperability

- mock FHIR/API responses;
- source mapping;
- provenance;
- invalid payload rejection.

## Ayanda

- grounded answers;
- permission denial;
- confirmation gates;
- prompt-injection resistance;
- no direct database action;
- one TTS pipeline;
- language propagation;
- cancel stale output.

## UI

- login;
- role navigation;
- OneRecord;
- Professional Workspace;
- Command Centre hierarchy;
- Emergency Access;
- Consent/Identity;
- Appointments;
- Facilities;
- Transfers;
- Notifications;
- Population Health;
- mobile/tablet responsiveness.

Never claim penetration testing, clinical validation, production certification or interoperability certification unless actually completed.

---

# 28. OBSERVABILITY & OPERATIONS

Implement/target:

- structured logs;
- correlation IDs;
- request latency;
- API error rate;
- AI latency;
- tool-action latency;
- integration-adapter latency/errors;
- DB health;
- audit outcome;
- security events;
- health endpoint;
- deploy version/commit visibility;
- no full patient object logs by default.

The live application should expose its release/version/commit in an admin or health endpoint so the team can verify that Render is running the intended GitHub commit.

---

# 29. DEPLOYMENT TRUTH & RELEASE CONTROL

The repository is the source of truth.

Deployment requirements:

- Render or approved target builds from `main`;
- verify the deployed commit SHA;
- do not assume auto-deploy succeeded;
- smoke test login, Command Centre, patient record, referral, appointments, Ayanda and facility pages after deployment;
- record release notes;
- provide rollback path;
- do not claim a new feature is live until the deployed release actually contains it.

Longer-term Azure-aligned target may include Entra ID, Azure Database for PostgreSQL, Key Vault, Azure OpenAI/approved LLM, Azure AI Speech where adequate, Monitor/Application Insights, Storage, API Management, private networking and suitable FHIR services. Do not claim Azure deployment unless actually performed.

---

# 30. DOCUMENTATION REQUIREMENTS

Maintain:

- README / quick start;
- architecture;
- OneRecord/federated-record design;
- MPI/identity design;
- data model;
- database migrations;
- interoperability/FHIR mappings;
- consent model;
- Break Glass design;
- RBAC/ABAC;
- security;
- POPIA/privacy;
- data residency;
- governance;
- Responsible AI;
- model monitoring/evaluation;
- provenance;
- professional workspace/tasks;
- CarePath Watch rules;
- Ayanda tools;
- voice architecture;
- languages/fallbacks;
- patient portal;
- population-health rules;
- deployment;
- environment variables;
- seed/reset;
- demo guide;
- demo accounts;
- release notes;
- known limitations;
- integration seams.

Documentation must distinguish implemented reality from future architecture.

---

# 31. PROTOTYPE CLAIMS BOUNDARY

The hackathon build must clearly state where appropriate:

- synthetic data is used;
- synthetic capacity and ambulance availability are not live feeds;
- this is a prototype;
- no live national/public/private integration is claimed unless implemented;
- no government endorsement is claimed;
- no clinical validation is claimed;
- no SAHPRA approval is claimed;
- no autonomous diagnosis/treatment is performed;
- interoperability is FHIR-compatible/standards-aware by architecture unless formally tested;
- observed referral outcomes are not risk-adjusted hospital rankings;
- a mobile preview is not a published native app;
- configured AI language/voice support is assistive unless clinically validated.

---

# 32. HACKATHON DEFINITION OF DONE — v0.5

Do not call the target build complete until:

- application starts from documented commands;
- persistent database works or the release is explicitly labelled as still using in-memory fallback;
- at least 120 synthetic patients load;
- all seeded roles authenticate;
- role-specific workspace/navigation works;
- OneRecord shows provenance;
- multiple mock source systems contribute to at least one longitudinal record;
- care plans/documents are visible;
- referral state machine works;
- SLA/exception engine works;
- appointment lifecycle works;
- capacity validation works;
- ambulance transfer workflow works;
- facility province/city filtering and detail views work;
- Notification Centre works;
- medication/vaccine management works;
- Emergency Break Glass demonstrator works and is audited;
- Consent & Identity/MPI demonstrator works;
- Command Centre supports hierarchical scope;
- Population Health module works with aggregate/de-identified demo metrics;
- mock interoperability/FHIR gateway works;
- Health Passport works;
- professional task workspace works;
- Ayanda works across modules;
- at least one governed Ayanda write executes after confirmation;
- duplicate voice is prevented;
- mobile/tablet layout is usable;
- no text overlap/overflow exists;
- no secrets are committed;
- CI passes;
- deployed commit is verified;
- live smoke tests pass;
- demo reset works;
- README reflects reality;
- one-patient end-to-end demo succeeds;
- no unsupported clinical/integration/deployment claims remain.

---

# 33. FINAL VALIDATION CHECKLIST

## Functional

- every menu item resolves;
- every visible action works;
- forms validate;
- filters work;
- province/city facility selection works;
- facility detail works;
- OneRecord chronology works;
- provenance works;
- professional work queues work;
- referral journey updates;
- appointments update;
- transfers update;
- notifications update;
- care plans/documents render;
- Break Glass works;
- consent/identity workflow works;
- population filters work;
- demo flow runs end to end.

## Security

- unauthenticated blocked;
- RBAC/ABAC enforced;
- scope guessing blocked;
- MFA/re-auth pattern exists for sensitive actions;
- AI cannot bypass permissions;
- sensitive actions require confirmation;
- Break Glass explicit/time-limited/audited;
- consent/access scope respected;
- secrets absent;
- logs minimise patient data;
- audit trail attributable.

## Voice/AI

- one assistant;
- one TTS pipeline;
- no stale duplicate playback;
- selected language propagated where supported;
- fallback transparent;
- grounded answers distinguished from suggestions;
- tool actions validated;
- prompt injection cannot redefine authority.

## UX

- desktop/laptop/tablet/mobile checked;
- no overlap;
- no card overflow;
- no diagram lines through nodes;
- images aligned;
- consistent professional layout;
- accessible focus/labels;
- loading/error/empty/permission states present.

## Claims

- no fake live data;
- no fake approval;
- no fake clinical validation;
- no fake integration;
- no fake production deployment;
- no raw outcome ranking presented as hospital quality.

---

# 34. ENGINEERING DELIVERY RULES

1. Build working product features, not decorative placeholders.
2. Preserve compatible stable functionality.
3. Fix root causes.
4. Keep one coherent architecture.
5. Store everything in GitHub.
6. Commit meaningful incremental changes.
7. Do not commit secrets.
8. Keep demo state deterministic/resettable.
9. Use synthetic data unless authorised real data is explicitly connected.
10. Make material reads/actions attributable where required.
11. Preserve provenance.
12. Keep human accountability explicit.
13. Optimise latency without weakening governance.
14. Validate every write server-side.
15. Test before declaring complete.
16. Document limitations precisely.
17. Maintain a clean path from hackathon prototype to enterprise architecture.
18. Use approved Pyrneo/CarePath branding only.
19. Never silently reconcile conflicting clinical records using AI.
20. Never equate raw outcome percentages with hospital quality.
21. Never deploy an unverified commit and call it current.
22. Never make the AI the clinical authority.

---

# 35. SUCCESS CRITERION

A judge should understand within minutes that CarePath AI is not merely a chatbot, not merely a dashboard, not merely a referral tracker and not another isolated EMR.

It is a governed federated digital-health operating layer in which:

- one patient can have one coherent longitudinal view;
- source systems remain authoritative where appropriate;
- provenance remains visible;
- identity can be resolved across systems;
- emergency access is explicit and audited;
- consent/access context is governed;
- clinicians have role-specific workspaces;
- referrals move through accountable closed-loop states;
- appointments, capacity and ambulance transfers are coordinated;
- exceptions and SLA breaches are visible early;
- patients receive an appropriate portal/Health Passport experience;
- national/provincial/district/facility oversight is possible through appropriately aggregated data;
- mock standards-based integration proves that CarePath can connect rather than replace systems;
- Ayanda retrieves, explains, navigates and executes only permitted governed actions;
- multilingual voice reduces friction;
- clinical judgement remains with authorised healthcare professionals;
- the patient remains digitally visible throughout the healthcare journey.

Apply this final question to every feature:

> **Does this help the right authorised person access the right patient information, coordinate the next care action, preserve provenance and accountability, and keep the patient journey intact across institutions?**

If the answer is no, simplify it, redesign it or remove it.
