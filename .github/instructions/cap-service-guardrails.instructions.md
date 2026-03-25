---
description: "Use when changing CAP service definitions or handlers in solution/MyHANAApp/srv. Enforces CAP service boundaries, auth semantics, and existing project patterns."
name: "CAP Service Guardrails"
applyTo: "solution/MyHANAApp/srv/**"
---
# CAP Service Guardrails

- Keep boundaries clear:
  - `db/*` for data model/database semantics
  - `srv/*` for service exposure, projections, and handlers
  - `app/*` for UI metadata
- Follow existing CAP Node.js patterns; do not introduce alternate frameworks.
- Preserve authorization semantics unless explicitly requested:
  - `@requires`
  - `@restrict`
- Maintain compatibility with XSUAA-based auth (`cds.requires.auth = xsuaa`).
- Keep service contracts stable unless the task explicitly requires API changes.
- Prefer small, targeted updates that match surrounding style and naming.
- When adding logic in handlers, avoid leaking DB-only concerns into API behavior unless intentionally designed.
- If auth/routing/deployment concerns are touched, cross-check:
  - `solution/MyHANAApp/xs-security.json`
  - `solution/MyHANAApp/package.json`
  - `solution/MyHANAApp/app/router/xs-app.json`
  - `solution/MyHANAApp/mta.yaml`
