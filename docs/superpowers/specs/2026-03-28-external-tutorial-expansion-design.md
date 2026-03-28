# External Tutorial Inline Expansion — Design Spec

**Date:** 2026-03-28
**Status:** Approved

## Problem

Exercise READMEs reference external SAP tutorial links like:

```
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

```
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

- Runs after VitePress's `@include` preprocessor has already resolved file includes.
- Scans rendered token stream for inline links matching the `developers.sap.com/tutorials/{ID}.html` pattern.
- When a match is found and `getTutorialContent(id)` returns content, replaces the containing paragraph with:
  1. A VitePress `::: info` callout: `**Source:** These steps are from [Tutorial Title](original URL) on SAP Tutorials.`
  2. The transformed tutorial markdown, rendered as standard body content.

### Transform pipeline

Applied once per tutorial at build time, in this order:

| Step | What it does |
|------|-------------|
| Strip frontmatter | Removes the YAML block between opening and closing `---` |
| Strip HTML comments | Removes `<!-- border -->`, `<!-- description -->`, and similar SAP Tutorials processing directives |
| Rewrite image paths | `![alt](image.png)` → `![alt](RAW_BASE_URL/image.png)` where `RAW_BASE_URL` is the GitHub raw directory URL for that tutorial |
| Rewrite cross-links | Bare tutorial IDs in link hrefs `(tutorial-id)` → `(https://developers.sap.com/tutorials/tutorial-id.html)` |
| Shift headings | `###` → `####`, `##` → `###` (one level down to sit correctly under exercise `##` sections) |
| Strip dividers | Removes bare `---` horizontal rules used as step-section separators in the SAP Tutorials format |

### Changes to existing files

| File | Change |
|------|--------|
| `docs/.vitepress/config.ts` | Import and register the Vite plugin; register the markdown-it plugin in `markdown.config` |
| `exercises/*/README.md` | **None** |
| `docs/exercises/*/index.md` | **None** |

### Build-time data flow

```
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

After (VitePress rendered page):
```
::: info Source
These steps are from [Deploy SAP HANA Cloud](https://developers.sap.com/tutorials/hana-cloud-deploying.html) on SAP Tutorials.
:::

#### Add SAP HANA Cloud to your account

1. Complete the tutorial steps in [Start Using SAP HANA Cloud Trial in SAP BTP Cockpit](https://developers.sap.com/tutorials/hana-cloud-mission-trial-2.html)…

#### Create Database

1. Complete the tutorial steps in [Provision an Instance of SAP HANA Cloud](https://developers.sap.com/tutorials/hana-cloud-mission-trial-3.html)…
2. Once your system is running, click the three dots and choose Manage Configuration.
   ![Manage Configuration](https://raw.githubusercontent.com/sap-tutorials/Tutorials/master/tutorials/hana-cloud-deploying/ManageConfiguration.png)
…
```

## Rollout plan

1. Implement and validate against `exercises/ex1/README.md` (this tutorial reference)
2. Audit all other exercise READMEs for `developers.sap.com/tutorials/` links
3. Add each discovered tutorial ID to `external-tutorials.config.ts`
4. Verify rendered output for each

## Error handling

- Fetch failure at build time → Vite plugin throws → build fails with the URL and HTTP status in the error message
- Tutorial ID in a link but not in the config map → link renders as-is (no expansion, no error)
- Malformed upstream markdown → transform is best-effort; steps are included as-is if a transform step cannot parse the content
