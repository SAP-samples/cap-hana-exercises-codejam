# Translation Guide

This directory is the foundation for multi-language support. The site currently ships English only, but the infrastructure is ready for additional languages.

## Adding a Language

1. **Uncomment the locale entry** in `docs/.vitepress/config.ts`:

   ```ts
   locales: {
     root: { label: 'English', lang: 'en-US' },
     de: { label: 'Deutsch', lang: 'de', link: '/de/' },  // ← uncomment
   }
   ```

2. **Create the language directory**: `docs/de/` (use the BCP 47 language code)

3. **Mirror the docs structure**: Copy every wrapper page from `docs/` into `docs/de/`, preserving the same file names and structure.

4. **Translate the wrapper content**: Translate frontmatter (`title`, `description`), callouts (`::: tip`), and any hand-written content. Do NOT translate the source files (`exercises/*/README.md`, etc.) — those remain the single source of truth.

5. **Update `<!--@include-->` paths**: Paths in translated wrappers point to the same source files — they are language-neutral. Example from `docs/de/exercises/ex1/index.md`:

   ```markdown
   <!--@include: ../../../../exercises/ex1/README.md-->
   ```

## Using AI for Translation

AI tools (Claude, GPT-4, etc.) can translate the wrapper pages effectively. Provide the following context prompt:

```
Translate the following VitePress markdown page from English to [LANGUAGE].
Preserve all markdown syntax, frontmatter keys (translate only values),
code blocks (do not translate code), and <!--@include--> directives exactly.
Only translate visible prose — titles, descriptions, callout text, and table content.
```

## Language Codes

| Language | Code | Directory |
| --- | --- | --- |
| German | `de` | `docs/de/` |
| Japanese | `ja` | `docs/ja/` |
| Spanish | `es` | `docs/es/` |
| Portuguese | `pt` | `docs/pt/` |
| French | `fr` | `docs/fr/` |
| Chinese (Simplified) | `zh` | `docs/zh/` |
