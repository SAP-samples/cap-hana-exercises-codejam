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

## VitePress site (`docs/`)

The VitePress site lives in `docs/`. Each exercise has a thin wrapper page at `docs/exercises/ex*/index.md` that includes the source README via `<!--@include: ../../../exercises/ex*/README.md-->`.

### Commands (run from `docs/`)

```bash
npm run docs:dev    # Start dev server
npm run docs:build  # Production build → docs/.vitepress/dist/
npm test            # Run Vitest unit tests (20 tests)
```

### External tutorial inline expansion

Exercise READMEs link to SAP tutorials on `developers.sap.com`. The VitePress build automatically expands these links inline — fetching the tutorial markdown from GitHub at build time and replacing the link paragraph with the full tutorial steps plus an attribution banner.

**How it works:**

- Any block in a README that contains `👉` **and** a `developers.sap.com/tutorials/{ID}.html` link where `{ID}` is a key in the config map gets expanded inline.
- Source READMEs are never modified — expansion happens during VitePress rendering only.
- Two `👉` paragraph variants are both handled:
  - `👉 Perform all the steps in the tutorial: [Title](URL)` (ex1–ex4, ex8)
  - `Perform all the steps in 👉 [tutorial: Title](URL)` (ex5–ex7)

**To add a new tutorial expansion:**

1. Confirm the tutorial markdown exists in the upstream repo. The URL pattern is:
   `https://raw.githubusercontent.com/sap-tutorials/Tutorials/master/tutorials/{ID}/{ID}.md`
   Verify with: `curl -s -o /dev/null -w "%{http_code}" <url>`

2. Add one entry to [`docs/.vitepress/external-tutorials.config.ts`](docs/.vitepress/external-tutorials.config.ts):

   ```ts
   'tutorial-id-here':
     'https://raw.githubusercontent.com/sap-tutorials/Tutorials/master/tutorials/tutorial-id-here/tutorial-id-here.md',
   ```

3. Run `npm run docs:build` from `docs/` and verify the page shows exactly 1 attribution banner per tutorial link.

**Key files:**

| File | Purpose |
| ---- | ------- |
| `docs/.vitepress/external-tutorials.config.ts` | Config map: tutorial ID → raw GitHub URL |
| `docs/.vitepress/plugins/external-tutorials.ts` | Vite plugin: fetches tutorials at build start |
| `docs/.vitepress/plugins/md-expand-tutorials.ts` | markdown-it plugin: substitutes link blocks with expanded content |
| `docs/.vitepress/plugins/transform-tutorial.ts` | Pure transform pipeline: strips frontmatter/intro, rewrites image paths and cross-links, shifts headings |
| `docs/.vitepress/plugins/transform-tutorial.test.ts` | 13 unit tests for the transform pipeline |
| `docs/.vitepress/plugins/md-expand-tutorials.test.ts` | 7 unit tests for the expansion/detection logic |

**Note:** Most tutorials live in `sap-tutorials/Tutorials` on `master`, but some have moved to other repos (e.g. `appstudio-onboarding` is in `sap-tutorials/btp-adai` on `main`). If a raw URL returns 404, check the tutorial's GitHub link on the `developers.sap.com` page to find the correct repo and branch.
