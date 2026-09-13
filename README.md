# CarePath AI by Pyrneo

**One Patient. One Journey. One Trusted Health Record.**

**From Referral to Care — Without Losing the Patient in Between.**

CarePath AI is a Pyrneo-branded hackathon prototype for longitudinal health records, public/private interoperability, referral orchestration, patient navigation, multilingual AI assistance and accountable digital-health workflows.

> **Clinical safety boundary:** CarePath coordinates care and authorised information access. It does not autonomously diagnose, prescribe, override clinicians or replace clinical judgement.

## Working v0.1.0

The repository now contains a runnable full-stack demonstrator with:

- CarePath Command Centre
- CarePath OneRecord synthetic longitudinal patient view
- source provenance for clinical record elements
- CarePath Exchange synthetic facility/service directory
- CarePath Journey referral workflow and server-side state machine
- stale-referral / leakage detection
- Ayanda text and browser voice assistant
- explicit confirmation before AI-assisted write actions
- facility/role-scoped access checks
- role-aware audit access
- synthetic demo data banner and prototype disclaimers
- responsive desktop, tablet and mobile UX
- GitHub Actions CI
- Render deployment scaffold

## Quick start

Prerequisites: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open:

- Web: `http://localhost:5173`
- API health: `http://localhost:8080/api/health`

## Demo accounts

Password for all demo accounts: `CarePath!2026`

| Username | Role |
|---|---|
| `clinician` | Referring clinician |
| `coordinator` | Receiving coordinator |
| `manager` | District manager |
| `auditor` | Audit/compliance |
| `admin` | Administrator |

All patient, facility and clinical records in this release are synthetic demonstration data.

## Flagship demo

1. Sign in as `clinician`.
2. Open Ayanda.
3. Ask: **“Hey Ayanda, open Thandi Mokoena.”**
4. Review her synthetic longitudinal record, including hypertension, amlodipine, penicillin allergy and provenance.
5. Ask: **“Hey Ayanda, create a referral for Thandi Mokoena to cardiology.”**
6. Confirm the governed action. Ayanda creates a **draft only**.
7. Open Referrals and submit the draft as the authorised clinician.
8. Ask: **“Show referrals waiting more than 24 hours.”**
9. CarePath filters to the stale referral and shows the operational exception.
10. Sign in as `auditor` or `manager` and review the audit trail.

## Repository structure

```text
apps/web       React + TypeScript + Vite
apps/api       Express + TypeScript API
assets         branding/demo assets (extensible)
docs           product, architecture, security, demo and master prompt
.github        CI quality workflow
render.yaml    live-demo deployment scaffold
```

## Canonical specification

The implementation source of truth is:

`docs/prompts/CAREPATH-MASTER-PROMPT.md`

## Prototype limitations

This release does **not** claim live NDoH, private hospital, laboratory, pharmacy, HPRS, EMR, HIE or FHIR endpoint integration. It does not claim clinical validation, NDoH approval, SAHPRA approval or production deployment. Formal interoperability certification has not been completed. The v0.1.0 repository uses deterministic in-memory synthetic data; PostgreSQL and live interoperability adapters remain the next production-oriented implementation phase.
