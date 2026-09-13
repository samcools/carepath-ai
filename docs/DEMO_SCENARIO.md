# CarePath AI — Hackathon Demo Scenario

## 1. Demo objective

Show, in one coherent patient journey, how CarePath AI reduces referral hand-off failures through accountable workflow orchestration, multilingual AI assistance, operational exception detection and human-confirmed actions.

Target demo length: **90 seconds for core wow moment**, expandable to 5 minutes for the full pitch.

## 2. Demo patient

Use synthetic data only.

**Name:** Thandi Mokoena  
**Patient ID:** SYN-CP-0001  
**Preferred language:** isiZulu  
**Referring facility:** Demo Midrand Community Health Centre  
**Required service:** Cardiology consultation  

All facilities and records used in the demo must be labelled as demonstration data unless sourced from an authoritative, approved live registry.

## 3. 90-second demo flow

### Scene 1 — Command Centre
Presenter opens the Referral Command Centre.

Visible cards:
- Open Referrals
- Awaiting Acceptance
- Scheduled
- Overdue
- Missing Information
- Missed Appointments
- Referral Leakage

A red exception indicator shows one stale referral.

### Scene 2 — Voice-led creation
Presenter activates Ayanda and says:

> “Ayanda, create a referral for Thandi Mokoena to an appropriate cardiology service.”

Ayanda:
1. Finds the synthetic patient record.
2. Creates a **draft**, not a submitted referral.
3. Uses configured service-directory rules to show suitable destination options.
4. Explains why each option matched.
5. Asks the clinician to confirm the selected destination.

Presenter confirms.

### Scene 3 — Human-confirmed submission
Ayanda summarises:
- patient
- service requested
- destination
- administrative priority
- missing/complete information

Presenter says:

> “Submit the referral.”

Ayanda asks for confirmation before executing.

The referral moves to `SUBMITTED`, then appears in the receiving coordinator queue.

### Scene 4 — Receiving coordination
Switch role to Receiving Coordinator.

Coordinator opens Thandi’s referral, reviews the information and selects:
- Accept
- Schedule appointment

An appointment is created. A simulated isiZulu patient notification is generated.

### Scene 5 — Referral leakage detection
Presenter asks:

> “Ayanda, show referrals waiting more than 24 hours.”

Ayanda filters the dashboard and opens a second synthetic stale referral.

Ayanda explains:
- it is still awaiting acknowledgement;
- configured threshold has been exceeded;
- no state transition has occurred since submission.

Presenter says:

> “Create a follow-up task for the receiving coordinator.”

Ayanda asks for confirmation, creates the task and records the action.

### Scene 6 — Audit trail
Presenter opens Audit Timeline.

The audience sees:
- referral creation
- destination confirmation
- submission
- acceptance
- scheduling
- notification
- exception detection
- follow-up task creation

Each event shows actor, time and source channel.

### Scene 7 — Executive value
Return to Command Centre.

Dashboard metrics update immediately.

Closing line:

> “CarePath AI does not replace clinical judgement. It makes sure the patient journey does not disappear between facilities.”

## 4. Five-minute expanded flow

If additional time is available, include:
- multilingual language switching;
- mobile/tablet responsive view;
- facility/service directory search;
- role-based access demonstration;
- before/after audit record;
- aggregated district analytics;
- explanation of FHIR-compatible interoperability layer;
- privacy / POPIA controls;
- explicit Responsible AI boundary.

## 5. Judge questions and concise answers

### “Does the AI diagnose patients?”
No. CarePath AI coordinates referral workflows. It does not autonomously diagnose, prescribe or replace clinicians.

### “How do you prevent AI from changing records incorrectly?”
All protected writes are executed by server-side tools with RBAC, scope checks, workflow-state validation and explicit confirmation for consequential actions. Model output is never treated as authority.

### “Is this connected to the Department of Health?”
The hackathon version is a standalone prototype using synthetic data. It is architected for standards-aligned integration but no live integration or government endorsement is claimed unless formally established.

### “How does POPIA affect this solution?”
The design applies data minimisation, purpose limitation, access control, auditability and special handling for health information. Production deployment would require formal legal, security and institutional governance approval.

### “What makes this different from a chatbot?”
Ayanda is only one interaction layer. The core product is a governed referral workflow engine, patient journey timeline, exception engine, facility/service directory, analytics layer and auditable action system.

## 6. Demo readiness checklist

- [ ] Synthetic data visibly identified.
- [ ] Demo login accounts available.
- [ ] Dashboard loads with realistic seeded records.
- [ ] Ayanda text commands work.
- [ ] Voice command fallback available.
- [ ] Draft referral can be created.
- [ ] Human confirmation is shown.
- [ ] Receiving role can accept and schedule.
- [ ] Stale referral rule fires reliably.
- [ ] Follow-up task creation works.
- [ ] Audit log updates.
- [ ] Analytics update.
- [ ] Mobile/tablet view tested.
- [ ] No secret keys visible in browser or repository.
