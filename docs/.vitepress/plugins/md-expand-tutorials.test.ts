import { describe, it, expect, beforeEach } from 'vitest'
import { expandTutorialsInSource, rewriteExerciseLinks } from './md-expand-tutorials.js'

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

describe('rewriteExerciseLinks', () => {
  it('rewrites ../exN/README.md to /exercises/exN/', () => {
    const src = '👉 [Exercise 2](../ex2/README.md)'
    expect(rewriteExerciseLinks(src)).toBe('👉 [Exercise 2](/exercises/ex2/)')
  })

  it('rewrites all occurrences in a document', () => {
    const src = 'See [ex1](../ex1/README.md) and [ex8](../ex8/README.md).'
    expect(rewriteExerciseLinks(src)).toBe('See [ex1](/exercises/ex1/) and [ex8](/exercises/ex8/).')
  })

  it('does not modify unrelated links', () => {
    const src = '[GitHub](https://github.com) and [prereqs](../prerequisites.md)'
    expect(rewriteExerciseLinks(src)).toBe(src)
  })
})
