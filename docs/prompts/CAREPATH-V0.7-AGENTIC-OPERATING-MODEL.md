# CarePath AI v0.7 — Governed Multi-Agent Operating Model

This specification extends the canonical CarePath master prompt. It is mandatory for subsequent builds unless explicitly superseded.

## 1. Journey reference

Every patient-care engagement must have a stable CarePath Journey Reference in this format:

`CPJ-YYYY-######`

The same reference must be used across the referral/hand-off, appointment, bed allocation, ambulance transfer, patient communication, agent proposals, approval decisions and audit discussion for that care journey.

A user must be able to quote the reference to locate and discuss the journey without relying only on a patient name.

## 2. Agent value framework

Every CarePath agent must be described using this exact structure:

> Today, **[user group]** struggles with **[problem]**. This causes **[impact]**.  
> Our primary user is **[user]**.  
> They want to **[outcome]**.  
> Our **[agent name]** agent helps by **[understand]**, **[reason]**, and **[act]**. It will **[key actions]**.  
> The agent assists with decisions, but **[human role]** remains responsible for final approval.  
> We will measure success through **[metric 1]**, **[metric 2]**, and **[metric 3]**.  
> In summary, our agent helps **[user]** achieve **[outcome]** faster, simpler, and with less effort.

The executable catalogue in `apps/api/src/agentCatalogue.ts` stores the filled fields for every agent and generates the complete value statement from this structure.

## 3. Permission-before-execution rule

CarePath agents may autonomously:

- observe authorised data;
- understand context;
- reason over configured rules and evidence;
- monitor workflows;
- prepare recommendations;
- prepare a proposed task.

They may **not execute an agent task until the authorised user has explicitly approved it**.

Every executable action therefore follows:

`Understand → Reason → Prepare → Show user → Ask permission → Approve/Reject → Execute if approved → Audit`

Creating a proposal is not execution. A proposal must visibly show the agent, Journey Reference, requested action, rationale and requesting user. Rejection performs no task. Approval must be auditable.

This permission rule applies even to low-risk demo actions. Restricted clinical actions remain human-controlled even after approval and must never be delegated to autonomous execution where prohibited by CarePath clinical-safety policy.

## 4. Agent Centre

The platform must provide one Agent Centre showing:

- all agents;
- agent category;
- Active/Monitoring status;
- autonomy boundary;
- current operational metric;
- the completed value framework;
- CarePath Journey Reference selector;
- task preparation;
- approval queue;
- Approve & Execute / Reject controls;
- completed/rejected proposal history;
- audit evidence.

## 5. CarePath agent catalogue

1. Patient Journey Agent
2. Referral Orchestration Agent
3. Facility Matching Agent
4. Bed Capacity Agent
5. Ambulance Allocation Agent
6. Appointment Scheduling Agent
7. CarePath Watch Agent
8. Medication Reconciliation Agent
9. Vaccine Management Agent
10. Results Follow-up Agent
11. Discharge & Follow-up Agent
12. Patient Communication Agent
13. Consent & Access Agent
14. Emergency Access Agent
15. Identity Resolution Agent
16. Interoperability Agent
17. Data Quality Agent
18. Clinical Document Agent
19. Population Health Agent
20. Command Centre Agent
21. Audit & Compliance Agent
22. Cybersecurity Agent
23. AI Governance Agent
24. Ayanda Orchestrator

## 6. Ayanda orchestration

Ayanda is the user-facing orchestration layer rather than a replacement for the specialist agents.

Execution pattern:

`User → Ayanda → Intent → Journey Reference → Specialist Agent(s) → Understand → Reason → Prepared plan → Explicit user permission → Authorised tool/API → Audit → Result`

Ayanda must explain which agents it intends to use before asking for permission to execute the prepared plan.

Example:

> “For CPJ-2026-123456, I can use the Facility Matching Agent, Bed Capacity Agent, Appointment Scheduling Agent and Ambulance Allocation Agent to prepare this transfer. I will show you the proposed plan before anything is executed.”

## 7. Clinical-safety boundary

No CarePath agent may autonomously:

- diagnose;
- prescribe or stop medication;
- make unsupervised clinical triage decisions;
- discharge a patient;
- merge/unmerge patient identities;
- grant Break Glass access without the required authorised human and re-authentication;
- rank real hospitals on unadjusted mortality/recovery data;
- override a clinician;
- fabricate capacity, availability, results or patient facts.

## 8. Definition of done

The agentic operating model is complete for the hackathon when:

- all 24 agents are visible in the Agent Centre;
- every agent is expressed using the required value framework;
- every care journey can expose a `CPJ-YYYY-######` reference;
- agent proposals require a Journey Reference;
- proposals are `PENDING_APPROVAL` before execution;
- the user must explicitly approve or reject;
- approved and rejected decisions are audited;
- Ayanda can explain and route to specialist agents;
- the Agent Centre is responsive on desktop, tablet and mobile;
- no agent crosses the clinical-safety boundary;
- CI typecheck, tests and production build pass.
