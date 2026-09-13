# CarePath AI

**From Referral to Care — Without Losing the Patient in Between.**

CarePath AI is a Pyrneo-branded, AI-enabled public healthcare referral, patient-navigation and care-coordination platform for South Africa. It is designed to help authorised healthcare teams create, route, accept, track and close referrals while maintaining a complete patient-journey timeline, operational visibility and auditable accountability.

> **Clinical safety boundary:** CarePath AI coordinates care. It does **not** autonomously diagnose patients, prescribe treatment, override clinicians, or make unsupervised clinical-risk decisions.

## Hackathon objective

Demonstrate how AI, workflow automation, interoperable health-data concepts, multilingual voice interaction and accountable governance can reduce referral leakage and improve continuity of care across facilities.

## Core capabilities

- Referral Command Centre
- Digital Referral Workspace
- Facility & Service Directory
- Patient Journey Timeline
- Referral Leakage / Exception Detection
- Appointment and follow-up coordination
- Multilingual Ayanda text + voice assistant
- Operational analytics
- Human approval for consequential actions
- Role-based access control (RBAC)
- Immutable-style audit event history
- POPIA-aligned privacy and data-minimisation controls
- FHIR-compatible interoperability architecture
- Responsive desktop, tablet and mobile UX

## Repository status

This repository is the canonical source of truth for CarePath AI. Product requirements, architecture, governance, demo flows and implementation instructions are maintained in `/docs` and `MASTER_BUILD_PROMPT.md`.

## Initial documentation

- [`MASTER_BUILD_PROMPT.md`](MASTER_BUILD_PROMPT.md)
- [`docs/PRODUCT_REQUIREMENTS.md`](docs/PRODUCT_REQUIREMENTS.md)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md)
- [`docs/SECURITY_GOVERNANCE.md`](docs/SECURITY_GOVERNANCE.md)
- [`docs/DEMO_SCENARIO.md`](docs/DEMO_SCENARIO.md)
- [`docs/IMPLEMENTATION_ROADMAP.md`](docs/IMPLEMENTATION_ROADMAP.md)

## Design principles

1. **Patient-centred:** minimise hand-off failures and make referral status visible.
2. **Human-accountable AI:** AI recommends, explains and assists; authorised humans approve consequential actions.
3. **Privacy by design:** collect, expose and retain only the information required for the stated purpose.
4. **Interoperable by design:** favour standards-aligned APIs and FHIR-compatible resource mappings.
5. **Explainable operations:** every referral state change should be traceable to actor, time, reason and source.
6. **Low-latency interaction:** Ayanda should respond quickly and execute permitted commands with visible confirmation.
7. **Africa-aware accessibility:** multilingual interaction, mobile responsiveness, bandwidth-conscious UX and operational realities of public healthcare facilities.

## Policy context

The South African National Department of Health referral policy identifies gaps in timely referral and patient movement between levels and types of care. In January 2026 the Department of Health, CSIR and IHE Catalyst also convened a Digital Health Interoperability Projectathon focused on secure information exchange, patient-data flow and portable services. CarePath AI is designed to align with that direction while remaining a hackathon prototype unless and until formally validated, integrated and approved for production use.

## Prototype disclaimer

All demonstration patient records must be synthetic. The prototype must not be represented as clinically validated, production deployed, NDoH approved, SAHPRA approved, or integrated with a live health-information system unless such validation, approval or integration has actually occurred.
