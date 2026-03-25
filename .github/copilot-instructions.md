# Copilot Workspace Instructions

## Purpose

This repository contains CodeJam exercise content and a reference SAP CAP + SAP HANA solution in `solution/MyHANAApp`.

Prefer minimal, targeted changes. Most contribution work here is documentation updates in `exercises/*/README.md` or CAP code changes in `solution/MyHANAApp`.

## Repository layout

- `README.md` — entry point for exercise flow and links to all exercises.
- `prerequisites.md` — authoritative setup matrix (BAS, local VS Code, Dev Container, Codespaces).
- `InstructorSetup.md` — instructor-only SAP BTP/HANA provisioning guidance.
- `exercises/ex1` … `exercises/ex8` — step-by-step workshop content.
- `solution/MyHANAApp` — reference CAP full-stack app:
  - `db/` CDS model + HANA artifacts
  - `srv/` CAP service definitions/handlers
  - `app/interaction_items/` SAP Fiori Elements UI
  - `app/router/` AppRouter config
  - `mta.yaml` deployment descriptor

## Tech stack and architecture (solution app)

- CAP Node.js (`@sap/cds`, `@cap-js/hana`)
- HANA HDI deployment (`mta.yaml`, `db/`, `gen/*` at build time)
- SAP AppRouter (`app/router/xs-app.json`) in front of CAP service
- XSUAA authentication (`xs-security.json`, `cds.requires.auth = xsuaa`)
- UI generated with SAP Fiori tools (`app/interaction_items`)

Keep boundaries clear:
- Database semantics in `db/*`
- Service exposure/policies in `srv/*`
- UI metadata/annotations in `app/*`
- Routing/auth proxy behavior in `app/router/*`

## Commands agents should use

Run commands from `solution/MyHANAApp` unless the task is docs-only.

- Install deps: `npm ci`
- Start CAP server: `npm start`
- Start/watch UI app: `npm run watch-interaction_items`
- Lint (CAP ESLint config): `npx eslint .`
- Production build (also used by MTA pre-build): `npx cds build --production`

Notes:
- There is no root workspace build/test pipeline.
- There is no explicit `test` script in `solution/MyHANAApp/package.json`.

## Project conventions

- Follow existing CAP patterns; do not introduce alternative frameworks.
- Keep service authorization semantics intact (`@requires`, `@restrict`) unless explicitly requested.
- Keep AppRouter destination contract aligned:
  - `mta.yaml` provides destination name `srv-api`
  - `app/router/xs-app.json` consumes destination `srv-api`
- Use existing ESLint baseline (`solution/MyHANAApp/eslint.config.mjs` uses `@sap/cds` recommended config).
- For docs edits, preserve the tutorial style and “do-this-next” flow used in exercise READMEs.

## Environment and pitfalls

- Prefer even-numbered Node.js LTS versions (18/20/22). Avoid odd Node versions.
- Local development may require native builds for sqlite transitive dependencies; if local setup fails, prefer BAS/Dev Container/Codespaces guidance in `prerequisites.md`.
- SAP HANA graphical calculation view tooling is BAS-centric; avoid suggesting unsupported local alternatives unless explicitly requested.

## Link-first references (do not duplicate)

When relevant, link to these sources instead of re-stating details:

- Setup and environment options: `prerequisites.md`
- Contributor process and DCO expectations: `CONTRIBUTING.md`
- Exercise progression and context: `README.md`
- Instructor provisioning/cleanup: `InstructorSetup.md`

## Editing guardrails

- Do not reformat unrelated files.
- Keep examples consistent with SAP CAP conventions already present in `solution/MyHANAApp`.
- If changing auth, routing, or deployment config, verify impacted files together:
  - `xs-security.json`
  - `solution/MyHANAApp/package.json` (`cds.requires.auth`)
  - `solution/MyHANAApp/app/router/xs-app.json`
  - `solution/MyHANAApp/mta.yaml`
