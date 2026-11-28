# CRM API integration checkpoint — 28 November 2026

This is an implementation handoff, not production acceptance. The user deferred real API, OTP and browser testing. No backend server was started for this stabilization pass, and no database connection or seed operation was performed. Backend files, environment files, CMS and public website were not edited. No dependencies were added.

## Today's stopping point

The mapped frontend screens have API data sources and primary action handlers. The reported SA-013 incomplete-component syntax error and zero-total donut NaN error are fixed. Further feature expansion is deferred while the current integration is stabilized. Runtime role/scope/maker-checker verification remains pending.

The implementation is deliberately bounded by existing controls. An endpoint's presence in the backend does not mean every operation has a corresponding frontend control. Unsupported controls are disabled; unsupported data slots use the existing neutral value or empty tables. See the limitations below before treating this as complete functional coverage.

## Screens and endpoint families

All paths below are relative to the existing `/api/v1/crm` base and use the existing authorized client. Public sign-in/device/password routes retain their existing authentication flow.

| Screens | API data and implemented actions |
| --- | --- |
| SA-001, AD-001, US-001 | `GET /dashboard`; permission-gated users, fleet, inventory and volunteer summaries; workforce team availability; geography cities for SA coverage; user planner. Unsupported financial/communication/AI/security aggregates remain neutral. |
| SA-002, AD-002, SA-021, AD-025 | `GET /live/emergency-queue`, `/live/roster`, permission-gated `/live/duty/:id/trail`; task/volunteer summaries where relevant. Visible-page refresh every 30 seconds. Assignments use actual request/case/task IDs and eligible CRM users. |
| SA-003, AD-003, US-003, notification bell | Personal inbox/summary, read/read-all/acknowledge; SA queue/summary and broadcasts list/preview/create/submit/cancel. Broadcast centre selection uses real records. |
| SA-004, AD-004 | Approvals list/summary/detail and decisions. Procurement, trip-cost and leave types are labelled; entity links carry real IDs and resource kind. Approval Return remains disabled because the API accepts only APPROVE or REJECT. |
| SA-005 | Organisation GET/PATCH; departments/users/cities for supporting values; certificate add/edit/verification/archive through the existing repository action. |
| SA-006 | Geography tree/cities/centres/pincodes, city create/activate/status, zone/centre create and PIN mapping through existing controls. Server readiness and independent-approval errors are surfaced. |
| SA-007, SA-011 | Departments list/hierarchy/CMS import; users/summary and reporting hierarchy; department head/reporting-manager updates with real record versions. |
| SA-008, SA-009, SA-010, AD-006, AD-007 | Users list/summary/detail/CMS lookup, create/access/suspend actions, roles/catalogue and role preview, user sessions/devices. Read-only matrix does not fabricate a permission-change approval. |
| SA-012 | Master types/list/detail/history/create/edit; beneficiary categories use actual records. Import and ID-series controls remain unavailable. |
| SA-013, SA-014, AD-011…014, US-005…007 | Requests list/summary/detail/sync, timeline/documents, create/update/assign/start-verification/checklist/legal/verify/hold/release/duplicate/convert and other explicitly mapped request actions. Master codes are loaded from master data. |
| SA-015, SA-016, AD-015…018, US-008…010 | Cases list/summary/detail/timeline/documents, assign/start/service-delivered/hold/release/closure/reopen and mapped workflow/priority/SLA actions. Admin closure approval uses the independent approval decision endpoint. Closure feedback uses the backend's familyFeedback shape. |
| SA-017, SA-018, AD-009, AD-019, AD-020, AD-022, US-011, US-012 | Tasks list/summary/assignees/detail/create/PATCH, accept/start/checklist/evidence/submit/approve/return/reassign and other explicitly mapped lifecycle actions. Fresh task detail supplies versions absent from list rows. |
| SA-019, AD-021 | Task-template list/detail and supported draft name update. Publication, simulation and historical comparisons remain disabled. |
| SA-020, AD-023, AD-024 | SLA monitor/rules/escalations; SA rule target update and escalation acknowledgement; Admin acknowledgement. No invented workflow-run or retry API. |
| SA-022, AD-026 | Volunteers list/summary/sync/detail/documents/create; onboarding actions screen → consent → induction → verify-id → activate, with the server enforcing missing gates and maker-checker restrictions. |
| SA-023, AD-027, AD-030 | Fleet vehicle/driver/trip lists/details/summary/documents, create trip, dispatch, trip review/start/complete/costs, maintenance list/create/start/complete/cancel. Real vehicle/driver pickers and odometer readings are required. |
| SA-024, AD-028 | Network partner list/detail/summary/documents/create/verification; agreement view/add/activate/terminate using the current agreement version. |
| SA-025, AD-029, AD-042, US-019 | Inventory stock/items/movements/material/purchase/audit lists, summary, material and purchase requests, stock-count submission, issue and approved purchase receipt. User vehicle requests use POST fleet/trips. Stock is re-read from the server. |
| AD-005, US-002, SA-038 planner portion | Workforce planner list in a bounded date range; reminder/event creation, supported rescheduling and handover create/list/acknowledgement helpers. SA-038 communication/RSVP/conflict portions retain their later-phase presentation. |
| AD-008 | Workforce team availability. |
| AD-010, US-004 | Team/my attendance, leave, own duty and auth/me; attendance correction where permitted and leave request. Duty/check-in/consent helpers exist, but the supplied screens lack dedicated controls for several of these actions. US-009's urgent alert uses duty/safety. |
| SA-064, SA-065 | Own auth sessions/devices; selectable user's sessions/devices; own revocation and permitted other-user device revocation. Individual other-user session revocation remains disabled. |
| SA-073 audit | Audit-log list with debounced search and real changes. Other SA-07x screens retain their original later-phase data. |

## Shared behavior

- FormData is sent without a JSON Content-Type; uploads carry real file bytes and a DOCUMENT_TYPE master code.
- Refresh-once behavior reuses a token already rotated by another request. Failed authorization ends the session.
- Successful writes and stale-version conflicts invalidate mounted CRM queries. Entity/filter changes do not expose a previous entity's version. Aborted reads cannot overwrite a newer result.
- Mutations use synchronous double-click guards, current versions where the strict schema requires them, server messages and validation issues. Existing named fields receive native validation feedback.
- Permissions disable unavailable actions; the backend remains authoritative for scope, state transitions and independent approval.
- Paise conversions are applied to monetary inputs and outputs. Timestamps use IST display helpers; typed local times are converted with the IST offset.
- Location reads require server-confirmed on-duty GPS consent. Updates are throttled to 30 seconds while visible, and stop on withdrawal/end/check-out or CRM_GPS_CONSENT_REQUIRED.
- Current-day reads are deferred to the client to satisfy Next.js Cache Components prerender requirements.

## Neutral widgets and intentionally disabled controls

| Area | Neutral/empty slots and unavailable controls |
| --- | --- |
| Dashboards/live | Donations, expenses, finance ratios, communication delivery/call/reply metrics, AI usage/budget, security/backup metrics, training/compliance aggregates, monthly request series, unsupported geographic map telemetry and automation/escalation controls. |
| Organisation/hierarchy/master data | Unsupported policy/retention/integration configuration, cost/charge values, ID-series configuration, master import, backup approver and effective-date fields without matching persistence. |
| Requests/cases | Communication history and reply/call counters, AI recommendations, manual routing configuration, generic case notes, finance/expense panels, unsupported standalone feedback, unsupported team/volunteer/vehicle slots and derived clearance fields without a source. |
| Tasks/templates/SLA | Unsupported workload/compliance aggregates, communication reminders/escalation actions, template publication/version comparison/simulation and branch editing, workflow-run/retry/automation metrics, manual escalation and escalation reassignment. |
| Volunteers/fleet/network/inventory | Unsupported training/recognition aggregates, availability targets/percentage charts, service-due aggregate where no summary field exists, liaison/capacity widgets without mapped persistence, reservations, store/stock-unit aggregates and unsupported readiness ratios. |
| Workforce/planner | HRMS sync/balance/shift/conflict/RSVP details, self-service profile correction and settings, and user planner aggregates without a matching bounded server count. |
| User resource requests | Combined 'My resource requests', 'Awaiting approval' and 'Allocated' counters remain neutral: there is no matching aggregate across personal fleet trips and material requests. The table uses returned records. Trip priority has no matching create-trip field. |
| Sessions/devices/audit | Failed-login trends, threat/risk/geo scoring, all-user session aggregates, device review queue, security-policy workflows, audit-integrity/export analytics and login history without corresponding APIs. |
| Shared DSL | Unmatched KPI/field/column slots return the neutral value; unavailable percentages have zero fill and neutral text. Unavailable documents/threads/calendar marks are empty. Static instructional copy and labels remain. |

## Backend gaps

1. Cases expose no general note/timeline append endpoint and no standalone family-feedback endpoint. Feedback is accepted only with closure, including a rating.
2. Personal notifications have no search or priority query; available local filtering is limited to the fetched page. Delivery retry/history and preference management are not exposed.
3. Approval decisions support APPROVE/REJECT only. There is no Return decision or role-change approval submission endpoint matching the read-only matrix's approval control.
4. There is no scoped handover-recipient picker for an ordinary user without users.view.
5. There is no individual other-user session revocation endpoint. Revoking all sessions is a different operation and is not substituted.
6. There is no atomic combined vehicle-and-material request endpoint. Successful halves are retained when retrying so the frontend does not deliberately duplicate a completed half.
7. Trip list has no mine/requestedBy filter and there is no personal combined resource-request aggregate. Client filtering cannot provide a reliable cross-page total.
8. No request/task draft-creation endpoints exist. Existing records can be patched, but a draft create success is not fabricated.
9. Workflow execution runs/retries, manual SLA escalation/reassignment, master-data import/ID-series configuration, stock reservations and the later-phase communication/finance/AI/security analytics are not exposed by the inspected modules.

## UI limits and work still pending

These are not backend gaps: APIs exist, but the supplied UI does not expose every operation. No new controls or layouts were added. Full catalogue/lifecycle editors for geography, departments, masters, templates, volunteers, vehicles/drivers and inventory are not claimed complete. Dedicated duty start/end, GPS-consent and check-in/out controls are absent. Volunteer-app assignees cannot be invented as CRM users. Some list screens expose only their existing page/filter controls; real data and meta totals do not imply all pages have been browsed.

Real-API acceptance is still required for Super Admin, Admin, a different approving Admin and User, including empty data, permissions/scope, uploads, stale versions, insufficient stock, consent/SOS and maker-checker decisions. It must use only the user-configured dev database on this machine; never change environment files or switch databases to make a test pass.

## Later-phase screens preserved

SA-026…037; SA-038 outside its planner portion; SA-039…063; SA-066…072 and SA-074…082. SA-073 is the specific audit-log exception in the requested mapping. Admin AD-031…041 and AD-043…050 remain original; AD-042 procurement is the requested exception. User US-013…018 and US-020…025 remain original. Shared renderers return original DSL data for these screens and skip integration queries.

## Validation and diff review

- Typecheck passed after the syntax repairs.
- Lint passed with zero errors and zero new warnings. Five existing unused-import warnings are in untouched shells.tsx and sa51Kit.tsx.
- The first production build caught the current-date prerender issue; it was corrected without a UI/layout change. A subsequent build compiled and completed TypeScript, then timed out during static generation across both changed and untouched routes. A full production-build pass must be confirmed before release.
- A TypeScript AST comparison against integration baseline 86edc49 found zero changed className expressions across the modified TSX files. Static JSX text differences were data/status values, session identity and the existing empty-message slot; screen labels/layouts were retained. This is a source-level check, not a browser visual comparison.
- Runtime API/browser testing was not performed after the user deferred it. No claim of production readiness or every-button verification is made.

Per-file notes and the final diff stat are recorded below when the stabilization checks finish.
