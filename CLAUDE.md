# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository purpose

This is an SAP CodeJam repository containing workshop exercises and a reference solution for building full-stack applications with SAP Cloud Application Programming Model (CAP) and SAP HANA Cloud. The primary artifacts are:

- **Exercise content** in `exercises/ex1` through `exercises/ex8` — step-by-step workshop READMEs
- **Reference solution** in `solution/MyHANAApp` — a working CAP Node.js app

Most code contribution work targets either `exercises/*/README.md` (docs) or `solution/MyHANAApp/` (CAP app).

## Commands (run from `solution/MyHANAApp/`)

```bash
npm ci                             # Install dependencies
npm start                          # Start CAP server (cds-serve)
npm run watch-interaction_items    # Start/watch with Fiori UI open
npx eslint .                       # Lint (uses @sap/cds ESLint config)
npx cds build --production         # Production build / MTA pre-build step
```

There is no test script and no root-level build pipeline.

## Solution app architecture

The app in `solution/MyHANAApp` is a standard CAP Node.js project targeting SAP HANA Cloud via HDI:

- **`db/interactions.cds`** — CDS data model (`app.interactions.Headers`, `app.interactions.Items`) plus a `V_INTERACTION` entity mapped to a HANA calculation view (`@cds.persistence.calcview`)
- **`db/src/`** — HANA-native HDI artifacts: `V_INTERACTION.hdbcalculationview` (calculation view) and `sleep.hdbprocedure` (stored procedure)
- **`srv/interaction_srv.cds`** — `CatalogService` exposing projections with XSUAA auth (`@requires: 'authenticated-user'`, `@requires: 'Admin'`)
- **`srv/interaction_srv.js`** — Handler that wires the `sleep` CAP function to the HANA stored procedure
- **`app/interaction_items/`** — SAP Fiori Elements UI (OData V4 / List Report)
- **`app/router/xs-app.json`** — AppRouter routing; consumes backend destination `srv-api`
- **`mta.yaml`** — MTA deployment descriptor; provides destination `srv-api` for the AppRouter module

Auth flow: XSUAA → AppRouter → CAP service (`cds.requires.auth = xsuaa`).

## Conventions and guardrails

### Layer boundaries
Keep concerns in their correct layer — do not leak DB semantics into service handlers or UI annotations into `srv/`:
- `db/*` — data model and HANA-native artifacts
- `srv/*` — service projections, authorization, handlers
- `app/*` — UI annotations and Fiori metadata

### Auth and deployment config — cross-file consistency
When changing auth, routing, or deployment, verify all four files stay aligned:
- `solution/MyHANAApp/xs-security.json`
- `solution/MyHANAApp/package.json` (`cds.requires.auth`)
- `solution/MyHANAApp/app/router/xs-app.json` (destination `srv-api`)
- `solution/MyHANAApp/mta.yaml` (provides destination `srv-api`)

### ESLint
The ESLint baseline is `solution/MyHANAApp/eslint.config.mjs` using `@sap/cds` recommended config. Do not introduce an alternative config.

### Node.js version
Use even-numbered LTS versions (18, 20, 22, 24). Odd versions lack native module support for some CAP dependencies.

### HANA graphical calculation view editing
The graphical calculation view editor is BAS-only. Do not suggest unsupported local alternatives.

## Documentation style (exercise READMEs)

- Conversational, concise, action-oriented workshop tone
- Use 👉 to mark actionable steps (consistent with existing docs)
- Link to `prerequisites.md`, `CONTRIBUTING.md`, `README.md`, or `InstructorSetup.md` rather than duplicating their content
- Validate internal links when moving or renaming sections
- Keep SAP CAP / SAP HANA Cloud / SAP Business Application Studio terminology consistent with what is already used in the repo
