# CarePath AI by Pyrneo

**One Patient. One Journey. One Trusted Health Record.**

**From Referral to Care — Without Losing the Patient in Between.**

CarePath AI is a Pyrneo-branded hackathon prototype for longitudinal health records, public/private interoperability, referral orchestration, appointment management, synthetic hospital capacity, ambulance availability and patient transfer, medication/vaccine management, notifications, patient navigation, multilingual AI assistance and accountable digital-health workflows.

> **Clinical safety boundary:** CarePath coordinates care and authorised information access. It does not autonomously diagnose, prescribe, override clinicians or replace clinical judgement.

## Live hackathon demonstrator

**https://carepath-ai-xdad.onrender.com**

The application uses synthetic demonstration data only. Render redeploys from the repository `main` branch.

## Working v0.4.0 scope

The repository includes:

- CarePath Command Centre
- **120 synthetic patients** for richer demonstrations
- CarePath OneRecord longitudinal patient view with provenance
- CarePath Exchange public/private facility and service directory
- CarePath Journey referral workflow and server-side state machine
- referral outcome follow-through: recovered, improved, ongoing, deceased and unknown
- observed hospital referral-outcome analytics with an explicit non-ranking/risk-adjustment warning
- **Appointment Management Centre**
- standalone and referral-linked bookings
- appointment lifecycle: requested, booked, checked-in, completed, cancelled and no-show
- synthetic hospital bed inventory by bed type
- bed types including General, High Care, ICU, Maternity and Paediatric in the architecture
- capacity-aware referral and appointment validation
- alternative-facility suggestions when admission-required bookings have no synthetic bed capacity
- **Ambulance Availability & Patient Transfer Management Centre**
- synthetic ambulance fleet with Basic, Advanced, ICU and Neonatal transfer capability
- transfer workflow: requested, assigned, en route, patient onboard, arrived, completed and cancelled
- automatic matching to a compatible synthetic ambulance when available
- patient transfer linkage to referral destination and bed availability
- transfer blocking when a bed-dependent referral destination has no required synthetic bed capacity
- **Notification Centre** covering referral, appointment, capacity, medication, vaccination and transfer alerts
- unread counts, filtering and mark-read controls
- **Medication & Vaccine Management Centre** with role-aware therapy and immunisation records
- medication reconciliation/status controls for authorised roles
- vaccination records, next-due dates and overdue/due indicators
- Care Gaps including referral delay, follow-up, data completeness, vaccination follow-up, capacity constraints and transfer delay
- CarePath Health Passport with appointments, vaccination and transfer context plus one-time synthetic share code
- **Mobile App Preview** demonstrating patient and clinician mobile interaction patterns
- responsive web UX for desktop, tablet and mobile
- login user-type dropdown plus in-app demo user-type switcher
- Ayanda text and browser voice assistant with navigation for appointments, notifications, medication/vaccines, bed capacity, ambulance availability, transfers, mobile preview and referral outcomes
- Ayanda exit/close button and conversation reset control
- explicit confirmation before AI-assisted referral writes
- clickable CarePath/Pyrneo header branding that returns users to the homepage
- expanded role-based access across clinician, specialist, nurse, coordinator, navigator, pharmacist, lab technologist, manager, auditor, administrator and patient roles
- administrator-only OpenAI API settings and connection test
- source, AI, authentication and workflow auditing
- GitHub Actions CI and Render deployment scaffold

## Demo accounts

Password for all demo accounts: `CarePath!2026`

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

All patient, facility, appointment, bed-capacity, ambulance, medication, vaccination, clinical and outcome records are synthetic demonstration data.

## Flagship v0.4 demo

1. Sign in as `clinician` and use the in-app **User type** dropdown to explain role-based access.
2. Open **Patients** to show the expanded synthetic longitudinal-record population.
3. Ask Ayanda: **“Hey Ayanda, open Thandi Mokoena.”**
4. Review the OneRecord view, medication, vaccination context and provenance.
5. Open the **Appointment Management Centre** and demonstrate booking and lifecycle controls.
6. Ask Ayanda: **“Show hospital bed capacity.”**
7. Review staffed, occupied, reserved and available synthetic beds by hospital and bed type.
8. Open **Ambulance & Transfers** and ask: **“Which ambulances are available?”**
9. Demonstrate the synthetic fleet, ambulance type/capability, ETA and active transfer state.
10. Create a patient transfer linked to a referral. CarePath checks the referral destination and blocks a bed-dependent transfer when the required synthetic bed is unavailable.
11. Demonstrate the patient-transfer lifecycle from assignment through arrival/completion.
12. Open **Notifications** to show referral, appointment, capacity, medication, vaccine and transfer alerts.
13. Open **Medication & Vaccines** to demonstrate role-aware reconciliation and vaccination records.
14. Open **Referral Outcomes** to show referred volume, recovered/improved, ongoing and deceased synthetic outcomes by destination hospital; explain that these are not risk-adjusted quality rankings.
15. Open **Mobile App** to demonstrate the patient and clinician phone experience.
16. Switch to `patient` to demonstrate the Health Passport, own bookings, medication/vaccines, notifications and transfer status.
17. Switch to `admin` to demonstrate administrator-only OpenAI API settings.
18. Switch to `auditor` to show attributable audit events.

## Capacity model

The hackathon build models bed capacity as:

`available = staffed beds - occupied beds - reserved beds`

Admission-required referral and appointment workflows check the appropriate synthetic bed type. If no bed is available, CarePath blocks that booking and can return synthetic alternative facilities with compatible services and available capacity.

## Ambulance and transfer model

The v0.4 demonstrator models a synthetic ambulance fleet with statuses:

`AVAILABLE | DISPATCHED | MAINTENANCE`

and transfer states:

`REQUESTED → ASSIGNED → EN_ROUTE → PATIENT_ON_BOARD → ARRIVED → COMPLETED`

with `CANCELLED` available where permitted.

Ambulance types include Basic, Advanced, ICU and Neonatal. CarePath can automatically match an available compatible synthetic ambulance, show synthetic ETA, link the transfer to a referral, and check destination bed capacity when the linked referral requires admission.

This is a **demonstration pattern**, not a live EMS dispatch, GPS, CAD or hospital bed-management feed.

## Repository structure

```text
apps/web       React + TypeScript + Vite
apps/api       Express + TypeScript API
assets         branding/demo assets
docs           product, architecture, security, demo and master prompt
.github        CI quality workflow
render.yaml    live-demo deployment scaffold
```

## Canonical specification

The implementation source of truth remains:

`docs/prompts/CAREPATH-MASTER-PROMPT.md`

with mandatory release addenda, including:

- `docs/prompts/CAREPATH-V0.3-APPOINTMENTS-CAPACITY-ADDENDUM.md`
- `docs/prompts/CAREPATH-V0.4-OPERATIONS-MOBILE-AMBULANCE-ADDENDUM.md`

## Prototype limitations

This release does **not** claim live NDoH, private hospital, laboratory, pharmacy, HPRS, EMR, HIE, scheduling, bed-management, EMS/CAD, ambulance GPS, vaccination registry, medication-dispensing or FHIR endpoint integration. It does not claim clinical validation, NDoH approval, SAHPRA approval or production deployment. Formal interoperability certification has not been completed. The repository uses in-memory synthetic data; persistent production databases, enterprise identity, live interoperability adapters, validated real-time capacity/EMS feeds and production-grade scheduling, medication and vaccination integrations remain future implementation phases.
