# CarePath AI — Security, Privacy and Responsible AI Baseline

## 1. Governance position

CarePath AI is a referral-orchestration and patient-navigation platform. The hackathon prototype must use synthetic patient data and must not be represented as clinically validated, production deployed, NDoH approved, SAHPRA approved, or connected to live public-health systems unless those facts become demonstrably true.

CarePath AI must preserve human accountability for clinical decisions and consequential workflow actions.

## 2. South African regulatory context

The design should be implemented with regard to applicable South African law and health-sector policy, including:

- Protection of Personal Information Act 4 of 2013 (POPIA).
- National Health Act 61 of 2003 and applicable confidentiality / records obligations.
- National Health Insurance Act 20 of 2023 where applicable and once relevant provisions are in force.
- National Department of Health referral policy and implementation guidance.
- Applicable provincial and institutional security, records-management and clinical-governance requirements.

Health information is treated as sensitive / special personal information and requires heightened controls.

Official references:
- https://www.gov.za/documents/protection-personal-information-act
- https://www.gov.za/documents/acts/national-health-insurance-act-20-2023-english-afrikaans-16-may-2024
- https://knowledgehub.health.gov.za/elibrary/referral-policy-south-african-health-services-and-referral-implementation-guidelines

This document is an engineering governance baseline, not legal advice.

## 3. Privacy-by-design requirements

### 3.1 Data minimisation
Only collect fields necessary for referral coordination, identity matching, communication, audit and approved analytics.

### 3.2 Purpose limitation
Data gathered for referral coordination must not silently be repurposed for unrelated profiling, marketing or model training.

### 3.3 Access limitation
- RBAC plus facility / organisational scope.
- Default deny.
- Server-side checks for every protected operation.
- Sensitive detail hidden from aggregated management views unless required.

### 3.4 Retention
- Retention rules must be configurable.
- Prototype seed data may be reset safely.
- Production retention must follow legal, clinical and institutional requirements that are formally approved before deployment.

### 3.5 Data subject rights
Production design should accommodate authorised workflows for access, correction, restriction or deletion where legally appropriate, while preserving records that must lawfully be retained.

### 3.6 Cross-border processing
Do not send identifiable health data to third-party AI or cloud services across borders without an approved legal, contractual and security basis.

## 4. Security controls

### Identity
- Strong password policy for local demo users.
- Prefer enterprise identity / MFA for future production.
- Secure session cookies.
- Session expiry and revocation.
- Brute-force / credential-stuffing rate limits.

### Authorisation
- Role and scope checked server-side.
- Object-level access checks.
- Privileged admin operations separately guarded.
- No trust in hidden frontend controls as an enforcement mechanism.

### Application security
- Input schema validation.
- Output encoding.
- Parameterised database access / ORM.
- CSRF protection where relevant.
- Content Security Policy.
- HSTS in production.
- Secure headers.
- Dependency scanning.
- Secret scanning.
- No credentials in repository history.

### API security
- Authenticated endpoints by default.
- Explicit public endpoint inventory.
- Rate limiting.
- Request size limits.
- Idempotency keys for suitable write operations.
- Correlation IDs.

### Data security
- Encryption in transit.
- Encryption at rest where supported.
- Separate secrets from application code.
- Backups protected to equivalent standards.
- Demo exports watermarked / labelled as synthetic where practical.

## 5. AI governance

### 5.1 Allowed AI functions
Ayanda may:
- explain the interface;
- find authorised records;
- summarise referral workflow status;
- explain why an operational rule fired;
- draft referrals, notes and tasks;
- recommend a destination from approved configured referral/service rules;
- execute authorised administrative actions after permission and confirmation checks.

### 5.2 Prohibited AI functions
Ayanda must not:
- diagnose a patient;
- prescribe medication;
- recommend treatment as an autonomous clinical authority;
- infer emergency severity from free text and act without approved clinical logic;
- override an authorised healthcare professional;
- fabricate facility capacity, appointments or patient facts;
- reveal records outside user scope;
- silently execute high-impact actions.

### 5.3 Human confirmation
Require explicit confirmation before actions such as:
- submitting a referral;
- accepting / declining / redirecting a referral;
- scheduling / cancelling an appointment;
- closing a referral;
- sending a patient-facing message containing sensitive information;
- exporting patient-level data.

### 5.4 Grounding and provenance
AI responses about a referral should distinguish:
- stored facts;
- configured policy/rule results;
- model-generated explanation or suggestion.

Whenever feasible, surface the source record or rule that supports an operational recommendation.

### 5.5 Prompt-injection resistance
- Treat patient notes, uploaded documents and external content as untrusted data, not instructions.
- Tool permissions are outside the model.
- Never expose system prompts, secrets or credentials.
- Validate model tool arguments server-side.

## 6. Voice safety

- Display transcript for consequential commands.
- Ask for confirmation before write operations.
- Do not rely on voice recognition alone for authentication.
- Offer keyboard/text fallback.
- Do not read sensitive patient information aloud unless the authenticated user explicitly requests it and the context is appropriate.

## 7. Audit requirements

Audit events should cover at minimum:
- authentication events;
- patient/referral record access where required;
- referral creation and state transitions;
- assignment changes;
- document access/download;
- export;
- role/permission changes;
- AI tool calls and action outcomes;
- administrative configuration changes.

Audit records should be append-oriented and protected from ordinary user modification.

## 8. Analytics governance

- Prefer aggregated or de-identified metrics for district/provincial views.
- Suppress small cohorts where re-identification risk exists in real deployments.
- Do not rank clinicians or facilities using opaque AI scoring.
- Operational metrics should be explainable from underlying workflow timestamps and events.

## 9. Incident readiness

Future production design should provide:
- security event classification;
- breach escalation workflow;
- account/session revocation;
- evidence-preserving logs;
- incident communication procedures;
- recovery and lessons-learned process.

## 10. Hackathon security acceptance criteria

- No secrets committed.
- Synthetic patient data only.
- RBAC enforced server-side.
- Protected routes reject unauthorised requests.
- AI write actions require permission checks and confirmation.
- Audit events appear after material workflow changes.
- Logs do not dump full patient objects unnecessarily.
- Security headers enabled.
- Dependency audit executed in CI.
- Demo disclaimers visible in appropriate admin/about areas.
