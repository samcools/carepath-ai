# CarePath AI — Implementation Roadmap

## Phase 0 — Product baseline

Status: **In progress / repository initialised**

Deliverables:
- Product requirements
- Reference architecture
- Data model
- Security / privacy / Responsible AI baseline
- Demo scenario
- Master build prompt

## Phase 1 — Application shell

Deliverables:
- Next.js + TypeScript project
- Pyrneo-branded responsive application shell
- Login screen
- Role-aware navigation
- Shared design tokens
- Desktop/tablet/mobile layouts
- Persistent Ayanda assistant entry point

Acceptance:
- Application builds cleanly.
- Protected routes require authentication.
- Navigation changes by role.
- No page stretches improperly on wide screens.

## Phase 2 — Core referral domain

Deliverables:
- PostgreSQL + Prisma schema
- Seeded synthetic facilities, services, users and patients
- Referral CRUD with state machine
- Referral detail workspace
- Patient journey timeline
- Assignment and notes

Acceptance:
- Invalid state transitions are blocked server-side.
- All material writes create audit events.
- Synthetic patient label is visible in demo environment.

## Phase 3 — Command Centre and analytics

Deliverables:
- Referral Command Centre
- Metric cards
- Operational charts
- Filters
- Work queues
- Referral exception list

Acceptance:
- Metrics reconcile to seeded records.
- Filters are deterministic.
- Dashboard updates after workflow changes.

## Phase 4 — Facility / service directory and routing

Deliverables:
- Facility directory
- Service catalogue
- Facility-service mapping
- Referral-route rules
- Destination recommendation explanation

Acceptance:
- Recommendations are grounded in configured demo data.
- The user must confirm destination.
- No false claim of live facility capacity.

## Phase 5 — Exception engine

Deliverables:
- Configurable rules
- Stale referral detection
- Missing information detection
- Missed appointment follow-up detection
- Missing return feedback detection
- Resolution workflow

Acceptance:
- Rules show why they fired.
- Rule events are auditable.
- Thresholds are configurable.

## Phase 6 — Ayanda assistant

Deliverables:
- Text assistant
- Voice input/output abstraction
- Tool calling
- Permission gate
- Confirmation workflow
- Language selector
- Page navigation commands
- Referral search / summarisation
- Follow-up task commands

Acceptance:
- One assistant identity across the application.
- Voice and text use the same action tools.
- Write actions require server-side permission checks.
- Consequential writes require confirmation.
- AI does not diagnose or prescribe.

## Phase 7 — Notifications

Deliverables:
- Notification templates
- Language-aware patient messages
- Demo provider
- Optional SMS/WhatsApp/email adapters if credentials are later supplied

Acceptance:
- Only minimum necessary data appears in messages.
- Demo mode is clearly indicated when no real provider is connected.

## Phase 8 — Security hardening

Deliverables:
- Security headers
- Rate limiting
- Validation schemas
- Session controls
- Secret scanning
- Dependency audit
- Logging review
- AI prompt-injection safeguards

Acceptance:
- No secrets in repository.
- Protected API routes reject unauthorised requests.
- Security checks run in CI.

## Phase 9 — Demo and pitch readiness

Deliverables:
- Stable synthetic demo dataset
- 90-second wow path
- 5-minute full demo
- Judge Q&A notes
- Screenshots / backup demo path
- Hackathon presentation

Acceptance:
- Demo can be reset to known state.
- Core scenario works without manual database editing.
- Fallback text interaction works if voice is unavailable.

## Phase 10 — Future integration readiness

Not required for hackathon completion.

Potential later work:
- Authoritative facility registry integration
- FHIR endpoint / profile implementation
- HIE integration
- Enterprise identity integration
- Real messaging providers
- Provincial / national deployment architecture
- Security testing and privacy impact assessment
- Clinical safety assessment and formal governance approvals
