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
  // ex1.1
  'hana-cloud-deploying':
    'https://raw.githubusercontent.com/sap-tutorials/Tutorials/master/tutorials/hana-cloud-deploying/hana-cloud-deploying.md',
  // ex1.2 — source lives in sap-tutorials/btp-adai, not the main Tutorials repo
  'appstudio-onboarding':
    'https://raw.githubusercontent.com/sap-tutorials/btp-adai/main/tutorials/appstudio-onboarding/appstudio-onboarding.md',
  // ex2
  'hana-cloud-cap-create-project':
    'https://raw.githubusercontent.com/sap-tutorials/Tutorials/master/tutorials/hana-cloud-cap-create-project/hana-cloud-cap-create-project.md',
  // ex3
  'hana-cloud-cap-create-database-cds':
    'https://raw.githubusercontent.com/sap-tutorials/Tutorials/master/tutorials/hana-cloud-cap-create-database-cds/hana-cloud-cap-create-database-cds.md',
  // ex4
  'hana-cloud-cap-create-ui':
    'https://raw.githubusercontent.com/sap-tutorials/Tutorials/master/tutorials/hana-cloud-cap-create-ui/hana-cloud-cap-create-ui.md',
  // ex5
  'hana-cloud-cap-add-authentication':
    'https://raw.githubusercontent.com/sap-tutorials/Tutorials/master/tutorials/hana-cloud-cap-add-authentication/hana-cloud-cap-add-authentication.md',
  // ex6
  'hana-cloud-cap-calc-view':
    'https://raw.githubusercontent.com/sap-tutorials/Tutorials/master/tutorials/hana-cloud-cap-calc-view/hana-cloud-cap-calc-view.md',
  // ex7
  'hana-cloud-cap-stored-proc':
    'https://raw.githubusercontent.com/sap-tutorials/Tutorials/master/tutorials/hana-cloud-cap-stored-proc/hana-cloud-cap-stored-proc.md',
  // ex8
  'hana-cloud-cap-deploy-mta':
    'https://raw.githubusercontent.com/sap-tutorials/Tutorials/master/tutorials/hana-cloud-cap-deploy-mta/hana-cloud-cap-deploy-mta.md',
}

/** Derive the raw directory base URL from a raw file URL (used for image rewriting). */
export function rawBaseUrl(rawFileUrl: string): string {
  return rawFileUrl.slice(0, rawFileUrl.lastIndexOf('/') + 1)
}
