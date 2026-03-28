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
  return src.replace(/<!--[\s\S]*?-->/g, '')
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
