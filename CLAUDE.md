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
npm run watch-hybrid               # Watch with hybrid profile (remote HANA + local service)
npm run deploy-hana                # Deploy DB artifacts to HANA Cloud HDI container
npm run create-xsuaa               # Create XSUAA service instance and bind locally
npm run start-router               # Start AppRouter locally with bound services
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

### Development environments

Participants use SAP Business Application Studio, GitHub Codespaces, or the `.devcontainer/` (Node 24-bookworm). See `prerequisites.md` for the full setup matrix — do not duplicate it here.

### CI/CD

`deploy-docs.yml` (GitHub Actions) builds and deploys the VitePress site. The `Jenkinsfile` in the solution app is a SAP CI/CD Service bootstrap — it is not actively used for this repo.

### Sibling AI instruction files

This repo also ships `.clinerules`, `.cursorrules`, `.windsurfrules`, `AGENT_INSTRUCTIONS.md`, and `.github/copilot-instructions.md` — all covering the same conventions for other AI tools. Do not contradict them. If updating conventions, this CLAUDE.md is the source of truth; the others are generated downstream.

## Documentation style (exercise READMEs)

- Conversational, concise, action-oriented workshop tone
- Use 👉 to mark actionable steps (consistent with existing docs)
- Link to `prerequisites.md`, `CONTRIBUTING.md`, `README.md`, or `InstructorSetup.md` rather than duplicating their content
- Validate internal links when moving or renaming sections
- Keep SAP CAP / SAP HANA Cloud / SAP Business Application Studio terminology consistent with what is already used in the repo

## VitePress site (`docs/`)

The VitePress site lives in `docs/`. Each exercise has a thin wrapper page at `docs/exercises/ex*/index.md` that includes the source README via `<!--@include: ../../../exercises/ex*/README.md-->`.

### Commands (run from `docs/`)

```bash
npm run docs:dev    # Start dev server
npm run docs:build  # Production build → docs/.vitepress/dist/
npm test            # Run Vitest unit tests (23 tests)
```

### External tutorial inline expansion

Exercise READMEs link to SAP tutorials on `developers.sap.com`. The VitePress build expands these links inline at build time — fetching tutorial markdown from GitHub, transforming it, and replacing the link paragraph with full tutorial steps plus an attribution banner. Source READMEs are never modified.

**Detection:** any paragraph containing `👉` and a `developers.sap.com/tutorials/{ID}.html` link where `{ID}` is a key in the config map. Two paragraph variants exist across exercises — both are handled.

**To add a new tutorial:** add one entry to `docs/.vitepress/external-tutorials.config.ts`, verify the raw GitHub URL returns 200, then run `npm run docs:build` from `docs/`. Most tutorials live in `sap-tutorials/Tutorials` on `master`, but some are in other repos (e.g. `appstudio-onboarding` → `sap-tutorials/btp-adai` on `main`). If a URL returns 404, check the tutorial's GitHub link on `developers.sap.com`.

**Key files:**

| File | Purpose |
| ---- | ------- |
| `docs/.vitepress/external-tutorials.config.ts` | Config map: tutorial ID → raw GitHub URL |
| `docs/.vitepress/plugins/external-tutorials.ts` | Vite plugin: fetches tutorials at build start |
| `docs/.vitepress/plugins/md-expand-tutorials.ts` | markdown-it plugin: substitutes link blocks with expanded content |
| `docs/.vitepress/plugins/transform-tutorial.ts` | Pure transform: strips frontmatter, rewrites images/links, shifts headings |
| `docs/.vitepress/plugins/*.test.ts` | 23 unit tests (13 transform + 10 expansion/detection) |
