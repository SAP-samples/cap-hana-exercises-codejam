import type MarkdownIt from 'markdown-it'
import { getTutorialContent } from './external-tutorials.js'

/** URL prefix all SAP tutorial links share. */
const SAP_TUTORIAL_PATTERN = /https:\/\/developers\.sap\.com\/tutorials\/([a-z0-9-]+)\.html/g

/**
 * Rewrites relative exercise README links to VitePress clean URLs.
 * e.g. ../ex2/README.md → /exercises/ex2/
 * These links are valid on GitHub but 404 in the VitePress site because
 * the wrapper pages live at docs/exercises/exN/index.md, not README.md.
 */
export function rewriteExerciseLinks(src: string): string {
  return src.replace(/\.\.\/(ex\d)\/README\.md/g, '/exercises/$1/')
}

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

    // Find the first configured tutorial link in this block (iterate all matches)
    let id: string | undefined
    let content: string | undefined

    for (const match of block.matchAll(SAP_TUTORIAL_PATTERN)) {
      const candidateId = match[1]
      const candidateContent = getContent(candidateId)
      if (candidateContent !== undefined) {
        id = candidateId
        content = candidateContent
        break
      }
    }

    if (!id || content === undefined) return block

    // Extract link title for the matched ID (strip "tutorial: " prefix if present)
    const linkRe = new RegExp(
      `\\[([^\\]]+)\\]\\(https:\\/\\/developers\\.sap\\.com\\/tutorials\\/${id}\\.html\\)`
    )
    const titleMatch = block.match(linkRe)
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
    const rewritten = rewriteExerciseLinks(src)
    const expanded = expandTutorialsInSource(rewritten, getTutorialContent)
    return originalRender(expanded, env)
  }
}
