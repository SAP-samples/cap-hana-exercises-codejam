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
      cache.clear()
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
