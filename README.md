# CarePath AI by Pyrneo

**One Patient. One Journey. One Trusted Health Record.**

**From Referral to Care — Without Losing the Patient in Between.**

CarePath AI is a Pyrneo-branded SITA Hackathon demonstrator for a **federated longitudinal health record and accountable patient journey across public and private healthcare**. It preserves source-system provenance and demonstrates how identity, standards-aware exchange, referrals, appointments, capacity, transfers, notifications, care coordination and governed AI can work together without claiming to replace every hospital system.

> **Clinical safety boundary:** CarePath coordinates authorised information access and care workflow. It does not autonomously diagnose, prescribe, initiate treatment, override clinicians, or replace clinical judgement.

## Live demonstrator

**https://carepath-ai-xdad.onrender.com**

The repository `main` branch is configured for automatic Render deployment. **Do not assume the live URL is running the newest source commit until the deployment commit is verified.** CarePath v0.5 exposes `/api/v05/release` so the deployed version and runtime commit can be checked explicitly.

## CarePath v0.5 — Federated Health Platform

The v0.5 source retains the complete v0.4 operational demonstrator and adds the previously missing platform layers.

### Existing operational capabilities preserved

- 120 synthetic patients
- OneRecord longitudinal patient view with provenance
- Journey/referral state machine and closed-loop workflow
- Appointment Management Centre
- standalone and referral-linked bookings
- requested, booked, checked-in, completed, cancelled and no-show appointment lifecycle
- synthetic hospital bed capacity: General, High Care, ICU, Maternity and Paediatric
- capacity-aware referral and appointment validation
- alternative-facility suggestions when admission-dependent bookings lack synthetic capacity
- Ambulance Availability & Patient Transfer Management
- Basic, Advanced, ICU and Neonatal synthetic ambulance capability
- patient-transfer lifecycle and referral/capacity linkage
- Notification Centre
- Medication & Vaccine Management
- Care Gaps
- Referral Outcome analytics with explicit non-ranking/risk-adjustment warning
- national synthetic facility directory covering all nine provinces
- province/city/type/service facility filtering and clickable facility operational views
- Health Passport
- patient and clinician Mobile App Preview
- multiple demo roles and in-app user-type switcher
- responsive desktop/tablet/mobile experience
- Ayanda text/browser voice assistant with governed write confirmation
- administrator-only OpenAI API settings
- access/workflow/AI audit trail

### New v0.5 capabilities

#### Emergency Patient Access / Break Glass

- role-controlled emergency-access module
- explicit emergency reason capture
- demo password re-authentication before granting access
- 15-minute synthetic access grant
- minimum-necessary emergency summary covering documented allergies, current medication, chronic conditions and recent encounter context
- high-visibility audit event and access history
- no silent security bypass

Production use requires enterprise MFA/re-authentication, ABAC/purpose enforcement, monitoring and compliance review.

#### Consent & Identity Centre

- federated patient-identity/MPI abstraction
- multiple source-system identifiers per patient
- source linkage rather than creation of a competing national patient identifier
- consent/sharing-preference records
- patient/admin preference update path
- explicit warning that production matching requires an approved authoritative identity service and governed merge/unmerge

#### Healthcare Professional Workspace

- authorised patient worklist
- open referral workload
- appointment workload
- role/facility-aware tasks
- high-priority action queue
- hand-off queue
- source-grounded result-review context
- task creation and governed task-state changes

#### OneRecord extensions

- care-plan records
- synthetic discharge/specialist/care-document metadata
- synthetic imaging-report metadata
- source/provenance presentation
- federated source-identifier count

The prototype does not duplicate raw DICOM imaging into OneRecord; source references/metadata are the preferred architectural pattern.

#### CarePath Watch™

Explainable operational early-warning rules for:

- referral SLA delay
- return-feedback delay
- missed appointments
- zero synthetic bed availability
- high-severity ICU capacity constraints

Each finding provides the triggering rule, evidence, owner and recommended permitted administrative action. **CarePath Watch findings are workflow/pathway signals, not diagnoses or unvalidated clinical predictions.**

#### Hierarchical CarePath Command Centre

A new management view supports the target hierarchy:

**South Africa → Province → District → Facility**

It surfaces aggregated synthetic patient/referral flow, open referrals, appointments, bed availability and SLA exceptions. Further city/service drill-down remains a target refinement; the facility explorer already supports province and city filtering.

#### Population Health Intelligence

- aggregated/de-identified synthetic operational intelligence
- provincial operations
- service demand
- open-referral burden
- missed-appointment indicators
- synthetic referral outcome totals
- explicit prohibition on treating raw observed recovery/mortality as hospital-quality ranking

#### CarePath Exchange / FHIR demonstration gateway

The v0.5 API exposes a synthetic standards-aware demonstration layer:

- `GET /api/v05/fhir/metadata`
- `GET /api/v05/fhir/Patient/:id`
- `GET /api/v05/fhir/ServiceRequest/:id`
- `GET /api/v05/fhir/Appointment/:id`
- `GET /api/v05/exchange/sources`

Mock source adapters represent:

- clinic EMR
- laboratory
- pharmacy
- specialist/hospital system

The intended flow is:

**Source systems → CarePath Exchange → provenance-preserving OneRecord + Journey**

This is a **FHIR R4-style hackathon facade**, not a claim of formal national-profile conformance, certification or live health-system connectivity.

#### Ayanda v0.5

Ayanda now recognises deterministic navigation intents for:

- My Workspace
- Emergency / Break Glass
- Consent & Identity
- CarePath Watch
- hierarchical National Command Centre
- Population Health Intelligence
- CarePath Exchange / FHIR

A browser bridge routes those intents into the new v0.5 modules while preserving the existing Ayanda chat response and v0.4 navigation behaviour.

## Target persistence architecture

A PostgreSQL/Prisma target schema now exists at:

`apps/api/prisma/schema.prisma`

It includes target entities for:

- Patient
- PatientIdentifier
- ConsentRecord
- BreakGlassEvent
- CarePlan
- ClinicalDocument
- CareTask
- IntegrationEvent
- AccessEvent
- AuditEvent

**This schema is not yet wired as the runtime repository.** The current hackathon build remains deterministic in-memory/adaptor-backed. Do not represent PostgreSQL persistence as implemented until a database is provisioned, migrations are executed and the service repositories are switched to it.

## Demo accounts

Password for all seeded demo accounts: `CarePath!2026`

| Username | Role |
|---|---|
| `clinician` | Referring clinician |
| `specialist` | Specialist |
| `nurse` | Nurse |
| `coordinator` | Care coordinator |
| `navigator` | Patient navigator |
| `pharmacist` | Pharmacist |
| `labtech` | Lab technologist |
| `manager` | District manager |
| `auditor` | Audit/compliance |
| `admin` | Administrator |
| `patient` | Patient — Thandi Mokoena |

## Recommended v0.5 flagship demo

1. Sign in as `clinician`.
2. Ask Ayanda: **“Hey Ayanda, open Thandi Mokoena.”**
3. Show Thandi’s synthetic longitudinal OneRecord, allergy, medication and provenance.
4. Show the new care-plan/document extensions.
5. Ask Ayanda: **“Open Consent and Identity.”** Show the federated source identifiers.
6. Return to Journey and create/review the cardiology referral.
7. Check destination facility/service and synthetic bed capacity.
8. Coordinate the appointment.
9. If transfer is required, show ambulance availability and patient-transfer orchestration.
10. Ask Ayanda: **“Open CarePath Watch.”** Show explainable pathway exceptions.
11. Switch to a management role and ask: **“Open National Command.”** Drill into a province.
12. Open Population Health Intelligence and explain that management views are aggregate/de-identified.
13. Open CarePath Exchange and show the mock source-system → FHIR-style gateway → OneRecord architecture.
14. For an emergency demonstration, use **Emergency** / Break Glass with a specific reason and demo re-authentication; show the minimum-necessary emergency summary and audit event.
15. Switch to the patient role to show Health Passport, appointments, medication/vaccination, notifications and journey visibility.
16. Close with: **“The patient remains digitally visible throughout the healthcare journey.”**

## Canonical specification

The current single source of truth is:

`docs/prompts/CAREPATH-MASTER-PROMPT.md`

The canonical prompt is **v0.5 — Federated Health Platform & Hackathon Delivery Prompt** and supersedes conflicting implementation guidance in earlier addenda while preserving compatible completed functionality.

## Prototype and claims boundary

All patient, facility, bed, ambulance, medication, vaccination, clinical, referral and outcome information is synthetic demonstration data.

This release does **not** claim:

- live NDoH/HPRS integration
- live private hospital integration
- live laboratory/pharmacy/imaging connectivity
- live HIE/EMR integration
- live national MPI/identity service
- live bed-management or EMS/CAD/GPS feeds
- production PostgreSQL persistence
- enterprise MFA/SSO deployment
- formal FHIR/national-profile conformance certification
- clinical validation
- NDoH endorsement
- SAHPRA approval
- production clinical use

CarePath v0.5 demonstrates the **architecture, governed workflows and product experience** required to evolve toward those integrations without falsely representing them as complete.
