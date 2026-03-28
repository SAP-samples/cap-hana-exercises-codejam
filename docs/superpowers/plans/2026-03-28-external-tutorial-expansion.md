# External Tutorial Inline Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Auto-expand `developers.sap.com/tutorials/` links inline in the VitePress site at build time, sourcing content from the SAP Tutorials GitHub repo — zero changes to source README files.

**Architecture:** A Vite plugin fetches configured tutorials from GitHub raw URLs during `buildStart` and stores them in memory. A markdown-it plugin wraps `md.render` to perform pre-parse source substitution: any markdown block containing `👉` and a configured tutorial link is replaced with an attribution callout + the fetched and transformed tutorial steps. The transform pipeline is a set of pure string functions kept in a separate file for testability.

**Tech Stack:** VitePress 1.x, Vite 5 (via VitePress), markdown-it (via VitePress), Vitest 2 (tests), Node.js 24 (ESM), TypeScript

---

## File Map

| File | Role |
| ---- | ---- |
| `docs/.vitepress/external-tutorials.config.ts` | Config map: tutorial ID → GitHub raw URL. One line per tutorial. |
| `docs/.vitepress/plugins/transform-tutorial.ts` | Pure transform pipeline: 7 string functions, no I/O. Fully testable in isolation. |
| `docs/.vitepress/plugins/transform-tutorial.test.ts` | Vitest unit tests for every transform step. |
| `docs/.vitepress/plugins/external-tutorials.ts` | Vite plugin: fetches all configured tutorials in `buildStart`, populates an in-memory Map, exports `getTutorialContent(id)`. |
| `docs/.vitepress/plugins/md-expand-tutorials.ts` | markdown-it plugin: wraps `md.render` for pre-parse substitution of matching blocks. |
| `docs/.vitepress/config.ts` | **Modified**: register Vite plugin + markdown-it plugin in `markdown.config`. |
| `docs/package.json` | **Modified**: add `vitest` devDependency, add `test` script. |

---

## Task 1: Add Vitest

**Files:**
- Modify: `docs/package.json`

All commands run from `docs/`.

- [ ] **Step 1.1: Install Vitest**

```bash
cd docs && npm install --save-dev vitest@^2.0.0
```

- [ ] **Step 1.2: Add test script to `docs/package.json`**

In the `"scripts"` object, add:

```json
"test": "vitest run"
```

- [ ] **Step 1.3: Verify Vitest runs**

```bash
cd docs && npm test
```

Expected: process exits with code 1 and message `No test files found, exiting with code 1`. This is correct — Vitest 2 exits non-zero when there are no test files. It confirms the runner is wired up and will exit 0 once tests exist and pass.

- [ ] **Step 1.4: Commit**

```bash
git add docs/package.json docs/package-lock.json
git commit -m "chore: add vitest to docs package"
```

---

## Task 2: Tutorial Config Map

**Files:**
- Create: `docs/.vitepress/external-tutorials.config.ts`

- [ ] **Step 2.1: Create the config file**

```ts
// docs/.vitepress/external-tutorials.config.ts

/**
 * Maps tutorial IDs (as they appear in developers.sap.com URLs) to their
 * raw GitHub markdown source URLs.
 *
 * To add a new tutorial: add one entry here. The Vite plugin and
 * markdown-it plugin pick it up automatically.
 *
 * Convention: the base URL for images is derived by stripping the filename
 * from the raw URL (everything up to and including the last '/').
 */
export const EXTERNAL_TUTORIALS: Record<string, string> = {
  'hana-cloud-deploying':
    'https://raw.githubusercontent.com/sap-tutorials/Tutorials/master/tutorials/hana-cloud-deploying/hana-cloud-deploying.md',
}

/** Derive the raw directory base URL from a raw file URL (used for image rewriting). */
export function rawBaseUrl(rawFileUrl: string): string {
  return rawFileUrl.slice(0, rawFileUrl.lastIndexOf('/') + 1)
}
```

- [ ] **Step 2.2: Commit**

```bash
git add docs/.vitepress/external-tutorials.config.ts
git commit -m "feat: add external tutorial config map"
```

---

## Task 3: Transform Pipeline (TDD)

**Files:**
- Create: `docs/.vitepress/plugins/transform-tutorial.test.ts`
- Create: `docs/.vitepress/plugins/transform-tutorial.ts`

The transform pipeline is a series of pure functions applied sequentially to the raw upstream markdown. Each function takes a string and returns a string. They are composed into a single `transformTutorial(src, baseUrl)` function.

The upstream `hana-cloud-deploying.md` has this structure (relevant excerpt for tests):

```
---
parser: v2
time: 15
author_name: Thomas Jung
---

# Deploy SAP HANA Cloud

<!-- description --> Create an instance of the SAP HANA Cloud in SAP BTP trial or free tier.

## You will learn

- How to use the SAP BTP cockpit as a graphical tool to provision your free SAP HANA Cloud instance

## Get to know SAP HANA Cloud

[SAP HANA Cloud](https://developers.sap.com/topics/hana.html) is a complete...

## Intro

By combining in-memory storage...

---

### Add SAP HANA Cloud to your account

1. Complete the tutorial steps in [Start Using SAP HANA Cloud Trial in SAP BTP Cockpit](hana-cloud-mission-trial-2). ...

### Create Database

1. Complete the tutorial steps in [Provision an Instance of SAP HANA Cloud, SAP HANA Database](hana-cloud-mission-trial-3). ...

2. ... <!-- border -->![Allow All IP addresses](trial4.png)

3. ...

    <!-- border -->![Manage Configuration](ManageConfiguration.png)

---
```

- [ ] **Step 3.1: Write the failing tests**

Create `docs/.vitepress/plugins/transform-tutorial.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { transformTutorial } from './transform-tutorial.js'

const BASE = 'https://raw.githubusercontent.com/sap-tutorials/Tutorials/master/tutorials/hana-cloud-deploying/'

describe('transformTutorial', () => {
  it('strips YAML frontmatter', () => {
    const src = '---\nparser: v2\ntime: 15\n---\n\n### Step\n\n1. Do it.'
    const result = transformTutorial(src, BASE)
    expect(result).not.toContain('parser: v2')
    expect(result).toContain('Do it.')
  })

  it('strips HTML comments', () => {
    const src = '---\n---\n\n### Step\n\n<!-- border -->![img](a.png)\n<!-- description --> text'
    const result = transformTutorial(src, BASE)
    expect(result).not.toContain('<!-- border -->')
    expect(result).not.toContain('<!-- description -->')
    expect(result).toContain('![img]')
  })

  it('strips intro sections — keeps only content from the first ### heading', () => {
    const src = '---\n---\n\n# Title\n\n## You will learn\n\n- bullet\n\n## Intro\n\nsome text\n\n---\n\n### Step One\n\n1. Do it.'
    const result = transformTutorial(src, BASE)
    expect(result).not.toContain('# Title')
    expect(result).not.toContain('You will learn')
    expect(result).not.toContain('Intro')
    expect(result).toContain('Step One')
    expect(result).toContain('Do it.')
  })

  it('rewrites relative image paths to absolute GitHub raw URLs', () => {
    const src = '---\n---\n\n### Step\n\n![Allow All IP](trial4.png)'
    const result = transformTutorial(src, BASE)
    expect(result).toContain(`![Allow All IP](${BASE}trial4.png)`)
  })

  it('does NOT rewrite image paths that are already absolute', () => {
    const src = '---\n---\n\n### Step\n\n![img](https://example.com/img.png)'
    const result = transformTutorial(src, BASE)
    expect(result).toContain('![img](https://example.com/img.png)')
  })

  it('rewrites bare tutorial cross-links to full developers.sap.com URLs', () => {
    const src = '---\n---\n\n### Step\n\n1. See [Getting Started](hana-cloud-mission-trial-2).'
    const result = transformTutorial(src, BASE)
    expect(result).toContain('[Getting Started](https://developers.sap.com/tutorials/hana-cloud-mission-trial-2.html)')
  })

  it('does NOT rewrite image srcs as tutorial cross-links', () => {
    const src = '---\n---\n\n### Step\n\n![alt](trial4.png)'
    const result = transformTutorial(src, BASE)
    // image src must not become a developers.sap.com URL
    expect(result).not.toContain('developers.sap.com/tutorials/trial4')
  })

  it('does NOT rewrite already-absolute links as cross-links', () => {
    const src = '---\n---\n\n### Step\n\n[SAP HANA Cloud](https://developers.sap.com/topics/hana.html)'
    const result = transformTutorial(src, BASE)
    // absolute URL must pass through unchanged
    expect(result).toContain('[SAP HANA Cloud](https://developers.sap.com/topics/hana.html)')
    // and must not be double-wrapped
    expect(result).not.toContain('developers.sap.com/tutorials/https')
  })

  it('drops h1 headings', () => {
    const src = '---\n---\n\n# Deploy SAP HANA Cloud\n\n### Step\n\n1. Do it.'
    const result = transformTutorial(src, BASE)
    expect(result).not.toContain('# Deploy SAP HANA Cloud')
  })

  it('shifts ## → ### and ### → ####', () => {
    const src = '---\n---\n\n### Step A\n\n## Section B\n\n1. item'
    const result = transformTutorial(src, BASE)
    expect(result).toContain('#### Step A')
    expect(result).toContain('### Section B')
    // original levels must not appear as headings
    expect(result).not.toMatch(/^### Step A/m)
    expect(result).not.toMatch(/^## Section B/m)
  })

  it('strips bare --- dividers', () => {
    const src = '---\nfm: true\n---\n\n### Step\n\n1. item\n\n---\n\n1. more\n\n---'
    const result = transformTutorial(src, BASE)
    // Only the frontmatter --- should have been consumed; remaining --- stripped
    expect(result).not.toMatch(/^---$/m)
    expect(result).toContain('1. item')
    expect(result).toContain('1. more')
  })
})
```

- [ ] **Step 3.2: Run tests to verify they fail**

```bash
cd docs && npm test
```

Expected: multiple FAIL — `Cannot find module './transform-tutorial.js'`

- [ ] **Step 3.3: Implement the transform pipeline**

Create `docs/.vitepress/plugins/transform-tutorial.ts`:

```ts
/**
 * Pure transform pipeline for SAP Tutorials GitHub markdown.
 * Applied once per tutorial at Vite buildStart time.
 * All functions are string→string with no side effects.
 */

/** 1. Remove YAML frontmatter block (opening --- to closing ---). */
function stripFrontmatter(src: string): string {
  return src.replace(/^---[\s\S]*?---\n?/, '')
}

/** 2. Remove SAP Tutorials HTML processing directives (<!-- border -->, <!-- description -->, etc.). */
function stripHtmlComments(src: string): string {
  return src.replace(/<!--[^>]*-->/g, '')
}

/**
 * 3. Remove everything before the first ### heading.
 * This discards the h1 title, "You will learn", "Get to know", and "Intro" sections.
 */
function stripIntroSections(src: string): string {
  const idx = src.search(/^### /m)
  if (idx === -1) return src
  return src.slice(idx)
}

/**
 * 4. Rewrite relative image paths to absolute GitHub raw URLs.
 * Only matches image syntax ![alt](relative) — never link syntax [text](url).
 */
function rewriteImagePaths(src: string, baseUrl: string): string {
  // Match ![alt](src) where src does NOT start with http
  return src.replace(/!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g, `![$1](${baseUrl}$2)`)
}

/**
 * 5. Rewrite bare tutorial cross-links to full developers.sap.com URLs.
 * Matches [text](id) where id is a bare word [a-z0-9-]+ with no dot, no protocol.
 * The negative lookbehind for ! ensures image srcs are not matched.
 */
function rewriteCrossLinks(src: string): string {
  return src.replace(
    /(?<!!)\[([^\]]+)\]\(([a-z][a-z0-9-]+)\)/g,
    (_, text, id) => `[${text}](https://developers.sap.com/tutorials/${id}.html)`
  )
}

/**
 * 6. Shift heading levels down by one; drop h1 entirely.
 * Process ### before ## to avoid double-shifting.
 *   # Title   → (dropped)
 *   ## Section → ### Section
 *   ### Step   → #### Step
 */
function shiftHeadings(src: string): string {
  return src
    .replace(/^# .+$/gm, '')      // drop entire h1 lines
    .replace(/^### /gm, '#### ')  // shift ### before ## to avoid collision
    .replace(/^## /gm, '### ')
}

/** 7. Remove bare --- horizontal rules (step-section dividers in SAP Tutorials format). */
function stripDividers(src: string): string {
  return src.replace(/^---$/gm, '')
}

/**
 * Apply the full transform pipeline to raw upstream tutorial markdown.
 *
 * @param src     Raw markdown string fetched from GitHub.
 * @param baseUrl GitHub raw directory URL used for absolute image paths
 *                (e.g. "https://raw.githubusercontent.com/.../hana-cloud-deploying/").
 * @returns       Transformed markdown ready for inline inclusion.
 */
export function transformTutorial(src: string, baseUrl: string): string {
  return [
    stripFrontmatter,
    stripHtmlComments,
    stripIntroSections,
    (s: string) => rewriteImagePaths(s, baseUrl),
    rewriteCrossLinks,
    shiftHeadings,
    stripDividers,
  ].reduce((acc, fn) => fn(acc), src)
}
```

- [ ] **Step 3.4: Run tests to verify they pass**

```bash
cd docs && npm test
```

Expected: all tests PASS.

- [ ] **Step 3.5: Commit**

```bash
git add docs/.vitepress/plugins/transform-tutorial.ts docs/.vitepress/plugins/transform-tutorial.test.ts
git commit -m "feat: add tutorial transform pipeline with tests"
```

---

## Task 4: Vite Fetch Plugin

**Files:**
- Create: `docs/.vitepress/plugins/external-tutorials.ts`

This plugin has no unit tests — its behaviour is verified by the build in Task 6. The logic is: fetch, transform, store. Any fetch failure must abort the build with a useful error.

- [ ] **Step 4.1: Create the Vite plugin**

Create `docs/.vitepress/plugins/external-tutorials.ts`:

```ts
import type { Plugin } from 'vite'
import { EXTERNAL_TUTORIALS, rawBaseUrl } from '../external-tutorials.config.js'
import { transformTutorial } from './transform-tutorial.js'

/** In-memory cache populated in buildStart. Keys are tutorial IDs. */
const cache = new Map<string, string>()

/**
 * Returns the transformed markdown for a tutorial ID, or undefined if
 * the tutorial is not configured or has not been fetched yet.
 */
export function getTutorialContent(id: string): string | undefined {
  return cache.get(id)
}

/**
 * Vite plugin that fetches all configured external tutorials at build start
 * and stores transformed markdown in memory for use by md-expand-tutorials.
 */
export function externalTutorialsPlugin(): Plugin {
  return {
    name: 'vitepress-external-tutorials',

    async buildStart() {
      const entries = Object.entries(EXTERNAL_TUTORIALS)
      if (entries.length === 0) return

      await Promise.all(
        entries.map(async ([id, url]) => {
          const res = await fetch(url)
          if (!res.ok) {
            throw new Error(
              `[external-tutorials] Failed to fetch tutorial "${id}": ${res.status} ${res.statusText} — ${url}`
            )
          }
          const raw = await res.text()
          const base = rawBaseUrl(url)
          cache.set(id, transformTutorial(raw, base))
        })
      )
    },
  }
}
```

- [ ] **Step 4.2: Commit**

```bash
git add docs/.vitepress/plugins/external-tutorials.ts
git commit -m "feat: add Vite plugin for fetching external tutorials"
```

---

## Task 5: markdown-it Expansion Plugin (TDD)

**Files:**
- Create: `docs/.vitepress/plugins/md-expand-tutorials.test.ts`
- Create: `docs/.vitepress/plugins/md-expand-tutorials.ts`

This plugin wraps `md.render` to perform pre-parse source substitution — the same pattern used in `docs/.vitepress/config.ts` lines 38–49 for the `<details>` fix.

Detection rule: a markdown block (paragraph) that **both** contains `👉` AND contains a `developers.sap.com/tutorials/{ID}.html` link where `ID` is in the cache.

- [ ] **Step 5.1: Write the failing tests**

Create `docs/.vitepress/plugins/md-expand-tutorials.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { expandTutorialsInSource } from './md-expand-tutorials.js'

// Simulates the in-memory cache for testing (no Vite context needed)
const fakeCache = new Map<string, string>([
  ['hana-cloud-deploying', '#### Add HANA Cloud\n\n1. Do the thing.'],
])

function mockGetContent(id: string): string | undefined {
  return fakeCache.get(id)
}

describe('expandTutorialsInSource', () => {
  it('expands a configured tutorial link in a 👉 paragraph', () => {
    const src = [
      '## Section',
      '',
      '👉 Perform all the steps in the tutorial: [Deploy SAP HANA Cloud](https://developers.sap.com/tutorials/hana-cloud-deploying.html).',
      '',
      '## Next',
    ].join('\n')

    const result = expandTutorialsInSource(src, mockGetContent)

    expect(result).toContain('::: info Source')
    expect(result).toContain('[Deploy SAP HANA Cloud](https://developers.sap.com/tutorials/hana-cloud-deploying.html)')
    expect(result).toContain('on SAP Tutorials')
    expect(result).toContain('#### Add HANA Cloud')
    expect(result).toContain('1. Do the thing.')
    // original link paragraph must be gone
    expect(result).not.toContain('👉 Perform all the steps')
  })

  it('expands when 👉 appears inline before the link', () => {
    const src = 'Perform all the steps in 👉 [tutorial: Deploy SAP HANA Cloud](https://developers.sap.com/tutorials/hana-cloud-deploying.html)\n'
    const result = expandTutorialsInSource(src, mockGetContent)
    expect(result).toContain('::: info Source')
    expect(result).toContain('#### Add HANA Cloud')
  })

  it('strips "tutorial: " prefix from title in the attribution callout', () => {
    const src = '👉 See 👉 [tutorial: Deploy SAP HANA Cloud](https://developers.sap.com/tutorials/hana-cloud-deploying.html)\n'
    const result = expandTutorialsInSource(src, mockGetContent)
    expect(result).toContain('[Deploy SAP HANA Cloud]')
    expect(result).not.toContain('[tutorial: Deploy SAP HANA Cloud]')
  })

  it('leaves an unconfigured tutorial link unchanged', () => {
    const src = '👉 See [Other Tutorial](https://developers.sap.com/tutorials/not-configured.html).\n'
    const result = expandTutorialsInSource(src, mockGetContent)
    expect(result).toBe(src)
    expect(result).not.toContain('::: info Source')
  })

  it('does NOT expand a configured link in a Further Study bullet (no 👉)', () => {
    const src = '* [Deploy SAP HANA Cloud (Tutorial)](https://developers.sap.com/tutorials/hana-cloud-deploying.html)\n'
    const result = expandTutorialsInSource(src, mockGetContent)
    expect(result).toBe(src)
    expect(result).not.toContain('::: info Source')
  })

  it('expands only the first configured link when a block has two', () => {
    fakeCache.set('appstudio-onboarding', '#### Set Up BAS\n\n1. Open BAS.')
    const src = [
      '👉 Use [SAP BTP free trial](https://developers.sap.com/tutorials/hcp-create-trial-account.html),',
      'then follow [Set Up BAS](https://developers.sap.com/tutorials/appstudio-onboarding.html).',
    ].join(' ')

    const result = expandTutorialsInSource(src, mockGetContent)
    // appstudio-onboarding is in cache; hcp-create-trial-account is not
    expect(result).toContain('::: info Source')
    expect(result).toContain('appstudio-onboarding')
    // only one expansion
    expect(result.split('::: info Source').length).toBe(2)
    fakeCache.delete('appstudio-onboarding')
  })

  it('passes through source unchanged when no configured tutorial is present', () => {
    const src = '## Nothing to expand\n\nJust regular markdown.\n'
    const result = expandTutorialsInSource(src, mockGetContent)
    expect(result).toBe(src)
  })
})
```

- [ ] **Step 5.2: Run tests to verify they fail**

```bash
cd docs && npm test
```

Expected: FAIL — `Cannot find module './md-expand-tutorials.js'`

- [ ] **Step 5.3: Implement the markdown-it plugin**

Create `docs/.vitepress/plugins/md-expand-tutorials.ts`:

```ts
import type MarkdownIt from 'markdown-it'
import { getTutorialContent } from './external-tutorials.js'

/** URL prefix all SAP tutorial links share. */
const SAP_TUTORIAL_RE = /https:\/\/developers\.sap\.com\/tutorials\/([a-z0-9-]+)\.html/

/**
 * Performs pre-parse source substitution on a single markdown source string.
 * Exported separately so it can be unit-tested without a MarkdownIt instance.
 *
 * @param src        Full markdown source string (after @include resolution).
 * @param getContent Function that returns transformed tutorial content by ID.
 */
export function expandTutorialsInSource(
  src: string,
  getContent: (id: string) => string | undefined
): string {
  // Split into blocks on blank lines. Each block is a paragraph, heading, list, etc.
  const blocks = src.split(/\n\n+/)
  let changed = false

  const expanded = blocks.map((block) => {
    // Must contain 👉 to be an actionable step paragraph
    if (!block.includes('👉')) return block

    // Find the first configured tutorial link in this block
    const match = block.match(SAP_TUTORIAL_RE)
    if (!match) return block

    const id = match[1]
    const content = getContent(id)
    if (!content) return block

    // Extract link title (strip "tutorial: " prefix if present)
    const titleMatch = block.match(/\[([^\]]+)\]\(https:\/\/developers\.sap\.com\/tutorials\/[a-z0-9-]+\.html\)/)
    const rawTitle = titleMatch ? titleMatch[1] : id
    const title = rawTitle.replace(/^tutorial:\s*/i, '')

    changed = true
    return `::: info Source\nThese steps are from [${title}](https://developers.sap.com/tutorials/${id}.html) on SAP Tutorials.\n:::\n\n${content}`
  })

  return changed ? expanded.join('\n\n') : src
}

/**
 * markdown-it plugin that wraps md.render to expand SAP tutorial links
 * before the markdown source is parsed.
 *
 * Registration: add `expandTutorialsPlugin(md)` inside markdown.config in config.ts.
 */
export function expandTutorialsPlugin(md: MarkdownIt): void {
  const originalRender = md.render.bind(md)
  md.render = function (src: string, env?: unknown): string {
    const expanded = expandTutorialsInSource(src, getTutorialContent)
    return originalRender(expanded, env)
  }
}
```

- [ ] **Step 5.4: Run tests to verify they pass**

```bash
cd docs && npm test
```

Expected: all tests PASS.

- [ ] **Step 5.5: Commit**

```bash
git add docs/.vitepress/plugins/md-expand-tutorials.ts docs/.vitepress/plugins/md-expand-tutorials.test.ts
git commit -m "feat: add markdown-it plugin for inline tutorial expansion with tests"
```

---

## Task 6: Wire Into config.ts and Verify

**Files:**
- Modify: `docs/.vitepress/config.ts`

- [ ] **Step 6.1: Register plugins in config.ts**

In `docs/.vitepress/config.ts`, add two imports near the top (after existing imports):

```ts
import { externalTutorialsPlugin } from './plugins/external-tutorials.js'
import { expandTutorialsPlugin } from './plugins/md-expand-tutorials.js'
```

Inside the existing `markdown.config(md)` function body, add a call to `expandTutorialsPlugin(md)` **at the end**, after the existing `md.render` details-fix patch. Do **not** create a second `config(md)` property — VitePress only calls one, and a second would silently discard the details fix. The final `config(md)` function should look like this (existing code untouched, new line appended):

```ts
config(md) {
  const originalRender = md.render.bind(md)
  md.render = function (src, env) {
    const html = originalRender(src, env)
    if (!html.includes('<details')) return html
    return html
      .replace(/<p>((?:(?!<\/p>).)*<details[\s\S]*?)<\/p>/g, '<div>$1</div>')
      .replace(/<p>((?:(?!<details).)*<\/details>[\s\S]*?)<\/p>/g, '<div>$1</div>')
  }
  // NEW: wrap md.render again for pre-parse tutorial expansion
  expandTutorialsPlugin(md)
},
```

Note on ordering: `expandTutorialsPlugin` wraps the already-patched `md.render`. The outer wrapper (tutorial expansion) runs first on the source string, then calls the inner wrapper, which runs the details HTML fix on the output. This ordering is correct — tutorial expansion must happen before markdown-it parses the source.

In the `vite.plugins` array, add `externalTutorialsPlugin()` as a new entry **after** the existing `agentmarkup(...)` call (do not modify the agentmarkup arguments):

```ts
plugins: [
  agentmarkup({ ...existing arguments unchanged... }),
  externalTutorialsPlugin(),  // ADD THIS LINE
],
```

- [ ] **Step 6.2: Run tests to confirm nothing broke**

```bash
cd docs && npm test
```

Expected: all tests PASS.

- [ ] **Step 6.3: Run the VitePress build**

```bash
cd docs && npm run docs:build 2>&1 | head -60
```

Expected:
- Build succeeds (exit 0)
- Output contains a log line about fetching tutorials (or no error about the plugin)
- `exercises/ex1` page is built

If the build fails with a fetch error, check network access. If it fails with a TypeScript/import error, check that the `.js` extensions in imports are correct (required for ESM).

- [ ] **Step 6.4: Inspect the built Exercise 1 page**

```bash
grep -A 30 'info Source' docs/.vitepress/dist/exercises/ex1/index.html | head -40
```

Expected: the rendered HTML contains the attribution callout div (VitePress renders `::: info` as `<div class="info custom-block">`) followed by the tutorial step headings and numbered list items.

- [ ] **Step 6.5: Verify Further Study links are NOT expanded**

```bash
grep -c 'info Source' docs/.vitepress/dist/exercises/ex1/index.html
```

Expected: `1` — exactly one expansion (the `👉` paragraph at Exercise 1.1, not the Further Study bullet).

- [ ] **Step 6.6: Commit**

```bash
git add docs/.vitepress/config.ts
git commit -m "feat: wire external tutorial expansion into VitePress build"
```

---

## Task 7: Rollout to All Exercises

**Files:**
- Modify: `docs/.vitepress/external-tutorials.config.ts`

The other exercises reference SAP tutorials via the same link pattern. Add each discovered tutorial to the config map. The full list (from grepping the repo) is:

| Exercise | Tutorial ID |
| -------- | ----------- |
| ex2 | `hana-cloud-cap-create-project` |
| ex3 | `hana-cloud-cap-create-database-cds` |
| ex4 | `hana-cloud-cap-create-ui` |
| ex5 | `hana-cloud-cap-add-authentication` |
| ex6 | `hana-cloud-cap-calc-view` |
| ex7 | `hana-cloud-cap-stored-proc` |
| ex8 | `hana-cloud-cap-deploy-mta` |

All tutorials live at: `https://raw.githubusercontent.com/sap-tutorials/Tutorials/master/tutorials/{ID}/{ID}.md`

- [ ] **Step 7.1: Add all tutorial IDs to the config map**

Update `docs/.vitepress/external-tutorials.config.ts`:

```ts
export const EXTERNAL_TUTORIALS: Record<string, string> = {
  'hana-cloud-deploying':
    'https://raw.githubusercontent.com/sap-tutorials/Tutorials/master/tutorials/hana-cloud-deploying/hana-cloud-deploying.md',
  'hana-cloud-cap-create-project':
    'https://raw.githubusercontent.com/sap-tutorials/Tutorials/master/tutorials/hana-cloud-cap-create-project/hana-cloud-cap-create-project.md',
  'hana-cloud-cap-create-database-cds':
    'https://raw.githubusercontent.com/sap-tutorials/Tutorials/master/tutorials/hana-cloud-cap-create-database-cds/hana-cloud-cap-create-database-cds.md',
  'hana-cloud-cap-create-ui':
    'https://raw.githubusercontent.com/sap-tutorials/Tutorials/master/tutorials/hana-cloud-cap-create-ui/hana-cloud-cap-create-ui.md',
  'hana-cloud-cap-add-authentication':
    'https://raw.githubusercontent.com/sap-tutorials/Tutorials/master/tutorials/hana-cloud-cap-add-authentication/hana-cloud-cap-add-authentication.md',
  'hana-cloud-cap-calc-view':
    'https://raw.githubusercontent.com/sap-tutorials/Tutorials/master/tutorials/hana-cloud-cap-calc-view/hana-cloud-cap-calc-view.md',
  'hana-cloud-cap-stored-proc':
    'https://raw.githubusercontent.com/sap-tutorials/Tutorials/master/tutorials/hana-cloud-cap-stored-proc/hana-cloud-cap-stored-proc.md',
  'hana-cloud-cap-deploy-mta':
    'https://raw.githubusercontent.com/sap-tutorials/Tutorials/master/tutorials/hana-cloud-cap-deploy-mta/hana-cloud-cap-deploy-mta.md',
}
```

- [ ] **Step 7.2: Run the build**

```bash
cd docs && npm run docs:build 2>&1 | tail -20
```

Expected: build succeeds. If any tutorial URL returns 404, note the ID and check the URL manually — the convention `{ID}/{ID}.md` may not hold for all tutorials.

- [ ] **Step 7.3: Spot-check expanded pages**

```bash
grep -c 'info Source' docs/.vitepress/dist/exercises/ex2/index.html
grep -c 'info Source' docs/.vitepress/dist/exercises/ex5/index.html
grep -c 'info Source' docs/.vitepress/dist/exercises/ex6/index.html
grep -c 'info Source' docs/.vitepress/dist/exercises/ex7/index.html
```

Expected: `1` each. Ex5, ex6, and ex7 use the `Perform all the steps in 👉 [tutorial: ...]` pattern — verify these expand correctly with the inline-`👉` detection variant.

- [ ] **Step 7.4: Commit**

```bash
git add docs/.vitepress/external-tutorials.config.ts
git commit -m "feat: add all exercise tutorial IDs to external tutorials config"
```
