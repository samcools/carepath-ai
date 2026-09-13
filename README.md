# CarePath AI by Pyrneo

**One Patient. One Journey. One Trusted Health Record.**

**From Referral to Care — Without Losing the Patient in Between.**

CarePath AI is a Pyrneo-branded SITA Hackathon demonstrator for a **federated longitudinal health record and accountable patient journey across public and private healthcare**. It preserves source-system provenance and demonstrates how identity, standards-aware exchange, referrals, appointments, capacity, patient transfer, care coordination and governed AI can operate together without claiming to replace every healthcare source system.

> **Clinical safety boundary:** CarePath coordinates authorised information access and care workflow. It does not autonomously diagnose, prescribe, initiate treatment, override clinicians or replace clinical judgement.

## Live demonstrator

**https://carepath-ai-xdad.onrender.com**

Render is configured from `main`, but the live service must be checked against the exact repository commit before a release is called deployed. CarePath v0.5 includes `GET /api/v05/release` for runtime version/commit verification.

## CarePath v0.5 — Federated Health Platform

### Operational capabilities preserved from v0.4

- 120 synthetic patients and provenance-aware OneRecord
- Journey/referral state machine and closed-loop workflow
- Appointment Management Centre and referral-linked bookings
- requested, booked, checked-in, completed, cancelled and no-show lifecycle
- synthetic General, High Care, ICU, Maternity and Paediatric bed capacity
- capacity-aware referral/booking validation and alternative facilities
- Ambulance Availability & Patient Transfer Management
- Basic, Advanced, ICU and Neonatal synthetic ambulance capability
- Notification Centre
- Medication & Vaccine Management
- Care Gaps and Referral Outcome analytics
- national synthetic facility/service directory across all nine provinces
- province/city/type/service filtering and clickable full facility operational views
- Health Passport and Mobile App Preview
- multiple demo roles with server-side access controls
- Ayanda text/browser voice assistant with governed write confirmation
- administrator-only OpenAI API settings
- workflow/access/AI audit trail
- responsive desktop/tablet/mobile UX

### New v0.5 platform capabilities

#### Emergency Patient Access / Break Glass

- explicit emergency reason
- clinical-role restriction
- demo password re-authentication
- 15-minute synthetic access grant
- minimum-necessary allergy/medication/condition/encounter summary
- audited access history and compliance-review path

Production requires enterprise MFA/re-authentication, policy enforcement and monitoring.

#### Consent & Identity Centre

- MPI/federated identity abstraction
- multiple linked mock source-system identifiers
- no competing national identifier invented by CarePath
- consent/sharing-preference model
- source provenance and identity-linkage warning

Production requires an approved authoritative identity service and governed duplicate/merge/unmerge workflows.

#### Healthcare Professional Workspace

- authorised patient workload
- open referrals and appointments
- role/facility-aware tasks
- high-priority action queue
- hand-offs and result-review context
- task creation/status APIs

#### OneRecord extensions

- care plans
- discharge/specialist/care-document metadata
- imaging-report metadata
- provenance/source linkage
- federated identifier visibility

Raw imaging is not duplicated into the hackathon record; the architecture favours source references/metadata.

#### CarePath Watch™

Explainable operational rules identify:

- referral SLA delay
- missing return feedback
- missed appointments
- zero synthetic bed capacity
- critical ICU capacity constraints

Each finding shows the rule, evidence, owner and permitted next administrative action. **CarePath Watch is not a diagnostic or unvalidated clinical prediction engine.**

#### Hierarchical CarePath Command Centre

The management experience now demonstrates:

**South Africa → Province → District → City → Facility → Service**

It uses the same synthetic patient-flow, referral, facility/service and bed-capacity data rather than creating a parallel dashboard. Management views are intended to remain aggregated/de-identified unless patient-level access has a separate authorised purpose.

#### Population Health Intelligence

- aggregated/de-identified synthetic operational intelligence
- province-level activity
- service demand
- open-referral burden
- missed appointments
- synthetic observed referral outcomes

Observed recovery/mortality is not risk adjusted and must not be represented as a hospital-quality ranking.

#### CarePath Exchange / FHIR demonstration gateway

The v0.5 API includes:

- `GET /api/v05/fhir/metadata`
- `GET /api/v05/fhir/Patient/:id`
- `GET /api/v05/fhir/ServiceRequest/:id`
- `GET /api/v05/fhir/Appointment/:id`
- `GET /api/v05/exchange/sources`

Mock adapters represent a clinic EMR, laboratory, pharmacy and specialist/hospital source.

**Source systems → CarePath Exchange → provenance-preserving OneRecord + Journey**

This is a FHIR R4-style hackathon facade, not formal conformance certification or a live health-system integration claim.

#### Ayanda v0.5

Ayanda recognises deterministic navigation for:

- My Workspace
- Emergency / Break Glass
- Consent & Identity
- CarePath Watch
- National Command
- Population Health
- CarePath Exchange / FHIR

The browser bridge preserves the original Ayanda conversation while opening the appropriate governed v0.5 module.

## Target PostgreSQL architecture

`apps/api/prisma/schema.prisma` defines the target persistent model for Patient, PatientIdentifier, ConsentRecord, BreakGlassEvent, CarePlan, ClinicalDocument, CareTask, IntegrationEvent, AccessEvent and AuditEvent.

**Runtime truth:** the hackathon application is still deterministic/in-memory and adapter-backed. PostgreSQL is not yet the runtime repository. Do not claim persistent production storage until a database is provisioned, migrations run and the service repositories are switched.

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

## Flagship v0.5 demonstration

1. Sign in as `clinician`.
2. Say **“Hey Ayanda, open Thandi Mokoena.”**
3. Show synthetic allergy, medication, history and source provenance.
4. Show Care Plans/Documents within the extended OneRecord.
5. Ask Ayanda to open **Consent & Identity** and show linked source identifiers.
6. Create/review Thandi's cardiology referral and destination.
7. Check synthetic service/bed capacity and coordinate the appointment.
8. Demonstrate ambulance transfer where needed.
9. Open **CarePath Watch** to show an explainable pathway exception.
10. Demonstrate **Emergency / Break Glass** with reason + demo re-authentication.
11. Switch to `manager`; open **National Command** and drill South Africa → Province → District → City → Facility → Service.
12. Open **Population Health Intelligence** and explain de-identification.
13. Open **CarePath Exchange** to show the mock source-system/FHIR flow.
14. Switch to `patient` and show Health Passport, appointments, medication/vaccination, notifications and journey status.
15. Close with: **“The patient remains digitally visible throughout the healthcare journey.”**

Detailed demo guide: `docs/demo/V0.5-FLAGSHIP-DEMO.md`

## Architecture and implementation status

- Canonical specification: `docs/prompts/CAREPATH-MASTER-PROMPT.md`
- Federated architecture: `docs/architecture/V0.5-FEDERATED-ARCHITECTURE.md`
- Release status: `docs/release/V0.5-IMPLEMENTATION-STATUS.md`

## Prototype and claims boundary

All patient, facility, bed, ambulance, medication, vaccination, clinical, referral and outcome information is synthetic.

CarePath v0.5 does **not** claim:

- live NDoH/HPRS/HIE integration
- live public/private hospital integration
- live laboratory/pharmacy/imaging integration
- live MPI/identity service
- live bed-management or EMS/CAD/GPS feeds
- production PostgreSQL persistence
- enterprise MFA/SSO deployment
- formal FHIR/national-profile conformance certification
- clinical validation
- NDoH endorsement
- SAHPRA approval
- production clinical use

The product demonstrates the architecture, governed workflows and user experience needed to evolve toward those capabilities without presenting them as already completed.
