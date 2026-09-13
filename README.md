# CarePath AI by Pyrneo

**One Patient. One Journey. One Trusted Health Record.**

**From Referral to Care — Without Losing the Patient in Between.**

CarePath AI is a Pyrneo-branded hackathon prototype for longitudinal health records, public/private interoperability, referral orchestration, appointment management, synthetic hospital capacity, patient navigation, multilingual AI assistance and accountable digital-health workflows.

> **Clinical safety boundary:** CarePath coordinates care and authorised information access. It does not autonomously diagnose, prescribe, override clinicians or replace clinical judgement.

## Live hackathon demonstrator

**https://carepath-ai-xdad.onrender.com**

The application uses synthetic demonstration data only. Render redeploys from the repository `main` branch.

## Working v0.3.0 scope

The repository includes:

- CarePath Command Centre
- 60 synthetic patients for richer demonstrations
- CarePath OneRecord longitudinal patient view with provenance
- CarePath Exchange public/private facility and service directory
- CarePath Journey referral workflow and server-side state machine
- referral outcome follow-through: recovered, improved, ongoing, deceased and unknown
- observed hospital referral-outcome analytics with an explicit non-ranking/risk-adjustment warning
- appointment management and booking
- appointment lifecycle: requested, booked, checked-in, completed, cancelled and no-show
- referral-to-appointment booking
- synthetic hospital bed inventory by bed type
- capacity-aware referral and appointment validation
- alternative-facility suggestions when admission-required bookings have no synthetic bed capacity
- Care Gaps including referral delay, follow-up, data completeness and capacity constraints
- CarePath Health Passport with appointments and one-time synthetic share code
- Ayanda text and browser voice assistant, including appointment and capacity navigation
- an Ayanda exit/close button and conversation reset control
- explicit confirmation before AI-assisted referral writes
- clickable CarePath/Pyrneo header branding that returns users to the homepage
- expanded role-based access
- administrator-only OpenAI API settings and connection test
- source, AI, authentication and workflow auditing
- responsive desktop, tablet and mobile UX
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

All patient, facility, appointment, bed-capacity, clinical and outcome records are synthetic demonstration data.

## Flagship demo

1. Sign in as `clinician`.
2. Open Ayanda and ask: **“Hey Ayanda, open Thandi Mokoena.”**
3. Review Thandi's synthetic longitudinal record and provenance.
4. Ask: **“Show hospital bed capacity.”**
5. Review staffed, occupied, reserved and available synthetic beds by hospital and bed type.
6. Ask Ayanda to create a referral draft; CarePath checks destination capacity when the service requires a bed.
7. Sign in as `specialist` or `coordinator`, accept an appropriate referral and open **Appointments**.
8. Book the referral appointment. Admission-required bookings re-check bed capacity at booking time.
9. Use the appointment workflow to check in and complete the visit.
10. Open **Referral Outcomes** to show referred volume, recovered/improved, ongoing and deceased synthetic outcomes by destination hospital.
11. Explain that the observed outcome percentages are **not** risk-adjusted hospital rankings.
12. Sign in as `patient` to demonstrate the Health Passport and own appointments.
13. Sign in as `admin` to demonstrate administrator-only OpenAI API settings.
14. Sign in as `auditor` to show attributable audit events.

## Capacity model

The hackathon build models bed capacity as:

`available = staffed beds - occupied beds - reserved beds`

Admission-required referral and appointment workflows check the appropriate synthetic bed type. If no bed is available, CarePath blocks that booking and can return synthetic alternative facilities with compatible services and available capacity.

This is a **demonstration pattern**, not a live hospital bed-management feed.

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

## Prototype limitations

This release does **not** claim live NDoH, private hospital, laboratory, pharmacy, HPRS, EMR, HIE, scheduling, bed-management or FHIR endpoint integration. It does not claim clinical validation, NDoH approval, SAHPRA approval or production deployment. Formal interoperability certification has not been completed. The repository uses in-memory synthetic data; persistent production databases, enterprise identity, live interoperability adapters, validated real-time capacity feeds and production-grade scheduling integrations remain future implementation phases.
