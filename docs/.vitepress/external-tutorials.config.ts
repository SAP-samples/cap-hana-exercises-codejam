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
