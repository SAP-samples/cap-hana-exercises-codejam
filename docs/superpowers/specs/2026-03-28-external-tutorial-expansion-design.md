# External Tutorial Inline Expansion — Design Spec

**Date:** 2026-03-28
**Status:** Approved

## Problem

Exercise READMEs reference external SAP tutorial links like:

```markdown
👉 Perform all the steps in the tutorial: [Deploy SAP HANA Cloud](https://developers.sap.com/tutorials/hana-cloud-deploying.html).
```

On GitHub this renders fine as a clickable link. In the VitePress site, we want the actual tutorial steps expanded inline — no copy-paste, no divergence, fully sourced from the upstream repo.

## Goals

- Render full tutorial steps inline in VitePress, sourced from the canonical SAP Tutorials GitHub repo
- Zero changes to the source `exercises/*/README.md` files (they stay valid for GitHub rendering)
- Fully static output — no runtime network requests, no client-side fetching
- Scales to multiple tutorials across all exercises: adding a new one is one line of config
- Attribution banner with link back to the original tutorial on every expanded block

## Non-Goals

- Live/real-time content updates (build-time snapshot is sufficient)
- Downloading or self-hosting tutorial images (GitHub raw URLs are used instead)
- Modifying the VitePress wrapper pages (`docs/exercises/*/index.md`)

## Architecture

### Detection strategy

Rather than adding markers to source files, the build pipeline detects the **existing link pattern** automatically. Any markdown paragraph containing a link whose `href` matches:

```text
https://developers.sap.com/tutorials/{TUTORIAL_ID}.html
```

where `TUTORIAL_ID` is a key in the tutorial config map, is expanded inline. Links to unconfigured tutorials pass through unchanged — full backward compatibility.

### New files

#### `docs/.vitepress/external-tutorials.config.ts`

Single source-of-truth config map: tutorial ID → GitHub raw markdown URL.

```ts
export const EXTERNAL_TUTORIALS: Record<string, string> = {
  'hana-cloud-deploying':
    'https://raw.githubusercontent.com/sap-tutorials/Tutorials/master/tutorials/hana-cloud-deploying/hana-cloud-deploying.md',
}
```

Adding a new tutorial = one entry in this map.

#### `docs/.vitepress/plugins/external-tutorials.ts`

Vite plugin responsible for fetching and caching tutorial content.

- **`buildStart` hook** (async): reads `EXTERNAL_TUTORIALS`, fetches all raw markdown URLs in parallel (`Promise.all`), runs each through the transform pipeline, stores results in a module-level `Map<string, string>`.
- Exports a `getTutorialContent(id: string): string | undefined` function used by the markdown-it plugin.
- Build fails with a clear error if any fetch fails (correct behavior for a static site).

#### `docs/.vitepress/plugins/md-expand-tutorials.ts`

markdown-it plugin registered via `markdown.config` in `config.ts`.

- Runs after VitePress's `@include` preprocessor has already resolved file includes (VitePress calls `processIncludes` on the source string before `md.render`, so by the time this plugin runs the full merged markdown is in memory).
- **Implementation pattern:** wraps `md.render` to perform a **pre-parse source string substitution** before calling the original renderer — the same pattern already used in `config.ts` for the `<details>` wrapper fix (lines 38–49). This is required because `::: info` container fences must appear in the markdown source to be recognised by `markdown-it-container`; injecting them as token-level `html_block` nodes after parsing would cause them to render as literal text.
- Scans the markdown source string for blocks (paragraphs or list items) that **both**:
  1. Contain `👉` anywhere in the block, and
  2. Contain at least one link whose `href` matches `https://developers.sap.com/tutorials/{ID}.html` where `ID` is a key in the config map.

  This matches all real exercise link patterns, which fall into two variants:
  - `👉 Perform all the steps in the tutorial: [Title](URL)` — `👉` at paragraph start (ex1, ex2, ex3, ex4, ex8)
  - `Perform all the steps in 👉 [tutorial: Title](URL)` — `👉` inline before the link text (ex5, ex6, ex7)

  Links in bullet list items without `👉` (e.g. Further Study sections) are not matched and pass through unchanged.

- **Multi-link blocks** (e.g. a block containing two configured tutorial links): expand only the first configured match in the block; leave the remainder as-is. A block with only unconfigured links passes through unchanged.

- When a match is found and `getTutorialContent(id)` returns content, replaces the matching block in the markdown source with:
  1. A `::: info Source` callout: `These steps are from [Tutorial Title](original URL) on SAP Tutorials.`
  2. The transformed tutorial markdown, appended immediately after the callout.

### Transform pipeline

Applied once per tutorial at build time, in this order:

| Step | What it does |
| ---- | ------------ |
| Strip frontmatter | Removes the YAML block between opening and closing `---` delimiters |
| Strip HTML comments | Removes `<!-- border -->`, `<!-- description -->`, and similar SAP Tutorials processing directives |
| Strip intro sections | Removes the leading `# Title`, `## You will learn`, `## Get to know …`, and `## Intro` sections that precede the actual numbered steps. Only the step sections (those under `### Step title` headings) are retained. |
| Rewrite image paths | `![alt](image.png)` → `![alt](RAW_BASE_URL/image.png)` where `RAW_BASE_URL` is the GitHub raw directory URL for that tutorial. Applies only to image syntax (`![...](...)`), not link syntax. |
| Rewrite cross-links | Bare tutorial IDs in markdown link hrefs — matched as `[text](id)` where `id` is a bare word containing only `[a-z0-9-]` with no dot, no protocol, and no leading `!` (to avoid matching image srcs) — are rewritten to `(https://developers.sap.com/tutorials/id.html)` |
| Shift headings | `#` (h1) is dropped entirely; `##` → `###`; `###` → `####`. This maps the tutorial's step headings to one level below the exercise's own `##` sections, and removes the tutorial's page-title h1 which would conflict with the VitePress page title. |
| Strip dividers | Removes bare `---` horizontal rules. After frontmatter stripping, two `---` occurrences remain in the body: one between the intro and the first step section, and one at the end of the file. Both are stripped. |

### Changes to existing files

| File | Change |
| ---- | ------ |
| `docs/.vitepress/config.ts` | Import and register the Vite plugin; register the markdown-it plugin in `markdown.config` |
| `exercises/*/README.md` | **None** |
| `docs/exercises/*/index.md` | **None** |

### Build-time data flow

```text
vitepress build
  └─ Vite buildStart (async, awaited)
       └─ fetch all configured tutorials from GitHub raw → transform → populate Map
  └─ VitePress processes docs/exercises/ex1/index.md
       └─ @include preprocessor: resolves <!--@include: ../../../exercises/ex1/README.md-->
            └─ README content (including the developers.sap.com link) merged into page markdown
       └─ markdown-it pipeline runs
            └─ md-expand-tutorials plugin
                 └─ detects link: developers.sap.com/tutorials/hana-cloud-deploying.html
                 └─ replaces paragraph with: attribution callout + transformed steps
       └─ VitePress renders HTML
```

`docs:dev` works identically — `buildStart` fires when the dev server starts, before any page is served.

## Rendered output (Exercise 1.1)

Before (source README, unchanged):
```markdown
👉 Perform all the steps in the tutorial: [Deploy SAP HANA Cloud](https://developers.sap.com/tutorials/hana-cloud-deploying.html).
```

After (VitePress rendered page — steps only, intro sections stripped):

```markdown
::: info Source
These steps are from [Deploy SAP HANA Cloud](https://developers.sap.com/tutorials/hana-cloud-deploying.html) on SAP Tutorials.
:::

1. Complete the tutorial steps in [Start Using SAP HANA Cloud Trial in SAP BTP Cockpit](https://developers.sap.com/tutorials/hana-cloud-mission-trial-2.html)…

#### Create Database

1. Complete the tutorial steps in [Provision an Instance of SAP HANA Cloud](https://developers.sap.com/tutorials/hana-cloud-mission-trial-3.html)…
2. Once your system is running, click the three dots and choose Manage Configuration.
   ![Manage Configuration](https://raw.githubusercontent.com/sap-tutorials/Tutorials/master/tutorials/hana-cloud-deploying/ManageConfiguration.png)
…
```

Note: the tutorial's `# Deploy SAP HANA Cloud` h1, the `## You will learn`, `## Get to know SAP HANA Cloud`, and `## Intro` sections are stripped by the transform pipeline and do not appear in the rendered output.

## Rollout plan

1. Implement and validate against `exercises/ex1/README.md` (this tutorial reference)
2. Audit all other exercise READMEs for `developers.sap.com/tutorials/` links
3. Add each discovered tutorial ID to `external-tutorials.config.ts`
4. Verify rendered output for each

## Error handling

- Fetch failure at build time → Vite plugin throws with the URL and HTTP status → build fails. This is the correct behavior for a static site: a broken upstream dependency should not silently produce a page with a missing section.
- Tutorial ID in a link but not in the config map → link renders as-is (no expansion, no error).
- Malformed upstream markdown → format deviations produce incorrect but safe output (the transform steps are all regex string operations and do not throw). The practical failure modes are: (a) frontmatter not fenced with `---`, causing the body to be empty; (b) heading shift leaves unexpected levels if the upstream adds new heading depths; (c) an image path with a subdirectory, defeating the simple base-URL prefix. Rollout step 4 ("verify rendered output") is the manual safety check against all of these.
