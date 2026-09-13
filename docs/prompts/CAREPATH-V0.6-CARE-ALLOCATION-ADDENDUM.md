# CarePath AI v0.6 — Care Allocation & Patient Flow Addendum

This addendum extends the canonical CarePath master prompt. It formalises CarePath as a complete care-allocation and patient-flow platform rather than a referral-only application.

## North-star process

`Patient identified → longitudinal record reviewed → care need defined → province/city selected → receiving facility shortlisted → service match checked → bed/capacity checked → allocation submitted → receiving facility accepts/redirects/requests information → appointment/admission booked → ambulance/transfer arranged when required → patient arrives → encounter/treatment occurs → outcome/feedback recorded → referring care team receives closure → journey closed`

The patient must remain digitally visible throughout this flow.

## Care Allocation Centre

The platform must include a first-class Care Allocation Centre that lets authorised referring users:

- select an authorised patient;
- review longitudinal history and provenance;
- select required service and urgency;
- select province and city;
- compare eligible receiving hospitals/clinics;
- confirm that the destination actually provides the requested service;
- review synthetic bed availability by bed type;
- choose outpatient versus admission-required flow;
- select General, High Care, ICU, Maternity or Paediatric bed type when required;
- review appointment/admission timing;
- review compatible ambulance availability and synthetic ETA;
- select Basic, Advanced, ICU or Neonatal transport level where required;
- create and submit the allocation;
- see safe alternatives when capacity is unavailable.

CarePath may recommend or shortlist destinations using explainable administrative criteria, but must not present the recommendation as a clinical decision or unvalidated hospital-quality ranking.

## Receiving-facility workflow

Receiving clinicians/coordinators must be able to:

- see incoming allocations;
- access the patient record within the authorised active-care relationship;
- review referral reason, allergies, conditions, medications, recent results and encounters;
- inspect provenance/source facility;
- view their own services and capacity;
- receive the allocation;
- request more information;
- accept;
- decline;
- redirect;
- book appointment/admission;
- trigger patient notification;
- coordinate transfer;
- record encounter/outcome;
- provide structured feedback to the referring team;
- close the loop.

## Journey stages

CarePath must make the journey status visually explicit:

1. Patient context
2. Care need
3. Destination selection
4. Capacity validation
5. Allocation/referral submitted
6. Receiving acceptance
7. Appointment/admission booking
8. Ambulance/transport
9. Arrival and care delivery
10. Outcome and return feedback
11. Closure

Every journey must have an accountable current stage and next action.

## Appointment and capacity controls

Capacity must be checked during destination selection and rechecked at appointment/admission booking. Admission-dependent booking must fail safely when the required synthetic bed type is unavailable and should return compatible alternatives.

Booking must continue to reserve capacity according to the existing v0.3 rules.

## Ambulance / transfer dependency

Transport planning must be part of allocation rather than an unrelated page.

- show compatible available ambulances during planning;
- do not dispatch merely because a referral draft exists;
- dispatch/request transport after the receiving destination has accepted the patient, unless an emergency workflow explicitly requires otherwise;
- revalidate bed availability before transfer where relevant;
- show Requested → Assigned → En Route → Patient On Board → Arrived → Completed;
- surface unresolved transport as a CarePath Watch dependency.

## Role-driven workflow

Referring clinician:
- review patient history;
- select destination/capacity/transport requirements;
- submit allocation;
- book after acceptance where authorised;
- follow the journey through closure.

Receiving specialist / coordinator:
- receive;
- accept/decline/redirect/request information;
- schedule;
- manage care hand-off;
- record outcome and feedback.

Nurse:
- receiving-facility continuity context;
- check-in/arrival;
- appropriate transfer progression;
- care-navigation updates.

Patient navigator:
- appointments;
- patient communication;
- transport/follow-up support.

Manager:
- aggregated patient-flow, capacity, SLA and transfer views;
- no routine unrestricted patient-record browsing.

Patient:
- own journey, appointments, notifications, transfers, medications/vaccines and Health Passport.

## Full platform requirement

CarePath must not be presented as only a referral system. The integrated product comprises:

- OneRecord;
- Care Allocation & Patient Flow;
- Referral / Journey engine;
- Appointment Management Centre;
- Exchange & Facility Directory;
- Bed Capacity Management;
- Ambulance & Patient Transfer Management;
- Medication & Vaccine Management;
- Notifications;
- Health Passport / Patient Portal;
- Healthcare Professional Workspace;
- Emergency / Break Glass;
- Consent & Identity / MPI abstraction;
- CarePath Watch;
- National/Provincial/District/Facility Command Centre;
- Population Health Intelligence;
- Interoperability/FHIR gateway;
- Ayanda governed voice/text assistant;
- audit, provenance and governance controls.

## Demo truth

All current patient, bed, ambulance, hospital outcome and facility-capacity information is synthetic unless a future release explicitly connects and verifies an approved live source. The user interface must say so clearly.

## Definition of done

The v0.6 care-flow layer is complete when:

- Care Flow is a first-class navigation option;
- authorised referrers can select patient, service, province, city, destination, bed requirement and ambulance requirement;
- facility candidates are filtered by service/geography/capacity;
- destination capacity is visible;
- ambulance availability is visible;
- creating an allocation generates a governed referral and submits it;
- receiving roles can receive and accept it;
- appointments can be booked after acceptance;
- transport can be requested after acceptance;
- transfer lifecycle can be progressed by authorised roles;
- patient history remains visible to the authorised referring/receiving care team;
- outcome and closure can be recorded;
- an end-to-end journey board shows the current stage and next dependency;
- mobile/responsive layouts remain usable;
- typecheck, tests and production build pass;
- deployed runtime can be traced to the exact Git commit.
