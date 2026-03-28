import type MarkdownIt from 'markdown-it'
import { getTutorialContent } from './external-tutorials.js'

/** URL prefix all SAP tutorial links share. */
const SAP_TUTORIAL_RE = /https:\/\/developers\.sap\.com\/tutorials\/([a-z0-9-]+)\.html/g

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
    SAP_TUTORIAL_RE.lastIndex = 0
    let match: RegExpExecArray | null
    let id: string | undefined
    let content: string | undefined

    while ((match = SAP_TUTORIAL_RE.exec(block)) !== null) {
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
    const expanded = expandTutorialsInSource(src, getTutorialContent)
    return originalRender(expanded, env)
  }
}
