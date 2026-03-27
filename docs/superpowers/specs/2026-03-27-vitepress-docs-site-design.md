# VitePress Documentation Site Design

**Date:** 2026-03-27
**Status:** Approved
**Repo:** https://github.com/SAP-samples/cap-hana-exercises-codejam
**Live URL:** https://SAP-samples.github.io/cap-hana-exercises-codejam/

---

## Overview

Build a VitePress documentation site for the CAP + SAP HANA Cloud CodeJam repository, deployed to GitHub Pages. The site presents all existing workshop content (exercises, solution, prerequisites, slides, instructor guide, AI/agents docs) through a polished web experience with SAP branding, Mermaid diagram support, multi-language infrastructure, and AI consumption optimization via `@agentmarkup/vite`.

This is also a **pilot for a reusable docs pattern** across SAP-samples repositories. The wrapper-page model established here should be easily portable to other projects.

---

## Goals

- Single source of truth: exercise READMEs and root markdown files are never duplicated
- SAP brand colors with adaptive light/dark mode
- Mermaid diagram rendering
- AI consumption optimization (llms.txt, llms-full.txt, structured schema.org)
- i18n infrastructure ready; English only at launch
- Deployed to GitHub Pages via GitHub Actions on push to `main`
- Wrapper pages allow web-specific enhancements (callouts, nav hints, frontmatter) without touching source files
- Pattern supports external repo content via git submodules

---

## Architecture

### Approach: `docs/` as VitePress srcDir with native `<!--@include-->` includes

VitePress config lives in `docs/.vitepress/`. The `docs/` directory is the VitePress `srcDir`. Each exercise, prerequisite, solution, and reference page is a **wrapper page** that:

1. Declares its own frontmatter (title, description, prev/next nav)
2. Optionally adds web-specific callouts or lead-in content
3. Includes the source file via VitePress's native include syntax: `<!--@include: ../relative/path/to/source.md-->`

Source files (exercise READMEs, root markdown files) are **never modified**. The web layer is entirely in `docs/`.

For external repo content: add the external repo as a git submodule at `external/<repo-name>/`, then include files from it the same way. GitHub Actions checkout uses `submodules: true`.

---

## Directory Structure

```
repo root
├── index.md                              ← NEW: VitePress home page (audience hero)
│                                            GitHub uses README.md; VitePress uses index.md
├── exercises/
│   └── ex1–ex8/README.md                 ← unchanged source files
├── prerequisites.md                      ← unchanged
├── InstructorSetup.md                    ← unchanged
├── AGENT_INSTRUCTIONS.md                 ← unchanged
├── HANA_CLI_QUICKSTART.md               ← unchanged
├── HANA_CLI_EXAMPLES.md                  ← unchanged
├── HANA_CLI_REFERENCE.md                 ← unchanged
├── HANA_CLI_WORKFLOWS.md                 ← unchanged
├── CONTRIBUTING.md                       ← unchanged
├── solution/MyHANAApp/README.md          ← unchanged
├── slides/                               ← unchanged PDFs
├── external/                             ← git submodule mount point (future)
│
└── docs/
    ├── package.json                      ← VitePress + plugins
    ├── index.md                          ← Audience-driven hero (home page)
    ├── .vitepress/
    │   ├── config.ts                     ← Full VitePress config
    │   └── theme/
    │       ├── index.ts                  ← Extends default theme
    │       └── style.css                 ← SAP color CSS variables
    │
    ├── prerequisites/
    │   └── index.md                      ← <!--@include: ../../prerequisites.md-->
    │
    ├── slides/
    │   └── index.md                      ← PDF links + architecture descriptions
    │                                        (no include — content created fresh for web)
    │
    ├── exercises/
    │   ├── index.md                      ← Learning path overview + exercise table
    │   ├── ex1/index.md                  ← callout + <!--@include: ../../../exercises/ex1/README.md-->
    │   ├── ex2/index.md
    │   ├── ex3/index.md
    │   ├── ex4/index.md
    │   ├── ex5/index.md
    │   ├── ex6/index.md
    │   ├── ex7/index.md
    │   └── ex8/index.md
    │
    ├── solution/
    │   └── index.md                      ← <!--@include: ../../solution/MyHANAApp/README.md-->
    │
    ├── instructor/
    │   └── index.md                      ← <!--@include: ../../InstructorSetup.md-->
    │
    ├── ai-agents/
    │   └── index.md                      ← <!--@include: ../../AGENT_INSTRUCTIONS.md-->
    │                                        + additional MCP server setup content
    │
    ├── further-learning/
    │   ├── index.md                      ← Overview + curated external links
    │   ├── hana-cli/
    │   │   ├── index.md                  ← <!--@include: ../../../HANA_CLI_QUICKSTART.md-->
    │   │   ├── examples.md               ← <!--@include: ../../../HANA_CLI_EXAMPLES.md-->
    │   │   ├── reference.md              ← <!--@include: ../../../HANA_CLI_REFERENCE.md-->
    │   │   └── workflows.md              ← <!--@include: ../../../HANA_CLI_WORKFLOWS.md-->
    │   ├── contributing.md               ← <!--@include: ../../CONTRIBUTING.md-->
    │   └── resources.md                  ← Curated SAP CAP/HANA external links
    │
    └── i18n/
        └── README.md                     ← Instructions for AI/human translators
```

### Wrapper page pattern

Every wrapper page follows this structure:

```markdown
---
title: Exercise 1 — Set Up SAP HANA Cloud
description: Provision SAP HANA Cloud and configure your development environment
prev: { text: 'Prerequisites', link: '/prerequisites/' }
next: { text: 'Exercise 2 — Create a CAP Project', link: '/exercises/ex2/' }
---

::: tip Before you start
Complete the [Prerequisites](/prerequisites/) before beginning this exercise.
:::

<!--@include: ../../../exercises/ex1/README.md-->
```

Callout blocks (`::: tip`, `::: warning`, `::: info`) are the primary web-enhancement mechanism. Each wrapper page may also add a short lead-in paragraph. Source files are included verbatim.

---

## VitePress Configuration

### Core settings (`docs/.vitepress/config.ts`)

```ts
import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import { agentmarkup } from '@agentmarkup/vite'

export default withMermaid(defineConfig({
  base: '/cap-hana-exercises-codejam/',
  srcDir: '..',
  srcExclude: [
    '**/node_modules/**',
    '.github/**',
    '.vscode/**',
    '.devcontainer/**',
    'docs/.vitepress/**',
    'solution/MyHANAApp/db/**',
    'solution/MyHANAApp/srv/**',
    'solution/MyHANAApp/app/**',
    'solution/MyHANAApp/package*.json',
    '.claude/**',
  ],
  title: 'CAP + SAP HANA Cloud CodeJam',
  description: 'Hands-on workshop: build full-stack apps with SAP CAP and SAP HANA Cloud',
  lang: 'en-US',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,
  appearance: 'auto',           // respects system preference

  markdown: {
    languageAlias: { cds: 'typescript' },   // CDS syntax highlighting
  },
}))
```

### Navigation

Top nav (7 items):

| Label | Link |
|-------|------|
| Home | `/` |
| Prerequisites | `/prerequisites/` |
| Slides | `/slides/` |
| Exercises | dropdown → Ex 1–8 |
| Solution | `/solution/` |
| Instructor | `/instructor/` |
| AI/Agents | `/ai-agents/` |
| Further Learning | dropdown → HANA CLI, Resources, Contributing |

### Sidebar

Each section has its own sidebar:

- **`/exercises/`**: collapsible group per exercise (Ex 1–8), with index at top
- **`/further-learning/hana-cli/`**: Quickstart, Examples, Reference, Workflows
- **`/further-learning/`**: index, hana-cli group, Contributing, Resources

### i18n

```ts
locales: {
  root: { label: 'English', lang: 'en-US' },
  // Uncomment to activate a language and create docs/<code>/ directory:
  // de: { label: 'Deutsch', lang: 'de', link: '/de/' },
  // ja: { label: '日本語',  lang: 'ja', link: '/ja/' },
  // es: { label: 'Español', lang: 'es', link: '/es/' },
  // pt: { label: 'Português', lang: 'pt', link: '/pt/' },
  // fr: { label: 'Français', lang: 'fr', link: '/fr/' },
  // zh: { label: '中文',     lang: 'zh', link: '/zh/' },
}
```

Adding a language requires: (1) uncomment the locale entry, (2) create `docs/<code>/` with translated wrapper pages. The `docs/i18n/README.md` documents this process for AI-assisted translation.

### Search

```ts
search: { provider: 'local' }
```

### Social + footer

GitHub link in socialLinks. Footer: Apache 2.0 license, SAP copyright, Contributing and Legal links.

### Edit link

```ts
editLink: {
  pattern: 'https://github.com/SAP-samples/cap-hana-exercises-codejam/edit/main/docs/:path',
  text: 'Edit this page on GitHub'
}
```

---

## SAP Adaptive Theme

### `docs/.vitepress/theme/style.css`

```css
/* ── Light mode: SAP Blue 7 ─────────────────────────────── */
:root {
  --vp-c-brand-1: #0070F2;          /* SAP Blue 7  — primary */
  --vp-c-brand-2: #1B90FF;          /* SAP Blue 6  — hover   */
  --vp-c-brand-3: #D1EFFF;          /* SAP Blue 2  — tint bg */
  --vp-c-brand-soft: rgba(0, 112, 242, 0.14);
}

/* ── Dark mode: SAP Blue 6 on Blue 11 ───────────────────── */
.dark {
  --vp-c-brand-1: #1B90FF;          /* SAP Blue 6  — primary */
  --vp-c-brand-2: #89D1FF;          /* SAP Blue 4  — hover   */
  --vp-c-brand-3: #002A86;          /* SAP Blue 10 — tint bg */
  --vp-c-brand-soft: rgba(27, 144, 255, 0.16);
  --vp-c-bg: #00144A;               /* SAP Blue 11 — page bg */
  --vp-c-bg-soft: #0d1f3c;          /* near Blue 11 — softer  */
  --vp-c-bg-mute: #142340;
}
```

### `docs/.vitepress/theme/index.ts`

```ts
import { h } from 'vue'
import Theme from 'vitepress/theme'
import './style.css'

export default {
  extends: Theme,
  Layout: () => h(Theme.Layout, null, {}),
}
```

---

## Mermaid

```ts
mermaid: {
  theme: 'dark',
  startOnLoad: true,
  securityLevel: 'antiscript',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    nodeSpacing: 50,
    rankSpacing: 60,
    curve: 'basis',
  },
  logLevel: 'error',
}
```

Exercise 6 (Calculation View) and Exercise 8 (MTA deployment) both benefit from Mermaid architecture diagrams that can be added to their wrapper pages.

---

## @agentmarkup/vite

```ts
agentmarkup({
  site: 'https://SAP-samples.github.io/cap-hana-exercises-codejam/',
  name: 'CAP + SAP HANA Cloud CodeJam',
  globalSchemas: [
    { preset: 'webSite', name: 'CAP + SAP HANA Cloud CodeJam',
      url: 'https://SAP-samples.github.io/cap-hana-exercises-codejam/' },
    { preset: 'organization', name: 'SAP', url: 'https://www.sap.com' },
  ],
  llmsTxt: {
    title: 'CAP + SAP HANA Cloud CodeJam',
    description: 'Hands-on workshop for building full-stack applications with SAP Cloud Application Programming Model (CAP) and SAP HANA Cloud. Eight exercises from environment setup through MTA deployment.',
    sections: [
      {
        title: 'Prerequisites',
        entries: [
          { title: 'Prerequisites', url: '/prerequisites/', description: 'Environment setup for BAS, local, Dev Container, and Codespaces' },
        ],
      },
      {
        title: 'Exercises',
        entries: [
          { title: 'Exercise 1 — HANA Cloud Setup',       url: '/exercises/ex1/', description: 'Provision SAP HANA Cloud and configure development environment' },
          { title: 'Exercise 2 — CAP Project',            url: '/exercises/ex2/', description: 'Scaffold a CAP Node.js project with HANA Cloud target' },
          { title: 'Exercise 3 — Database Artifacts',     url: '/exercises/ex3/', description: 'Define CDS entities and deploy via HDI' },
          { title: 'Exercise 4 — Fiori UI',               url: '/exercises/ex4/', description: 'Generate SAP Fiori Elements List Report UI' },
          { title: 'Exercise 5 — Authentication',         url: '/exercises/ex5/', description: 'Add XSUAA OAuth2 and role-based access control' },
          { title: 'Exercise 6 — Calculation View',       url: '/exercises/ex6/', description: 'Create HANA Calculation View and expose via CAP' },
          { title: 'Exercise 7 — Stored Procedure',       url: '/exercises/ex7/', description: 'Create HANA stored procedure as CAP service function' },
          { title: 'Exercise 8 — MTA Deployment',         url: '/exercises/ex8/', description: 'Deploy complete application as Multi-Target Application to CF' },
        ],
      },
      {
        title: 'Reference',
        entries: [
          { title: 'Solution',    url: '/solution/',    description: 'Complete reference implementation walkthrough' },
          { title: 'Instructor',  url: '/instructor/',  description: 'Event setup and teardown procedures' },
          { title: 'AI/Agents',   url: '/ai-agents/',   description: 'MCP server setup, agent instructions, AI-assisted development' },
          { title: 'HANA CLI',    url: '/further-learning/hana-cli/', description: 'SAP HANA Developer CLI reference' },
        ],
      },
    ],
  },
  llmsFullTxt: { enabled: true },
})
```

---

## Home Page (`docs/index.md`)

Audience-driven hero using VitePress `layout: home` frontmatter with a custom features grid routing visitors by role:

| Audience | Color | CTA |
|----------|-------|-----|
| Attending an event | SAP Blue | → Start with Prerequisites |
| Self-studying | SAP Gold (Mango 6) | → Exercise 1 |
| Instructor | Blue-teal | → Instructor Setup |
| Using AI assistance | Green | → AI/Agents section |

Below the hero: technology badge row (CAP · HANA Cloud · Fiori · XSUAA · HDI · MTA), then a 3-column feature grid (CAP Model, HANA Cloud, Deploy) matching the exercise progression.

---

## GitHub Actions Workflow

**File:** `.github/workflows/deploy-docs.yml`

**Triggers:**
- Push to `main` when paths match: `docs/**`, `exercises/**`, `*.md`, `solution/MyHANAApp/README.md`, `.github/workflows/deploy-docs.yml`
- Pull requests to `main` (build-only, no deploy)
- `workflow_dispatch`

**Jobs:**

1. **security-scan** — `npm audit` on docs dependencies, non-blocking warning
2. **build** — checkout with `fetch-depth: 0` (lastUpdated) and `submodules: true` (future external content); cache `.vitepress/cache`; `npm ci && npm run docs:build`; verify `index.html` exists; upload artifact
3. **deploy** — `actions/deploy-pages@v4` (main branch only)

**Permissions:** `contents: read`, `pages: write`, `id-token: write`

---

## packages (`docs/package.json`)

```json
{
  "name": "cap-hana-codejam-docs",
  "version": "1.0.0",
  "description": "CAP + SAP HANA Cloud CodeJam Documentation",
  "private": true,
  "type": "module",
  "scripts": {
    "docs:dev":   "vitepress dev .",
    "docs:build": "vitepress build . && echo '' > .vitepress/dist/.nojekyll",
    "docs:serve": "vitepress serve ."
  },
  "devDependencies": {
    "@agentmarkup/vite":        "^0.4.0",
    "mermaid":                  "^11.12.3",
    "vitepress":                "^1.6.0",
    "vitepress-plugin-mermaid": "2.0.17",
    "vue":                      "^3.5.29"
  }
}
```

---

## New Files to Create

| File | Purpose |
|------|---------|
| `index.md` | VitePress home page (repo root) |
| `docs/package.json` | VitePress toolchain |
| `docs/package-lock.json` | Generated on first `npm install` |
| `docs/.vitepress/config.ts` | Full VitePress config |
| `docs/.vitepress/theme/index.ts` | Theme entry point |
| `docs/.vitepress/theme/style.css` | SAP color variables |
| `docs/index.md` | Audience-driven hero |
| `docs/prerequisites/index.md` | Wrapper for prerequisites.md |
| `docs/slides/index.md` | Slides section (fresh content) |
| `docs/exercises/index.md` | Exercise learning path overview |
| `docs/exercises/ex1/index.md` | Wrapper for exercises/ex1/README.md |
| `docs/exercises/ex2/index.md` | Wrapper |
| `docs/exercises/ex3/index.md` | Wrapper |
| `docs/exercises/ex4/index.md` | Wrapper |
| `docs/exercises/ex5/index.md` | Wrapper |
| `docs/exercises/ex6/index.md` | Wrapper + Mermaid calc view diagram |
| `docs/exercises/ex7/index.md` | Wrapper |
| `docs/exercises/ex8/index.md` | Wrapper + Mermaid MTA diagram |
| `docs/solution/index.md` | Wrapper for solution/MyHANAApp/README.md |
| `docs/instructor/index.md` | Wrapper for InstructorSetup.md |
| `docs/ai-agents/index.md` | Wrapper for AGENT_INSTRUCTIONS.md + MCP content |
| `docs/further-learning/index.md` | Further learning hub |
| `docs/further-learning/hana-cli/index.md` | Wrapper for HANA_CLI_QUICKSTART.md |
| `docs/further-learning/hana-cli/examples.md` | Wrapper for HANA_CLI_EXAMPLES.md |
| `docs/further-learning/hana-cli/reference.md` | Wrapper for HANA_CLI_REFERENCE.md |
| `docs/further-learning/hana-cli/workflows.md` | Wrapper for HANA_CLI_WORKFLOWS.md |
| `docs/further-learning/contributing.md` | Wrapper for CONTRIBUTING.md |
| `docs/further-learning/resources.md` | Curated external links |
| `docs/i18n/README.md` | Translation instructions |
| `.github/workflows/deploy-docs.yml` | GitHub Actions deploy pipeline |

## Files Modified

| File | Change |
|------|--------|
| `.gitignore` | Add `docs/.vitepress/dist/`, `docs/.vitepress/cache/`, `.superpowers/` |

## Files NOT modified

All exercise READMEs, root markdown files, solution code — zero changes.

---

## Reusability Pattern (Pilot Notes)

To apply this pattern to another SAP-samples repo:

1. Copy `docs/` directory (package.json, .vitepress/)
2. Update `config.ts`: `base`, `title`, `description`, nav, sidebar, agentmarkup sections
3. Create wrapper pages in `docs/` pointing `<!--@include-->` at that repo's source files
4. Copy `.github/workflows/deploy-docs.yml`, update trigger paths
5. Enable GitHub Pages (Settings → Pages → GitHub Actions source)

For external repo content: `git submodule add <url> external/<name>`, then include normally.
