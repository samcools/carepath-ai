# CarePath AI v0.3 — Appointment, Booking & Capacity Addendum

This addendum extends `docs/prompts/CAREPATH-MASTER-PROMPT.md` and is mandatory for all subsequent CarePath builds unless superseded by a later approved specification.

## 1. Appointment management

CarePath must provide an authorised appointment-management capability linked to the longitudinal patient record and, where applicable, to a referral.

Minimum workflow:

`REQUESTED → BOOKED → CHECKED_IN → COMPLETED`

Supported exception states:

- `CANCELLED`
- `NO_SHOW`

Requirements:

- book standalone appointments;
- book an appointment from an accepted referral;
- show patient, service, facility, appointment time and duration;
- show appointment status;
- allow authorised role-specific lifecycle actions;
- include appointments in OneRecord and Health Passport context;
- record appointment actions in the audit trail;
- prevent unauthorised roles from clinically progressing appointments;
- preserve patient ability to see their own appointments and cancel where policy permits;
- future implementation should add enterprise calendar/scheduling adapters rather than claiming live integration before it exists.

## 2. Hospital capacity and bed awareness

CarePath must support a capacity-aware referral pattern.

For the hackathon demonstrator, capacity is synthetic and must always be labelled as such.

Capacity model:

`available beds = staffed beds - occupied beds - reserved beds`

Supported bed types should include at minimum:

- general;
- high care;
- ICU;
- maternity;
- paediatric.

Requirements:

- show staffed, occupied, reserved and available beds;
- show when a hospital is constrained or full;
- associate admission-required referrals with a bed type;
- validate destination capacity when creating an admission-required referral;
- revalidate capacity when the appointment/admission is booked;
- prevent a booking when the required synthetic bed type has no availability;
- return compatible alternative facilities when appropriate;
- reserve capacity when an admission appointment is booked;
- convert reserved capacity to occupied capacity at check-in;
- release capacity on cancellation or completed discharge workflow;
- surface capacity constraints in Care Gaps;
- do not claim real-time bed availability until an authorised live source has actually been integrated.

## 3. Referral outcomes and capacity must remain distinct

CarePath may show observed synthetic referral outcomes alongside operational capacity, but must never equate raw mortality/recovery percentages or bed availability with hospital quality.

A production hospital-comparison capability requires validated definitions, minimum sample sizes, risk/case-mix adjustment, confidence intervals, clinical governance and appropriate regulatory/privacy review.

## 4. Role-aware access

The appointment/capacity layer must follow server-side role enforcement.

Illustrative demo access:

- clinician: create referrals, book appointments for authorised patients, view capacity;
- specialist: receive referrals, manage appointments, record outcomes, view capacity;
- nurse: check in/complete appropriate appointment workflow and view receiving-facility capacity;
- coordinator: schedule and manage referral-linked appointments, view capacity;
- patient navigator: support booking and follow-up;
- manager: cross-facility operational and capacity visibility;
- auditor: read-only audit/provenance;
- administrator: full demo administration including OpenAI settings;
- patient: own OneRecord, referrals, appointments and Health Passport only.

## 5. Ayanda

Ayanda must understand appointment and capacity intents, including requests such as:

- “Open appointments.”
- “Show hospital bed capacity.”
- “Which hospitals have beds available?”
- “Show my appointments.”

Ayanda must not diagnose, prescribe, rank hospitals clinically, or invent live capacity. AI-assisted write actions remain governed and require human confirmation where specified.

## 6. Definition of done

This addendum is complete only when:

- appointment UI and APIs are working;
- referral-linked booking is working;
- role restrictions are enforced server-side;
- capacity is visible by hospital and bed type;
- admission-required booking checks capacity;
- no-capacity scenarios fail safely and return alternatives when available;
- appointment and capacity actions are auditable;
- responsive UI works across desktop, tablet and mobile;
- CI typecheck, tests and production build pass;
- all demo capacity is explicitly marked synthetic.
