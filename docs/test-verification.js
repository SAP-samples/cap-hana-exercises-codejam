import { transformTutorial } from './.vitepress/plugins/transform-tutorial.js'

const BASE = 'https://raw.githubusercontent.com/sap-tutorials/Tutorials/master/tutorials/hana-cloud-deploying/'

// Test: image src should NOT be rewritten as cross-link (negative lookbehind check)
const testImageNotCrossLink = () => {
  const src = '---\n---\n\n### Step\n\n![alt](trial4.png)'
  const result = transformTutorial(src, BASE)
  const hasDevUrl = result.includes('developers.sap.com/tutorials/trial4')
  return { pass: !hasDevUrl, result, error: hasDevUrl ? 'Image was incorrectly rewritten as tutorial link' : null }
}

// Test: absolute link NOT double-wrapped
const testAbsoluteNotDoubleWrapped = () => {
  const src = '---\n---\n\n### Step\n\n[SAP HANA Cloud](https://developers.sap.com/topics/hana.html)'
  const result = transformTutorial(src, BASE)
  const hasDouble = result.includes('developers.sap.com/tutorials/https')
  return { pass: !hasDouble, result, error: hasDouble ? 'Absolute URL was double-wrapped' : null }
}

// Test: heading shift order (### before ## to avoid collision)
const testHeadingShiftOrder = () => {
  const src = '---\n---\n\n### Step A\n\n## Section B'
  const result = transformTutorial(src, BASE)
  const hasOriginal3 = /^### Step A/m.test(result)
  const hasOriginal2 = /^## Section B/m.test(result)
  const has4 = /^#### Step A/m.test(result)
  const has3 = /^### Section B/m.test(result)
  return { pass: !hasOriginal3 && !hasOriginal2 && has4 && has3, result, error: null }
}

console.log('TEST: Image not treated as cross-link')
console.log(testImageNotCrossLink())
console.log('\nTEST: Absolute link not double-wrapped')
console.log(testAbsoluteNotDoubleWrapped())
console.log('\nTEST: Heading shift order')
console.log(testHeadingShiftOrder())
