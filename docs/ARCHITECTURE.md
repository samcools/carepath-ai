# CarePath AI — Reference Architecture

## 1. Architecture objective

Create a secure, modular hackathon platform that can demonstrate referral orchestration, multilingual AI assistance, operational analytics and standards-aware interoperability without implying production clinical validation.

## 2. Recommended stack

### Frontend
- Next.js + TypeScript
- React
- Tailwind CSS
- Accessible component system
- Recharts or equivalent for operational analytics
- Progressive Web App readiness for mobile/tablet use

### Backend
- Next.js server routes or a dedicated Node.js/NestJS API depending on implementation scale
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis optional for session/cache/queue workloads

### AI / voice layer
- Provider abstraction for LLM calls
- Retrieval layer over configured facility/service/referral knowledge
- Tool-calling layer for authorised workflow actions
- Speech-to-text and text-to-speech provider abstraction
- One persistent assistant identity: **Ayanda**
- Language selection passed explicitly to speech and generation layers

### Notifications
Provider abstraction supporting demo adapters for:
- SMS
- WhatsApp
- Email
- in-app notifications

### Deployment
- Container-ready application
- Environment-specific secrets
- Production-like HTTPS configuration
- CI checks for type, lint, test and build

## 3. Logical architecture

```text
[Browser / Mobile Web]
        |
        v
[Next.js UI + Ayanda Client]
        |
        v
[API / Application Services]
   |        |          |
   |        |          +--> [AI Orchestrator]
   |        |                 |--> Knowledge/RAG
   |        |                 |--> Tool Permission Gate
   |        |                 |--> Voice/STT/TTS
   |        |
   |        +--> [Notification Service]
   |
   +--> [Referral Domain Services]
   |       |--> Routing
   |       |--> Workflow State Machine
   |       |--> Exception Rules
   |       |--> Appointment Coordination
   |
   +--> [Audit / Security Services]
   |
   +--> [Interoperability Adapter]
              |--> FHIR-compatible mappings
              |--> Future HIE / EMR connectors

[PostgreSQL]
```

## 4. Domain modules

### 4.1 Identity & Access
Responsibilities:
- Authentication
- Session management
- RBAC
- Facility scope
- User permission checks
- Elevated-action confirmation

### 4.2 Patient Registry (prototype)
Responsibilities:
- Synthetic patient records
- Demographic identifiers needed by the demo
- Record linking inside the prototype

Do not implement a national master-patient-index claim unless an authoritative integration exists.

### 4.3 Referral Management
Responsibilities:
- Referral creation
- Validation
- Assignment
- Status transitions
- Destination selection
- Required information checks
- Closure / feedback

Use a state machine to prevent invalid status transitions.

### 4.4 Facility & Service Directory
Responsibilities:
- Facilities
- Service capabilities
- Referral routes
- Contact channels
- Operating metadata

### 4.5 Appointment Coordination
Responsibilities:
- Proposed date/time
- Confirmation
- Reschedule
- Cancellation
- Attendance status

### 4.6 Exception Engine
Operational rules only. Example:
- `AWAITING_ACCEPTANCE > threshold`
- `MISSING_REQUIRED_INFO`
- `APPOINTMENT_UNCONFIRMED`
- `MISSED_NO_FOLLOWUP`
- `STALE_REFERRAL`
- `MISSING_RETURN_FEEDBACK`

Rules must be configurable and auditable.

### 4.7 Ayanda Orchestrator
Pipeline:
1. Authenticate caller context.
2. Detect requested language.
3. Classify intent.
4. Retrieve only authorised context.
5. Produce explanation or proposed action.
6. Pass action through tool permission gate.
7. Require confirmation for consequential writes.
8. Execute server-side authorised tool.
9. Record audit event.
10. Return concise result in selected language.

### 4.8 Audit Service
Append-oriented event records containing:
- event id
- actor id
- actor role
- timestamp
- action
- object type/id
- before/after hashes or safe snapshots where appropriate
- facility context
- source channel (UI / voice / API)
- correlation id
- outcome

## 5. Referral state model

Recommended states:

```text
DRAFT
  -> SUBMITTED
  -> RECEIVED
  -> ACCEPTED
  -> SCHEDULED
  -> PATIENT_NOTIFIED
  -> ATTENDED
  -> FEEDBACK_PENDING
  -> CLOSED
```

Alternative transitions:

```text
SUBMITTED -> INFO_REQUESTED -> SUBMITTED
RECEIVED -> DECLINED
RECEIVED -> REDIRECTED
SCHEDULED -> CANCELLED
SCHEDULED -> MISSED
MISSED -> FOLLOWUP_REQUIRED -> SCHEDULED
CLOSED -> REOPENED
```

Every transition requires server-side validation and an audit event.

## 6. FHIR-compatible mapping strategy

CarePath AI should avoid inventing a proprietary interoperability model where standards already exist. The internal domain may map to FHIR-compatible concepts such as:
- Patient
- Practitioner / PractitionerRole
- Organization
- Location
- ServiceRequest
- Task
- Appointment
- Encounter
- DocumentReference
- Communication / CommunicationRequest
- AuditEvent
- Provenance

This is a compatibility strategy, not a claim that the hackathon prototype is certified against a national interoperability profile.

## 7. AI tool catalogue

### Read tools
- `search_referrals`
- `get_referral`
- `get_patient_summary`
- `list_facility_services`
- `get_exception_reason`
- `get_operational_metrics`

### Write tools
- `create_referral_draft`
- `update_referral_draft`
- `submit_referral`
- `assign_referral`
- `request_more_information`
- `accept_referral`
- `decline_referral`
- `redirect_referral`
- `schedule_appointment`
- `create_followup_task`
- `add_note`
- `close_referral`

Every write tool must enforce permission, scope and workflow-state checks on the server regardless of what the model requests.

## 8. Performance strategy

- Keep dashboard aggregation queries indexed and bounded.
- Parallelise independent dashboard fetches.
- Cache stable reference data such as service directory entries.
- Stream AI text responses when available.
- Use low-latency voice turn detection.
- Never delay UI navigation waiting for TTS completion.
- Cancel obsolete AI requests when a newer user command supersedes them.

## 9. Security boundaries

- Browser is untrusted.
- Model output is untrusted.
- Voice transcript is untrusted input.
- Server-side permission checks are authoritative.
- Database access is mediated by application services.
- AI providers receive only minimum necessary context.
- Logs must avoid gratuitous patient data.

## 10. Future production integration seams

Keep adapters separate for future integration with:
- Hospital / clinic information systems
- Health information exchange infrastructure
- Enterprise identity providers
- Authoritative facility registries
- Messaging gateways
- Master patient index / identity services
- National or provincial interoperability services

These interfaces must remain stubs or mock adapters until real technical specifications, approvals and credentials are available.
