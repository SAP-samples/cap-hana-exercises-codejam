import { describe, it, expect } from 'vitest'
import { transformTutorial } from './transform-tutorial.js'

const BASE = 'https://raw.githubusercontent.com/sap-tutorials/Tutorials/master/tutorials/hana-cloud-deploying/'

describe('transformTutorial', () => {
  it('strips YAML frontmatter', () => {
    const src = '---\nparser: v2\ntime: 15\n---\n\n### Step\n\n1. Do it.'
    const result = transformTutorial(src, BASE)
    expect(result).not.toContain('parser: v2')
    expect(result).toContain('Do it.')
  })

  it('strips HTML comments', () => {
    const src = '---\n---\n\n### Step\n\n<!-- border -->![img](a.png)\n<!-- description --> text'
    const result = transformTutorial(src, BASE)
    expect(result).not.toContain('<!-- border -->')
    expect(result).not.toContain('<!-- description -->')
    expect(result).toContain('![img]')
  })

  it('strips intro sections — keeps only content from the first ### heading', () => {
    const src = '---\n---\n\n# Title\n\n## You will learn\n\n- bullet\n\n## Intro\n\nsome text\n\n---\n\n### Step One\n\n1. Do it.'
    const result = transformTutorial(src, BASE)
    expect(result).not.toContain('# Title')
    expect(result).not.toContain('You will learn')
    expect(result).not.toContain('Intro')
    expect(result).toContain('Step One')
    expect(result).toContain('Do it.')
  })

  it('rewrites relative image paths to absolute GitHub raw URLs', () => {
    const src = '---\n---\n\n### Step\n\n![Allow All IP](trial4.png)'
    const result = transformTutorial(src, BASE)
    expect(result).toContain(`![Allow All IP](${BASE}trial4.png)`)
  })

  it('does NOT rewrite image paths that are already absolute', () => {
    const src = '---\n---\n\n### Step\n\n![img](https://example.com/img.png)'
    const result = transformTutorial(src, BASE)
    expect(result).toContain('![img](https://example.com/img.png)')
  })

  it('rewrites bare tutorial cross-links to full developers.sap.com URLs', () => {
    const src = '---\n---\n\n### Step\n\n1. See [Getting Started](hana-cloud-mission-trial-2).'
    const result = transformTutorial(src, BASE)
    expect(result).toContain('[Getting Started](https://developers.sap.com/tutorials/hana-cloud-mission-trial-2.html)')
  })

  it('does NOT rewrite image srcs as tutorial cross-links', () => {
    const src = '---\n---\n\n### Step\n\n![alt](trial4.png)'
    const result = transformTutorial(src, BASE)
    // image src must not become a developers.sap.com URL
    expect(result).not.toContain('developers.sap.com/tutorials/trial4')
  })

  it('does NOT rewrite already-absolute links as cross-links', () => {
    const src = '---\n---\n\n### Step\n\n[SAP HANA Cloud](https://developers.sap.com/topics/hana.html)'
    const result = transformTutorial(src, BASE)
    // absolute URL must pass through unchanged
    expect(result).toContain('[SAP HANA Cloud](https://developers.sap.com/topics/hana.html)')
    // and must not be double-wrapped
    expect(result).not.toContain('developers.sap.com/tutorials/https')
  })

  it('drops h1 headings', () => {
    const src = '---\n---\n\n# Deploy SAP HANA Cloud\n\n### Step\n\n1. Do it.'
    const result = transformTutorial(src, BASE)
    expect(result).not.toContain('# Deploy SAP HANA Cloud')
  })

  it('shifts ## → ### and ### → ####', () => {
    const src = '---\n---\n\n### Step A\n\n## Section B\n\n1. item'
    const result = transformTutorial(src, BASE)
    expect(result).toContain('#### Step A')
    expect(result).toContain('### Section B')
    // original levels must not appear as headings
    expect(result).not.toMatch(/^### Step A/m)
    expect(result).not.toMatch(/^## Section B/m)
  })

  it('strips bare --- dividers', () => {
    const src = '---\nfm: true\n---\n\n### Step\n\n1. item\n\n---\n\n1. more\n\n---'
    const result = transformTutorial(src, BASE)
    // Only the frontmatter --- should have been consumed; remaining --- stripped
    expect(result).not.toMatch(/^---$/m)
    expect(result).toContain('1. item')
    expect(result).toContain('1. more')
  })

  it('strips HTML comments that contain a > character', () => {
    const src = '---\n---\n\n### Step\n\n<!-- description --> Create instances where n > 0'
    const result = transformTutorial(src, BASE)
    expect(result).not.toContain('<!-- description -->')
  })

  it('does not treat frontmatter content as the first ### step heading', () => {
    const src = '---\nparser: v2\n### not-a-step: value\n---\n\n### Real Step\n\n1. Do it.'
    const result = transformTutorial(src, BASE)
    expect(result).not.toContain('parser: v2')
    expect(result).toContain('Real Step')
  })
})
