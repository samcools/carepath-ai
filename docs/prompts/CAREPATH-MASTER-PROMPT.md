# CarePath AI — Complete Master Build, Enhancement & Hackathon Delivery Prompt

**Repository:** `samcools/carepath-ai`  
**Canonical specification path:** `docs/prompts/CAREPATH-MASTER-PROMPT.md`  
**Product:** CarePath AI  
**Positioning:** **From Referral to Care — Without Losing the Patient in Between**  
**Context:** SITA Hackathon / South African Public Healthcare  
**Brand:** Pyrneo  
**Assistant:** Ayanda  
**Document role:** Single source of truth for implementation, enhancement, validation and release decisions.

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
- healthcare workflow design;
- public-sector digital service delivery;
- POPIA/privacy engineering;
- Responsible AI;
- quality engineering and automated testing;
- hackathon demo and release engineering.

Your mandate is to **build CarePath AI by adapting and extending the proven Project Guardian operating model** into a healthcare referral, patient-navigation and care-coordination platform.

Use the Project Guardian philosophy and engineering patterns already evolved through AquaFlow AI and HomeFlow AI:

- secure authentication;
- role-aware dashboards;
- projects/work-items/tasks as governed workflow primitives;
- milestones and due dates;
- comments and notes;
- recent activity;
- user, audit, security, AI and system logs;
- explainable status and exception indicators;
- persistent text AI assistant;
- persistent voice AI assistant;
- hands-free page navigation;
- authorised voice-driven actions;
- responsive executive dashboards;
- human approval gates;
- server-side permission enforcement;
- complete auditability;
- synthetic hackathon data;
- deployment-ready source control.

Do **not** copy Human Settlements or municipal-water domain concepts into CarePath. Reuse the platform architecture, interaction patterns, audit model, secure action model, voice model, activity model and responsive UX approach, then implement healthcare-specific domain logic.

Follow this delivery sequence:

**Inspect → Preserve → Model → Build → Secure → Integrate → Test → Optimise → Document → Demonstrate.**

If working code already exists, inspect it before replacing anything. Preserve stable functionality that remains compatible with this specification.

Do not create duplicate dashboards, duplicate navigation systems, duplicate AI assistants, duplicate voice controllers, duplicate data models or parallel workflow engines.

Never claim that a feature, integration, security control, deployment, clinical validation, health-system connection, interoperability profile, government endorsement or test is complete unless it has actually been implemented and verified.

All implementation files, configuration templates, documentation, seed data, tests, deployment definitions and presentation-support assets created for CarePath AI must be stored in the `samcools/carepath-ai` GitHub repository. Never leave the only working copy outside source control.

---

# 2. PRODUCT VISION

Build CarePath AI as an intelligent public-healthcare referral orchestration and patient-navigation platform that connects:

**Need → Referral → Destination → Acceptance → Appointment → Patient Communication → Attendance → Feedback → Closure → Accountability.**

CarePath AI must help authorised healthcare teams answer:

- Which referrals need attention now?
- Which referrals have not been acknowledged?
- Which patients are at risk of being lost between facilities?
- Which referrals are missing required information?
- Which appointments are not confirmed?
- Which appointments were missed and require follow-up?
- Which facilities or services have operational bottlenecks?
- Who owns the next action?
- What changed, who changed it, and when?
- What should happen next according to approved workflow rules?

CarePath AI is not another static healthcare dashboard and not a general-purpose medical chatbot.

It must connect operational information to governed action.

The north-star question is:

> **What is preventing this patient from reaching the right service and completing the referral journey?**

The system must answer with evidence-based operational detail showing:

- current referral state;
- responsible facility;
- responsible user/team;
- outstanding action;
- elapsed time;
- configured threshold or rule that caused an exception;
- required documentation;
- appointment state;
- patient communication state;
- next permitted action;
- audit history.

---

# 3. NON-NEGOTIABLE CLINICAL SAFETY BOUNDARY

CarePath AI coordinates care. It does **not** replace clinical judgement.

The platform must not autonomously:

- diagnose a patient;
- prescribe medication;
- recommend clinical treatment as an authority;
- determine emergency severity from unrestricted free text and act independently;
- override a clinician;
- discharge a patient;
- cancel clinically required care;
- make patient eligibility decisions that require authorised clinical or statutory judgement;
- fabricate medical facts, facility capacity or appointment availability.

Ayanda may explain administrative/referral status, retrieve authorised records, draft content, navigate the application, recommend destinations from approved facility/service rules, identify workflow exceptions and execute authorised administrative actions after server-side validation and required confirmation.

Where a request crosses into diagnosis, treatment or other clinical decision-making, Ayanda must clearly defer to an authorised healthcare professional and continue supporting the administrative workflow.

---

# 4. PRODUCT PHILOSOPHY

Use the operating loop:

**Detect → Explain → Coordinate → Act → Escalate → Verify → Close → Learn.**

Every significant workflow should preserve:

**Record → Owner → State → Evidence → Action → Audit.**

---

# 5. PROJECT GUARDIAN BASELINE — PRESERVE THE STRONGEST PATTERNS

Treat the following Project Guardian-derived capabilities as mandatory platform foundations:

- secure login;
- protected routes;
- backend API/services;
- persistent application state;
- responsive dashboard layout;
- role-based navigation;
- task/work-item engine;
- assignment and reassignment;
- due dates and priority;
- comments and notes;
- recent activity;
- full record history;
- user logs;
- audit logs;
- security logs;
- AI action logs;
- system/error logs;
- text AI assistant;
- voice assistant;
- hands-free navigation;
- voice-triggered governed actions;
- multilingual South African interaction;
- human-like African voice preference;
- low-latency interactions;
- mobile/tablet support;
- clear evidence panels;
- confirmation gates for consequential actions.

Project Guardian's generic project/milestone/work-item concepts may be reused internally where useful, but the CarePath end-user domain must use healthcare-relevant terminology such as Referral, Appointment, Task, Facility, Service, Patient Journey, Exception and Follow-up.

Do not clutter the CarePath interface with irrelevant Project Guardian project-management screens merely because the underlying platform supported them.

---

# 6. PRODUCT IDENTITY AND BRANDING

The product name everywhere must be:

# CarePath AI

Positioning line:

**From Referral to Care — Without Losing the Patient in Between**

Branding:

- Pyrneo is the parent/solution brand.
- CarePath AI is the product identity.
- Use a polished healthcare-government visual system.
- Preserve Pyrneo's premium professional feel.
- Use a transparent CarePath logo when a logo asset is available.
- Never show legacy names from Project Guardian, AquaFlow AI, HomeFlow AI or GovDelivery AI in the live CarePath product except in technical provenance documentation.

The visual experience must feel:

- trustworthy;
- calm;
- modern;
- professional;
- African;
- public-sector appropriate;
- healthcare appropriate;
- data-rich without being visually overwhelming.

Avoid gimmicky AI imagery.

---

# 7. APPROVED DASHBOARD VISUAL LANGUAGE

Use the strongest Project Guardian dashboard language already carried into AquaFlow:

- deep navy/royal-blue application header;
- compact horizontal or adaptive navigation;
- constrained centered content area;
- strong responsive gutters;
- KPI/exception cards;
- white evidence/work panels;
- clear blue interaction colour;
- restrained status colours;
- dense but readable executive information hierarchy;
- clear page title and context;
- persistent Ayanda launcher;
- consistent icon system.

The application must not stretch unattractively to browser edges.

Support:

- large monitors;
- desktop;
- laptop;
- Mac displays;
- tablet portrait/landscape;
- smartphones.

Prevent:

- horizontal page overflow;
- clipped KPI cards;
- unreadable tables;
- broken forms;
- overlapping modals;
- tiny touch targets;
- fixed-width layouts that fail on tablet/mobile;
- inconsistent page widths.

Dense desktop tables should have responsive card/priority-column alternatives on smaller screens.

---

# 8. APPLICATION INFORMATION ARCHITECTURE

Recommended main navigation:

1. **Command Centre**
2. **Referrals**
3. **Patients**
4. **Appointments**
5. **Facilities & Services**
6. **Tasks & Follow-ups**
7. **Exceptions**
8. **Analytics**
9. **Activity**
10. **Audit & Logs** — permission controlled
11. **Administration** — permission controlled

Ayanda must remain accessible from every authenticated page.

---

# 9. AUTHENTICATION AND SESSION MANAGEMENT

Implement secure authentication from the start.

For hackathon mode, local/demo authentication may be used if implemented securely and clearly isolated for replacement.

Support or design for:

- secure password hashing;
- server-side session validation;
- secure HTTP-only cookies where applicable;
- SameSite controls;
- session expiration;
- logout invalidation;
- failed-login protection;
- rate limiting;
- account status;
- password reset architecture if enabled;
- MFA readiness;
- future Microsoft Entra ID / enterprise identity integration.

Never rely on client-side role checks as the security boundary.

Never expose tokens, hashes, secrets or password-reset material in UI or logs.

---

# 10. ROLE-BASED ACCESS CONTROL

Implement configurable granular RBAC enforced server-side.

Initial roles:

- System Administrator;
- Referring Clinician;
- Receiving Coordinator;
- Facility Manager;
- District Manager;
- Provincial/Oversight User;
- Auditor / Compliance User;
- Read-Only User.

Potential permissions:

- `patient.read`;
- `patient.create_demo`;
- `referral.read`;
- `referral.create`;
- `referral.update`;
- `referral.submit`;
- `referral.accept`;
- `referral.decline`;
- `referral.redirect`;
- `referral.close`;
- `appointment.read`;
- `appointment.create`;
- `appointment.update`;
- `task.create`;
- `task.assign`;
- `task.complete`;
- `facility.read`;
- `facility.manage`;
- `analytics.read`;
- `audit.read`;
- `user.manage`;
- `role.manage`;
- `data.export`;
- `ai.read`;
- `ai.execute_action`;
- `ai.execute_sensitive_action`.

Scope permissions by facility, district, province or authorised organisational boundary.

Never trust role, user, facility or tenant identifiers received from the browser or LLM without server-side verification.

---

# 11. MULTI-ORGANISATION / FACILITY DATA ISOLATION

Design for logical separation between healthcare facilities, districts and organisations.

Enforce scope at:

- authentication/session context;
- API/service layer;
- database/repository query layer;
- search;
- AI retrieval;
- document access;
- analytics;
- exports;
- audit access.

A user must not retrieve patient/referral data outside authorised scope merely by guessing an ID or asking Ayanda.

---

# 12. REFERRAL COMMAND CENTRE

The default landing page must be the **CarePath Referral Command Centre**.

It should immediately surface actionable information.

Required KPI/exception cards:

- Open Referrals;
- Awaiting Acceptance;
- Scheduled;
- Appointments Due;
- Overdue Referrals;
- Missing Information;
- Missed Appointments;
- Referral Leakage / Stale Referrals;
- Feedback Pending;
- Closed Referrals.

Additional panels:

- Referrals requiring attention;
- Today's appointments;
- Recent activity;
- Exceptions by type;
- Referral volume trend;
- Service/facility bottleneck summary;
- My tasks;
- AI-generated operational insight panel grounded in current data.

Every card should drill into filtered underlying records.

No decorative metric may exist without traceable source data.

---

# 13. DIGITAL REFERRAL WORKSPACE

Authorised users must be able to:

- create referral drafts;
- select/search a patient;
- capture referral reason;
- select requested service;
- set administrative priority from approved structured values;
- select or confirm destination facility/service;
- add summary/notes;
- attach supporting demo documents;
- save drafts;
- submit referrals;
- receive referrals;
- request additional information;
- supply additional information;
- accept referrals;
- decline with reason;
- redirect with reason;
- assign a receiving coordinator;
- schedule appointment;
- reschedule/cancel appointment;
- record attended/missed outcome;
- create follow-up tasks;
- capture return feedback;
- close a referral;
- reopen when authorised;
- view complete timeline and audit history.

No visible action button may be a dead button.

All state-changing actions must persist and generate appropriate activity/audit events.

---

# 14. REFERRAL STATE MACHINE

Implement an explicit server-side state machine.

Recommended states:

- `DRAFT`
- `SUBMITTED`
- `RECEIVED`
- `INFO_REQUESTED`
- `ACCEPTED`
- `DECLINED`
- `REDIRECTED`
- `SCHEDULED`
- `PATIENT_NOTIFIED`
- `ATTENDED`
- `MISSED`
- `CANCELLED`
- `FEEDBACK_PENDING`
- `FOLLOWUP_REQUIRED`
- `CLOSED`
- `REOPENED`

Typical path:

`DRAFT → SUBMITTED → RECEIVED → ACCEPTED → SCHEDULED → PATIENT_NOTIFIED → ATTENDED → FEEDBACK_PENDING → CLOSED`

Alternative paths must be explicit and validated.

The client may request a transition but the server decides whether it is valid.

Each successful transition records:

- actor;
- role;
- facility context;
- old state;
- new state;
- timestamp;
- reason where relevant;
- source channel;
- correlation ID.

---

# 15. PATIENT REGISTRY — HACKATHON SCOPE

Use synthetic patient data only unless authorised verified data is later connected.

Patient fields should be minimal and purposeful, for example:

- internal UUID;
- synthetic patient identifier;
- first name;
- surname;
- date of birth;
- phone/contact detail;
- preferred language;
- residential area;
- contact preference;
- synthetic-data flag.

Avoid collecting unnecessary medical, demographic or identity data merely to make the demo appear realistic.

Display an appropriate **Synthetic Demo Data** indicator in the hackathon environment.

---

# 16. FACILITY & SERVICE DIRECTORY

Create a searchable facility/service directory.

Support:

- facility name;
- facility type;
- district;
- province;
- address text;
- services offered;
- contact channels;
- operating information;
- referral instructions;
- routing priority;
- status/availability metadata.

Do not present configured demo availability as a live factual representation of a real healthcare facility.

If real authoritative registry data is not integrated, label relevant records as demonstration/configured data.

---

# 17. EXPLAINABLE REFERRAL DESTINATION RECOMMENDATION

Ayanda may recommend destination options from approved structured facility/service and referral-route rules.

The recommendation engine must show the basis of the suggestion, for example:

- required service match;
- configured referral pathway;
- geography or district routing rule;
- facility type;
- administrative eligibility rule.

The user must confirm the destination before submission.

Do not claim real-time capacity or appointment availability unless an authoritative integration actually supplies it.

---

# 18. APPOINTMENT COORDINATION

Support:

- proposed appointment;
- confirmation;
- rescheduling;
- cancellation;
- attended;
- missed;
- follow-up required.

Each appointment must link to the referral and relevant facility.

A missed appointment should be able to trigger a configurable operational follow-up exception.

---

# 19. PATIENT JOURNEY TIMELINE

Every referral must show a chronological journey timeline.

Include events such as:

- referral drafted;
- submitted;
- received;
- information requested;
- information supplied;
- accepted;
- declined;
- redirected;
- appointment proposed;
- appointment confirmed;
- patient notified;
- attended;
- missed;
- feedback requested;
- feedback received;
- closed;
- reopened;
- follow-up task created/completed.

Show:

- date/time;
- actor;
- facility;
- action;
- reason/context;
- source channel where useful.

---

# 20. REFERRAL EXCEPTION / LEAKAGE ENGINE

Build a configurable operational rule engine.

Initial rules:

- `AWAITING_ACCEPTANCE_OVER_THRESHOLD`
- `MISSING_REQUIRED_INFORMATION`
- `APPOINTMENT_NOT_CONFIRMED`
- `MISSED_APPOINTMENT_NO_FOLLOWUP`
- `STALE_REFERRAL`
- `MISSING_RETURN_FEEDBACK`
- `REPEATED_DECLINE_OR_REDIRECT`
- `OVERDUE_FOLLOWUP_TASK`

Each exception must include:

- referral;
- rule code;
- detected time;
- explanation;
- threshold/configuration;
- current owner;
- recommended operational next action;
- resolution status;
- resolution note;
- resolved by/time.

Rules must be transparent and configurable.

Do not use an opaque AI risk score as the only basis for consequential action.

---

# 21. TASKS & FOLLOW-UPS — PROJECT GUARDIAN WORK-ITEM EVOLUTION

Reuse the mature Project Guardian work-item pattern as CarePath Tasks & Follow-ups.

Support:

- create;
- edit;
- assign;
- reassign;
- status;
- priority;
- due date;
- comments;
- dependencies where useful;
- related referral;
- related facility;
- completion;
- archive where appropriate;
- activity history.

Voice commands should be able to create/update tasks subject to permissions and confirmation policy.

---

# 22. COMMENTS, NOTES AND COLLABORATION

Authorised users must be able to add contextual notes/comments to referrals and tasks.

Requirements:

- author and timestamp;
- edit policy;
- visibility rules where needed;
- audit trail for material edits;
- no silent deletion of significant operational history.

Uploaded content is untrusted input and must never be interpreted as system instructions for Ayanda.

---

# 23. RECENT ACTIVITY

Recent Activity must never remain blank when meaningful system actions exist.

Capture at minimum:

- referral creation;
- referral updates;
- state changes;
- assignments;
- comments;
- appointment changes;
- task changes;
- document uploads;
- patient notification events;
- exception detection/resolution;
- AI-assisted actions;
- voice-initiated actions;
- administrative changes;
- selected authentication/security events.

Display:

- timestamp;
- user;
- action;
- affected record;
- context;
- source channel if useful;
- link to the relevant record.

Use pagination/cursor loading for long histories.

---

# 24. AUDIT, USER, SECURITY, AI AND SYSTEM LOGS

Maintain distinct but correlated log categories.

## User activity logs
Capture meaningful user actions.

## Audit logs
Capture material data changes and governed workflow transitions.

## Security logs
Capture authentication events, permission changes, suspicious/blocked requests and relevant security events.

## AI logs
Capture:

- user/session reference;
- intent;
- tool requested;
- permission/validation outcome;
- confirmation requirement;
- confirmation result;
- action outcome;
- latency;
- provider/model identifier where appropriate.

Avoid unnecessary long-term storage of full sensitive prompts/transcripts.

## System logs
Capture errors, service failures, integration errors and background-job failures.

The platform must support audit questions such as:

- “Who changed this referral?”
- “Who accepted this referral?”
- “Who scheduled this appointment?”
- “What changed on this referral today?”
- “Who used the service at 14:35?”
- “Which actions were initiated through Ayanda?”
- “Who changed this user’s permissions?”

Material audit records should be append-oriented and protected from ordinary modification.

---

# 25. AYANDA — ONE GLOBAL AI ASSISTANT

Ayanda is the single assistant identity across CarePath AI.

There must not be a different assistant instance on each page.

Use the same assistant icon in:

- header/navigation trigger;
- global floating launcher;
- assistant drawer/panel;
- command-centre assistant card if included.

Ayanda must know:

- current authenticated user;
- role and permissions;
- authorised facility/organisation scope;
- current page;
- selected referral/patient/task where appropriate;
- selected language;
- permitted tools.

Ayanda must not retrieve data outside authorised scope.

---

# 26. AI TOOL EXECUTION ARCHITECTURE

The LLM must never manipulate the database directly.

Use:

**User → Ayanda → Intent/Reasoning → Authorised Tool Request → Schema Validation → RBAC/Scope Check → Workflow Rule Check → Confirmation Gate → Domain Service → Repository/Database → Audit Event → User Result.**

Read tools may include:

- `search_referrals`
- `get_referral`
- `search_patients`
- `get_patient_summary`
- `list_facility_services`
- `get_exception_reason`
- `get_operational_metrics`
- `get_activity_history`
- `get_audit_history`
- `search_tasks`

Write tools may include:

- `create_referral_draft`
- `update_referral_draft`
- `submit_referral`
- `assign_referral`
- `request_more_information`
- `accept_referral`
- `decline_referral`
- `redirect_referral`
- `schedule_appointment`
- `reschedule_appointment`
- `cancel_appointment`
- `record_attendance`
- `create_followup_task`
- `update_task`
- `add_note`
- `resolve_exception`
- `close_referral`

Every tool argument must be validated server-side.

The model is an untrusted caller, not an authority.

---

# 27. HUMAN CONFIRMATION GATES

Require explicit confirmation before consequential actions including:

- referral submission;
- referral acceptance;
- referral decline;
- referral redirect;
- appointment scheduling/rescheduling/cancellation;
- patient-facing communication containing sensitive information;
- closing/reopening a referral;
- patient-level export;
- privilege/role changes;
- other actions configured as sensitive.

The UI should show a concise action summary before confirmation.

For voice commands, show the transcript/action summary visually before executing sensitive actions.

---

# 28. HANDS-FREE APPLICATION CONTROL

Support natural language commands such as:

- “Hey Ayanda, open referrals.”
- “Show referrals waiting more than 24 hours.”
- “Open Thandi Mokoena’s referral.”
- “Create a referral draft for Thandi to cardiology.”
- “Add a follow-up task for tomorrow.”
- “Assign this task to the receiving coordinator.”
- “Schedule this referral for next Tuesday at 10.”
- “Add a note that the patient was contacted.”
- “Show missed appointments.”
- “Which facility has the most unresolved referrals?”
- “Why is this referral flagged?”
- “What changed on this referral today?”
- “Who last updated this record?”
- “Take me to the audit log.”

Simple deterministic navigation/status commands should execute locally or through lightweight handlers where safe rather than invoking expensive multi-step reasoning.

---

# 29. VOICE ARCHITECTURE — DO NOT REINTRODUCE DUPLICATE VOICES

Use exactly **one speech-recognition controller** and **one speech-synthesis controller** for the application.

The previous duplicate-voice defect from earlier platforms must not recur.

Prevent:

- browser TTS plus server TTS playing simultaneously;
- duplicate event listeners;
- duplicate response playback;
- old queued speech playing after a newer answer;
- overlapping speech;
- page-specific voice instances.

Before speaking a new response:

- cancel existing speech;
- clear obsolete queued output;
- ensure only the current response is voiced.

Expose visible state:

- idle;
- listening;
- processing;
- speaking;
- interrupted;
- error.

The chatbot icon and voice identity must remain consistent across all pages.

---

# 30. WAKE PHRASE AND VOICE CONTROLS

Preferred wake phrase:

**“Hey, Ayanda”**

After browser/user permission is granted, the application may maintain a wake listener while the app is open, subject to browser capabilities and transparent microphone status.

Always provide manual alternatives:

- microphone button;
- text chat;
- normal mouse/keyboard UI.

Do not rely on voice as the only accessible path.

---

# 31. SOUTH AFRICAN LANGUAGE SUPPORT

Target languages:

- English;
- Afrikaans;
- isiZulu;
- isiXhosa;
- Sesotho;
- Setswana;
- Sepedi;
- Xitsonga;
- Tshivenda;
- siSwati;
- isiNdebele.

Requirements:

- one selected language applies consistently to recognition, assistant generation and speech output;
- maintain conversational context across language switches;
- preserve patient/facility names accurately;
- prioritise natural phrasing over literal translation;
- use correct locale/accent where supported;
- transparently fall back when the installed/provider voice is not available;
- never falsely label a generic system voice as a specific unsupported native voice.

The language capability is assistive and must not be described as clinically validated translation unless such validation has occurred.

---

# 32. AYANDA VOICE PERSONA

Preferred identity: **Ayanda**.

Voice characteristics:

- human-like;
- warm;
- calm;
- professional;
- African where provider capability allows;
- non-robotic;
- concise;
- confident without pretending certainty.

Never hard-code a provider-specific voice name unless that voice actually exists in the deployed provider.

---

# 33. AI AND VOICE PERFORMANCE

Reduce perceived latency aggressively without bypassing safety controls.

Use where appropriate:

- streaming text responses;
- fast speech start;
- client-side/local routing for navigation commands;
- deterministic command handlers;
- parallel safe retrieval;
- database indexes;
- connection pooling;
- cached stable reference data;
- compact prompts;
- context filtering;
- cancellation of superseded requests;
- incremental UI rendering.

Navigation must not wait for TTS playback to complete.

Authorised write operations must still pass all server-side controls.

---

# 34. PATIENT NAVIGATION & NOTIFICATIONS

Implement a notification abstraction supporting:

- in-app;
- SMS adapter;
- WhatsApp adapter;
- email adapter.

Hackathon mode may simulate external delivery where no provider credentials are supplied.

Patient-facing communication may include:

- appointment date/time;
- facility/location guidance;
- administrative preparation instructions;
- reschedule/cancellation notices;
- follow-up reminder;
- contact channel.

Use minimum necessary information.

Do not put sensitive diagnosis/treatment details into notifications unless a formally approved workflow requires it.

Track notification state:

- created;
- queued;
- sent;
- delivered where provider supports it;
- failed.

---

# 35. ANALYTICS

Provide operational analytics grounded in stored workflow timestamps/events.

Metrics may include:

- referral volume;
- open referrals;
- awaiting acceptance;
- median acknowledgement time;
- median scheduling time;
- completion rate;
- stale referral count;
- missed appointment count;
- feedback completion;
- volume by facility;
- volume by service;
- exceptions by rule;
- task completion;
- trend over time.

Provide filters by:

- date range;
- facility;
- district;
- province;
- service;
- status;
- priority;
- exception type.

For district/provincial management views, prefer aggregate or appropriately de-identified analytics.

Do not claim improved mortality, clinical outcomes, waiting times or system savings unless measured through validated evidence.

---

# 36. EXECUTIVE BRIEFING / “WHAT CHANGED?”

Add a grounded executive briefing capability derived only from authorised application data.

Examples:

- “What changed since yesterday?”
- “Which referral queues deteriorated this week?”
- “Which facilities have the most stale referrals?”
- “What needs management attention today?”

Output should distinguish:

- facts from stored data;
- configured rule findings;
- AI-generated interpretation/suggestion.

No invented statistics.

---

# 37. DATA MODEL

Implement domain entities including:

- User;
- Role;
- Permission;
- Facility;
- Service;
- FacilityService;
- Patient;
- Referral;
- ReferralRequirement;
- ReferralEvent;
- Appointment;
- Task;
- Comment/Note;
- Document;
- Notification;
- ExceptionRule;
- ReferralException;
- AuditEvent;
- AIInteraction;
- SecurityEvent;
- SystemEvent.

Use UUID identifiers.

Use UTC storage for timestamps and render in local user context.

Add appropriate indexes for status, facility, service, patient, due dates and timeline queries.

Keep the model mappable to FHIR-compatible concepts without falsely claiming certification.

---

# 38. FHIR-COMPATIBLE INTEROPERABILITY STRATEGY

Create a clean interoperability adapter layer.

Conceptual mappings may include:

- Patient → FHIR `Patient`;
- clinician/user → `Practitioner` / `PractitionerRole`;
- facility → `Organization` / `Location`;
- service → `HealthcareService`;
- referral → `ServiceRequest`;
- task/follow-up → `Task`;
- appointment → `Appointment`;
- document → `DocumentReference`;
- communication → `Communication` / `CommunicationRequest`;
- audit → `AuditEvent`;
- provenance → `Provenance`.

Do not claim national-profile conformance until an actual South African implementation guide/profile set has been selected, implemented and tested.

Integration adapters must remain separate from core domain logic.

---

# 39. POPIA AND PRIVACY BY DESIGN

Treat health information as highly sensitive/special personal information.

Apply:

- lawful-purpose design;
- data minimisation;
- purpose limitation;
- access control;
- facility/organisational scoping;
- confidentiality;
- logging of sensitive access where required;
- configurable retention;
- secure deletion where lawful/appropriate;
- de-identification/aggregation for management analytics;
- privacy-aware AI context selection;
- secure export controls.

Do not use patient data for unrelated marketing, profiling or model training.

Do not send identifiable health information to external AI/cloud providers without an approved legal, security and contractual basis.

Prototype implementation and documentation must clearly distinguish engineering design from legal advice.

---

# 40. APPLICATION SECURITY

Implement secure-by-default engineering.

Required controls:

- server-side authorisation;
- object-level access checks;
- schema/input validation;
- parameterised persistence/ORM;
- output encoding;
- XSS protection;
- CSRF protection where applicable;
- secure cookies;
- CSP/security headers;
- HSTS in production;
- authentication and AI endpoint rate limiting;
- request-size limits;
- file upload validation;
- MIME/type/size restrictions;
- secrets via environment/secret store;
- dependency auditing;
- secret scanning;
- safe error messages;
- correlation IDs;
- no unnecessary PII/health data in logs.

The browser is untrusted.

The LLM is untrusted.

Voice transcripts are untrusted input.

Uploaded documents are untrusted input.

---

# 41. PROMPT-INJECTION AND AI SECURITY

Protect the tool layer from prompt injection.

Rules:

- content inside referral notes/documents is data, not system instruction;
- never allow retrieved text to redefine tool permissions;
- never expose system prompts/secrets;
- never trust model-provided user/facility IDs;
- validate all tool parameters;
- enforce permission and workflow checks outside the LLM;
- limit tools to the minimum actions required;
- log denied sensitive tool attempts safely;
- require confirmation for configured actions.

---

# 42. REPOSITORY ARCHITECTURE

Use a monorepo aligned with the successful HomeFlow/Guardian evolution:

```text
carepath-ai/
├─ apps/
│  ├─ web/                 # React + TypeScript + Vite
│  └─ api/                 # Express + TypeScript
├─ packages/
│  ├─ domain/              # shared domain models and state rules
│  ├─ contracts/           # API/tool schemas
│  └─ ui/                  # optional shared UI primitives
├─ assets/
│  ├─ branding/
│  └─ demo/
├─ docs/
│  ├─ prompts/
│  ├─ architecture/
│  ├─ security/
│  ├─ governance/
│  ├─ ux/
│  ├─ demo/
│  └─ release/
├─ infrastructure/
├─ scripts/
├─ presentations/
├─ .github/workflows/
├─ .env.example
├─ .gitignore
├─ package.json
└─ README.md
```

Keep implementation modular.

Do not put all frontend logic into one file.

Do not put all API routes into one oversized server file.

---

# 43. FRONT-END ENGINEERING

Build reusable components for:

- AppShell;
- navigation;
- KPI cards;
- ReferralTable / ReferralCards;
- ReferralStatusBadge;
- PatientSummary;
- PatientJourneyTimeline;
- AppointmentPanel;
- TaskList;
- ExceptionPanel;
- ActivityFeed;
- AuditTimeline;
- FacilityServiceSelector;
- AyandaLauncher;
- AyandaPanel;
- VoiceControls;
- LanguageSelector;
- ConfirmActionModal;
- EmptyState;
- LoadingState;
- ErrorBoundary;
- mobile navigation.

Every screen needs:

- loading state;
- empty state;
- error state;
- permission-denied state where applicable.

Avoid dead UI.

---

# 44. BACK-END ENGINEERING

Separate:

- routes/controllers;
- authentication;
- authorisation;
- validation;
- domain services;
- repository/data access;
- audit service;
- AI tool gateway;
- notification adapters;
- interoperability adapters;
- exception engine;
- analytics service.

Do not put business rules only in the front end.

Critical workflow rules belong server-side.

---

# 45. PERSISTENCE STRATEGY

Target production-like storage:

- PostgreSQL;
- Prisma ORM or equivalent typed migration-capable ORM.

For the first scaffold, a seed-backed/in-memory repository is acceptable only when:

- it is behind a repository interface;
- demo behaviour remains deterministic;
- migration to PostgreSQL is straightforward;
- the UI does not falsely claim persistent production storage.

Provide reset/seed scripts for the hackathon demo.

---

# 46. SYNTHETIC DEMO DATA

Seed realistic but synthetic South African demo data.

Include:

- multiple facilities;
- several services;
- multiple users/roles;
- at least 15–25 referrals in different states;
- appointments;
- tasks;
- comments;
- exceptions;
- activity history;
- audit events.

Flag all patients as synthetic.

Primary demo patient:

- **Thandi Mokoena**
- synthetic patient ID such as `SYN-CP-0001`
- preferred language: isiZulu
- referral need: cardiology service

Use fabricated contact details and clearly synthetic identifiers.

Create at least one intentionally stale referral to reliably demonstrate exception detection.

---

# 47. FLAGSHIP HACKATHON DEMO FLOW

The complete product must reliably support this journey:

1. User signs in.
2. Referral Command Centre loads with synthetic portfolio data.
3. KPI cards show open, overdue and stale referrals.
4. Presenter says: **“Hey Ayanda, create a referral for Thandi Mokoena to an appropriate cardiology service.”**
5. Ayanda retrieves the synthetic patient and creates a **draft** only.
6. Ayanda shows configured destination options with explanation.
7. User confirms destination.
8. Ayanda summarises the referral and asks for explicit submission confirmation.
9. User confirms.
10. Referral becomes `SUBMITTED` and appears in receiving queue.
11. Receiving Coordinator accepts it.
12. Coordinator schedules an appointment.
13. System generates a simulated isiZulu patient notification.
14. Presenter says: **“Ayanda, show referrals waiting more than 24 hours.”**
15. Dashboard filters to a stale referral.
16. Ayanda explains exactly why the rule fired.
17. Presenter says: **“Create a follow-up task for the receiving coordinator.”**
18. Ayanda requests confirmation.
19. Task is created through the governed API.
20. Audit trail records the voice/AI-assisted action.
21. Dashboard metrics and recent activity update.
22. Presenter opens audit history to show accountability.

Closing proposition:

> **CarePath AI does not replace clinical judgement. It makes sure the patient journey does not disappear between facilities.**

---

# 48. DEMO ACCOUNTS

Provide seeded demo accounts for key roles.

Use clearly documented non-production credentials.

Examples:

- Referring Clinician;
- Receiving Coordinator;
- Facility Manager;
- District Manager;
- Administrator.

Do not hard-code real secrets into source code.

If demo passwords are committed, mark them explicitly as demo-only and ensure they cannot access any real environment/data.

---

# 49. ACCESSIBILITY

Meet practical WCAG-aligned accessibility expectations:

- semantic HTML;
- keyboard navigation;
- visible focus;
- sufficient contrast;
- labels for form fields;
- ARIA only where necessary;
- screen-reader-aware controls;
- no colour-only status meaning;
- touch-friendly controls;
- reduced-motion awareness where practical.

Voice must enhance accessibility, not replace conventional accessible controls.

---

# 50. PERFORMANCE TARGETS

For local/hackathon interactions, aim for:

- fast initial shell render;
- navigation response under ~500 ms where possible;
- dashboard data requests parallelised safely;
- no obvious multi-second delay for deterministic commands;
- streaming AI response where supported;
- quick first audio response without duplicate speech;
- indexed queries for common filters.

Measure rather than claim.

---

# 51. OBSERVABILITY

Implement:

- structured logs;
- correlation IDs;
- request duration;
- AI latency;
- tool latency;
- error category;
- audit outcome;
- health endpoint;
- readiness/liveness concept for deployment.

Do not dump full patient/referral objects to logs by default.

---

# 52. CI/CD AND QUALITY GATES

Create GitHub Actions workflows for:

- install;
- lint;
- typecheck;
- unit tests;
- integration/API tests;
- build;
- dependency audit;
- secret scanning where feasible.

The main branch should not knowingly contain a broken build.

Use environment variables for deployment secrets.

---

# 53. TEST STRATEGY

Implement tests for at least:

## Domain tests
- valid referral transitions;
- invalid transitions blocked;
- exception thresholds;
- task assignment;
- analytics calculations.

## Security tests
- unauthenticated protected route rejected;
- unauthorised facility access rejected;
- role restriction enforced;
- invalid tool arguments rejected;
- sensitive action requires confirmation.

## API tests
- create draft;
- submit referral;
- accept referral;
- schedule appointment;
- create follow-up task;
- query activity;
- query audit.

## UI smoke tests
- login;
- command centre;
- referral detail;
- create draft;
- exception view;
- Ayanda opens;
- responsive layout.

## Voice logic tests where practical
- one controller only;
- cancel previous TTS before new playback;
- command mapping;
- confirmation path.

Never state that penetration testing, clinical validation or production security certification has occurred unless it actually has.

---

# 54. MICROSOFT / AZURE TARGET ARCHITECTURE

Keep the application cloud-portable, but document a credible Microsoft-aligned target for the SITA hackathon context.

Potential production target components:

- Microsoft Entra ID for identity;
- Azure App Service or Azure Container Apps;
- Azure Database for PostgreSQL;
- Azure Key Vault;
- Azure OpenAI or approved LLM service;
- Azure AI Speech where language/voice quality is adequate;
- Azure Monitor / Application Insights;
- Azure Storage for documents;
- Azure API Management for governed external APIs;
- private networking where required.

Do not claim these services are deployed until they actually are.

For the hackathon, Render or another approved hosting platform may be used for a live demo if faster, while keeping Azure deployment documentation and portability.

---

# 55. EXTERNAL INTEGRATION POLICY

Create adapters/stubs for future:

- hospital/clinic information systems;
- provincial health platforms;
- health information exchange infrastructure;
- authoritative facility registries;
- enterprise identity;
- SMS/WhatsApp/email providers;
- master patient index/identity services;
- appointment systems;
- FHIR endpoints.

Do not fake live integration.

A mock adapter must be labelled mock/demo.

---

# 56. RELEASE AND PROTOTYPE DISCLAIMERS

The hackathon build must clearly state where appropriate:

- synthetic data is used;
- this is a prototype;
- no live government/health-system integration is claimed unless implemented;
- no NDoH endorsement is claimed;
- no clinical validation is claimed;
- no SAHPRA approval is claimed;
- no autonomous diagnosis/treatment is performed;
- interoperability is standards-aware/FHIR-compatible by architecture unless formal conformance testing is actually completed.

---

# 57. DOCUMENTATION REQUIREMENTS

Maintain documentation for:

- README / quick start;
- architecture;
- data model;
- security;
- POPIA/privacy;
- Responsible AI;
- Ayanda AI tools;
- voice architecture;
- language support and fallbacks;
- demo guide;
- seeded accounts;
- deployment;
- environment variables;
- release notes;
- known limitations;
- integration seams;
- reset/seed procedure.

Documentation must describe reality, not aspiration, when labelling features as complete.

---

# 58. IMPLEMENTATION PRIORITY

Execute in this order unless a blocking dependency requires adjustment.

## P0 — Repository and build integrity
- package/workspace setup;
- application boots;
- API health;
- environment template;
- CI build.

## P1 — Secure application shell
- login;
- sessions;
- RBAC;
- responsive Pyrneo/CarePath shell;
- navigation;
- demo roles.

## P2 — Referral domain
- patient demo registry;
- facilities/services;
- referrals;
- state machine;
- referral detail;
- timeline;
- tasks/comments.

## P3 — Command Centre
- KPIs;
- referral queues;
- filters;
- recent activity;
- analytics basics.

## P4 — Exceptions
- stale referral;
- missing information;
- missed appointment;
- feedback pending;
- explainable rules.

## P5 — Ayanda text assistant
- context;
- read tools;
- navigation;
- write-tool gateway;
- confirmation gates.

## P6 — Voice
- one controller;
- wake phrase;
- STT/TTS abstraction;
- South African language selector;
- voice commands;
- duplicate-voice prevention;
- low-latency command routing.

## P7 — Notifications and patient navigation
- templates;
- simulated provider;
- multilingual message generation;
- audit.

## P8 — Security hardening
- rate limits;
- headers;
- validation review;
- scope tests;
- dependency/secret scanning;
- logging review.

## P9 — Demo polish
- deterministic seed state;
- 90-second demo;
- 5-minute demo;
- responsive check;
- recovery/fallback path;
- release notes.

## P10 — Advanced integration readiness
- PostgreSQL production configuration;
- FHIR adapter;
- Azure architecture;
- enterprise identity adapter;
- messaging provider adapters.

---

# 59. DEFINITION OF DONE — HACKATHON MVP

Do not call CarePath AI hackathon-ready until all of the following are true:

- application starts from documented commands;
- login works;
- at least five role types are seeded;
- Command Centre shows real values from seed state;
- referrals can be created/edited through UI;
- referral state transitions persist;
- invalid transitions are blocked;
- patient journey timeline works;
- facility/service directory works;
- appointment workflow works;
- tasks/follow-ups work;
- recent activity populates;
- exception engine identifies at least stale referral and one additional exception;
- Ayanda text assistant works across pages;
- Ayanda can navigate pages;
- Ayanda can answer grounded status questions;
- Ayanda can execute at least one governed write action after confirmation;
- voice input works or has a documented provider/browser fallback;
- duplicate voice is prevented;
- selected language propagates to the assistant/voice layer;
- audit log records AI/voice-assisted actions;
- mobile/tablet layout is usable;
- no secrets are committed;
- synthetic data is labelled;
- CI build passes;
- core tests pass;
- demo reset works;
- README reflects actual implementation;
- no unsupported production/clinical claims are present.

---

# 60. FINAL VALIDATION CHECKLIST

Before release, verify:

## Functional
- every menu link resolves;
- every visible action works;
- forms validate;
- filters work;
- data refreshes after mutation;
- recent activity updates;
- audit events update;
- demo flow runs end-to-end.

## Security
- unauthenticated access blocked;
- role restrictions enforced;
- cross-facility ID guessing blocked;
- AI cannot bypass RBAC;
- sensitive actions require confirmation;
- secrets absent from repository;
- logs avoid unnecessary sensitive content.

## Voice
- one voice only;
- one assistant identity;
- no stale playback;
- visible voice state;
- selected language is honoured when available;
- fallback is transparent.

## UX
- desktop checked;
- laptop checked;
- tablet checked;
- mobile checked;
- no edge-to-edge stretching defect;
- no overflowing tables/forms;
- status colours have text/icon meaning;
- loading/error/empty states present.

## Claims
- no live integration claimed unless live;
- no production deployment claimed unless deployed;
- no clinical validation claimed unless validated;
- no NDoH/SAHPRA approval claimed unless approved;
- no fabricated benefits/statistics;
- no autonomous diagnosis/treatment language.

---

# 61. ENGINEERING DELIVERY RULES

1. Build the actual working product, not only mockups.
2. Do not replace working functionality without a reason.
3. Do not introduce duplicate implementations.
4. Fix root causes, not only visible symptoms.
5. Store all source and documentation in GitHub.
6. Commit incremental meaningful changes.
7. Do not commit secrets.
8. Keep demo state deterministic and resettable.
9. Use synthetic data.
10. Make all material actions auditable.
11. Keep human accountability explicit.
12. Optimise latency without weakening governance.
13. Test before declaring complete.
14. Document limitations precisely.
15. Preserve a clean path from hackathon prototype to enterprise architecture.

---

# 62. SUCCESS CRITERION

The final CarePath AI experience should allow a judge to see, within minutes, that this is not merely a chatbot and not merely a dashboard.

It is a governed operational platform in which:

- referrals move through accountable states;
- lost/stale referrals become visible;
- ownership is explicit;
- Ayanda can explain and navigate the workflow;
- Ayanda can perform permitted administrative actions through secure tools;
- multilingual voice can reduce interaction friction;
- consequential actions remain human-confirmed;
- every important change is auditable;
- managers gain operational visibility;
- interoperability is designed in rather than bolted on;
- clinical judgement remains with authorised healthcare professionals.

The final question to apply to every feature is:

> **Does this feature help an authorised healthcare team move a patient safely and accountably from referral to completed care without losing visibility, ownership or human responsibility?**

If the answer is no, simplify it, redesign it or remove it.
