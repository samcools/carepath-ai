# CarePath AI — Domain Data Model

## 1. Modelling principles

- Use UUIDs for primary identifiers.
- Store timestamps in UTC and render in user locale.
- Separate identity, clinical-context metadata and workflow data where practical.
- Prefer explicit state transitions over free-form status strings.
- Use synthetic patient data for hackathon demos.
- Keep the internal model mappable to FHIR-compatible concepts without claiming formal conformance certification.

## 2. Core entities

### User
Fields:
- id
- firstName
- lastName
- email
- phone (optional)
- roleId
- primaryFacilityId
- status
- preferredLanguage
- createdAt
- updatedAt
- lastLoginAt

### Role
Fields:
- id
- code
- name
- permissions[]

Suggested roles:
- REFERRING_CLINICIAN
- RECEIVING_COORDINATOR
- FACILITY_MANAGER
- DISTRICT_MANAGER
- ADMIN

### Facility
Fields:
- id
- code
- name
- facilityType
- district
- province
- addressText
- latitude (optional demo metadata)
- longitude (optional demo metadata)
- phone
- email
- status
- operatingHoursJson

### Service
Fields:
- id
- code
- name
- category
- description
- active

### FacilityService
Fields:
- id
- facilityId
- serviceId
- availabilityStatus
- referralInstructions
- contactChannel
- routingPriority

Do not present `availabilityStatus` as real-time truth unless connected to an authoritative source.

### Patient
Hackathon fields:
- id
- syntheticIdentifier
- firstName
- lastName
- dateOfBirth
- sexAtBirth (only if needed by demo)
- phone
- preferredLanguage
- residentialArea
- consentContactPreference
- isSynthetic = true
- createdAt
- updatedAt

Avoid adding unnecessary sensitive fields merely to make the demo look realistic.

### Referral
Fields:
- id
- referralNumber
- patientId
- referringFacilityId
- referringUserId
- destinationFacilityId
- serviceId
- assignedCoordinatorId (nullable)
- status
- administrativePriority
- referralReason
- summary
- submittedAt
- receivedAt
- acceptedAt
- closedAt
- createdAt
- updatedAt
- version

### ReferralRequirement
Fields:
- id
- referralId
- requirementCode
- label
- required
- satisfied
- satisfiedAt
- satisfiedBy

### ReferralEvent
Fields:
- id
- referralId
- eventType
- fromStatus
- toStatus
- actorUserId
- actorFacilityId
- reasonCode
- note
- sourceChannel
- createdAt

### Appointment
Fields:
- id
- referralId
- facilityId
- scheduledStart
- scheduledEnd
- status
- bookingReference
- createdBy
- createdAt
- updatedAt

Statuses:
- PROPOSED
- CONFIRMED
- RESCHEDULED
- CANCELLED
- ATTENDED
- MISSED

### Task
Fields:
- id
- referralId (nullable)
- title
- description
- assignedUserId
- assignedFacilityId
- dueAt
- status
- priority
- createdBy
- completedAt
- createdAt
- updatedAt

### Document
Fields:
- id
- referralId
- documentType
- fileName
- storageKey
- mimeType
- sizeBytes
- uploadedBy
- createdAt

For the hackathon, use safe demo files only.

### Notification
Fields:
- id
- patientId
- referralId
- channel
- destinationMasked
- templateCode
- language
- status
- providerMessageId (nullable)
- sentAt
- deliveredAt (nullable)
- createdAt

### ExceptionRule
Fields:
- id
- code
- name
- description
- thresholdMinutes (nullable)
- enabled
- severity
- configurationJson

### ReferralException
Fields:
- id
- referralId
- ruleId
- status
- detectedAt
- resolvedAt
- resolvedBy
- resolutionNote

### AuditEvent
Fields:
- id
- actorUserId (nullable for system events)
- actorRole
- facilityId
- action
- objectType
- objectId
- sourceChannel
- correlationId
- outcome
- beforeHash (optional)
- afterHash (optional)
- metadataJson (sanitised)
- createdAt

### AIInteraction
Fields:
- id
- userId
- facilityId
- sessionId
- language
- channel (TEXT | VOICE)
- intent
- toolName (nullable)
- toolOutcome (nullable)
- confirmationRequired
- confirmationReceived
- latencyMs
- createdAt

Do not store raw prompts/transcripts indefinitely by default. Retention must be configurable and privacy-aware.

## 3. Referral state enum

- DRAFT
- SUBMITTED
- RECEIVED
- INFO_REQUESTED
- ACCEPTED
- DECLINED
- REDIRECTED
- SCHEDULED
- PATIENT_NOTIFIED
- ATTENDED
- MISSED
- CANCELLED
- FEEDBACK_PENDING
- FOLLOWUP_REQUIRED
- CLOSED
- REOPENED

## 4. Suggested indexes

- Referral(status, updatedAt)
- Referral(destinationFacilityId, status)
- Referral(referringFacilityId, status)
- Referral(serviceId, status)
- Referral(patientId, createdAt)
- ReferralEvent(referralId, createdAt)
- Appointment(referralId, scheduledStart)
- Task(assignedUserId, status, dueAt)
- ReferralException(status, detectedAt)
- AuditEvent(objectType, objectId, createdAt)
- AuditEvent(actorUserId, createdAt)

## 5. FHIR-compatible conceptual mappings

| CarePath entity | FHIR-compatible concept |
|---|---|
| Patient | Patient |
| User / clinician | Practitioner / PractitionerRole |
| Facility | Organization / Location |
| Service / referral | HealthcareService / ServiceRequest |
| Workflow task | Task |
| Appointment | Appointment |
| Document | DocumentReference |
| Notification | Communication / CommunicationRequest |
| AuditEvent | AuditEvent |
| ReferralEvent provenance | Provenance / AuditEvent |

These mappings are architectural guidance only until profiles and interoperability specifications are formally selected and tested.
