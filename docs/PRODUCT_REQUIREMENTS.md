# CarePath AI — Product Requirements

## 1. Product vision

CarePath AI is a public-healthcare referral orchestration and patient-navigation platform. It helps authorised healthcare workers coordinate referrals across facilities, track patient journeys, identify operational exceptions, communicate next steps and maintain accountable audit trails.

The product is intentionally **not** an autonomous diagnostic or prescribing system.

## 2. Primary problem

Public-sector referrals can fail between organisational boundaries: a referral may be incomplete, not acknowledged, not scheduled, not attended, not followed up, or never closed with feedback to the referring facility. CarePath AI makes these transitions visible, actionable and auditable.

## 3. Primary users

### 3.1 Referring clinician / nurse
- Create and submit referrals.
- Select or confirm an appropriate destination.
- Attach required referral documentation.
- Track acceptance and downstream status.
- Receive closure / return-referral feedback.

### 3.2 Receiving facility coordinator
- View incoming referrals.
- Accept, reject with reason, request information, redirect or schedule.
- Escalate cases that breach operational thresholds.
- Coordinate appointments and patient communication.

### 3.3 Facility manager
- Monitor workload, bottlenecks, overdue referrals and unresolved exceptions.
- Reassign administrative ownership.
- View operational performance.

### 3.4 District / provincial oversight user
- View aggregated, appropriately de-identified operational metrics.
- Identify bottleneck services and facilities.
- Monitor referral completion and leakage patterns.

### 3.5 System administrator
- Manage users, roles, facilities, services, configuration, audit access and integration settings.

### 3.6 Patient-facing interaction
For the hackathon, patient-facing functionality is limited to simulated notifications, appointment guidance and status communication. It must not expose unnecessary clinical information.

## 4. MVP functional requirements

### FR-01 Authentication and RBAC
- Secure login.
- Role-aware navigation and permissions.
- Demo roles: Referring Clinician, Receiving Coordinator, Facility Manager, District Manager, Administrator.
- Session timeout and logout.

### FR-02 Referral Command Centre
Display:
- Open Referrals
- Awaiting Acceptance
- Scheduled
- Appointments Due
- Overdue Referrals
- Missing Information
- Missed Appointments
- Referral Leakage / Stale Referrals
- Closed Referrals
- Facility workload indicators

Filtering:
- Date range
- Facility
- Service / specialty
- Status
- Priority
- Assigned user
- Exception type

### FR-03 Digital Referral Workspace
Users with permission can:
- Create a referral.
- Select a synthetic patient.
- Select referral reason and service required.
- Record administrative priority classification.
- Choose or confirm destination facility/service.
- Attach or simulate supporting documents.
- Add notes.
- Submit referral.
- View status history.
- Request information.
- Accept / decline / redirect with reason.
- Schedule appointment.
- Mark attended / missed / cancelled.
- Close referral with feedback.

### FR-04 Facility & Service Directory
- Search facilities and services.
- Show facility type, location text, available services, operating information and routing notes.
- Support configuration of referral pathways.
- For demo purposes, use synthetic or clearly designated demonstration directory data where live authoritative data is unavailable.

### FR-05 Patient Journey Timeline
Every referral displays a chronological event history including:
- Referral created
- Submitted
- Received
- Accepted / declined / redirected
- Information requested / supplied
- Appointment proposed / confirmed
- Patient notification sent
- Attendance outcome
- Feedback returned
- Closed
- Reopened

Each event should include actor, timestamp, facility, event type and relevant reason.

### FR-06 Exception Detection
Rules-based operational detection for:
- Awaiting acceptance beyond configured threshold.
- Missing required information.
- Appointment not confirmed.
- Missed appointment with no follow-up.
- Referral stale with no state transition.
- Feedback missing after attendance.
- Referral returned / declined repeatedly.

The system may prioritise exceptions but may not infer clinical urgency beyond approved structured inputs.

### FR-07 Ayanda AI Assistant
Persistent assistant across pages supporting text and voice.

Permitted behaviours:
- Explain the current page.
- Navigate to pages.
- Search referrals.
- Summarise referral status.
- Explain operational exceptions.
- Create drafts for referrals, tasks or notes.
- Execute authorised low-risk workflow commands.
- Request confirmation before consequential changes.

Examples:
- “Show referrals waiting more than 24 hours.”
- “Open the referral for demo patient Thandi Mokoena.”
- “Which facilities have the most unresolved referrals?”
- “Create a follow-up task for this referral.”
- “Explain why this referral is flagged.”

Prohibited behaviours:
- Autonomous diagnosis.
- Prescribing or treatment recommendation.
- Unsupervised clinical triage.
- Overriding clinical staff.
- Disclosing patient data outside the requesting user’s authorisation scope.

### FR-08 Multilingual interaction
Target demo languages:
- English
- Afrikaans
- isiZulu
- isiXhosa
- Sesotho
- Setswana
- Sepedi
- Xitsonga
- Tshivenda
- siSwati
- isiNdebele

The interface should allow language selection and use one consistent assistant identity. Translation quality must be treated as assistive and not assumed clinically validated.

### FR-09 Notifications
Simulate or implement a provider abstraction for:
- SMS
- WhatsApp
- Email
- In-app notification

Notification templates should include only the minimum information required for the purpose.

### FR-10 Analytics
Operational metrics:
- Referral volume
- Awaiting acceptance count
- Median acknowledgement time
- Median scheduling time
- Completion rate
- Missed appointment count
- Stale referral count
- Feedback completion
- Volume by facility/service

Do not claim measured healthcare outcome improvement unless supported by actual validated evidence.

### FR-11 Auditability
Audit all material actions:
- Login / logout
- Record view where appropriate
- Referral create / update / close
- Assignment change
- Status transition
- Data export
- Role / permission change
- AI-assisted command execution

Capture actor, time, action, object, before/after where applicable, source and correlation ID.

## 5. Non-functional requirements

### NFR-01 Security
- Secure-by-default configuration.
- Least privilege.
- Server-side authorisation for all protected operations.
- Parameterised database access / ORM.
- Input validation and output encoding.
- CSRF protection where relevant.
- Secure cookies and headers.
- Rate limiting on authentication and AI endpoints.
- No secrets committed to Git.

### NFR-02 Privacy
- POPIA-aware handling of health information as special personal information.
- Data minimisation.
- Purpose limitation.
- Configurable retention.
- Access logging.
- De-identification / aggregation for oversight analytics where feasible.

### NFR-03 Performance
- Target perceived navigation response under 500 ms for local/demo operations where feasible.
- Optimistic UI only where rollback is safe.
- Stream AI responses where supported.
- Avoid serial network calls when parallel retrieval is safe.

### NFR-04 Availability / resilience
- Graceful error states.
- Retry only idempotent operations automatically.
- Preserve unsaved referral drafts locally when safe.
- Clear offline / degraded-state messaging.

### NFR-05 Accessibility
- Keyboard navigable.
- Sufficient contrast.
- Semantic labels.
- Screen-reader-aware controls.
- Responsive desktop, tablet and mobile layouts.

### NFR-06 Observability
- Structured application logs.
- Request / correlation IDs.
- Error logs without unnecessary patient data.
- Security event logs.
- AI action logs.

## 6. Demo acceptance criteria

The hackathon MVP is successful when a judge can observe the following end-to-end flow using synthetic data:

1. User signs in.
2. Command Centre shows referral workload and exceptions.
3. User asks Ayanda to create or open a referral.
4. Referral is created and destination is recommended from configured service-directory rules.
5. Human confirms destination and submission.
6. Receiving coordinator accepts and schedules it.
7. Patient notification is simulated.
8. A separate stale referral is detected and surfaced as an exception.
9. Ayanda explains the exception and opens the record.
10. User executes a follow-up action with confirmation.
11. Audit trail shows the sequence.
12. Analytics reflect updated workflow state.

## 7. Explicit prototype limitations

- Synthetic data only unless authorised otherwise.
- No claim of NDoH endorsement.
- No claim of clinical validation.
- No claim of production interoperability unless a real interface has been implemented and tested.
- No autonomous clinical decisions.
- No unverified facility-capacity claims presented as live operational truth.
