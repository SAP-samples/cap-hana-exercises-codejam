---
description: "Edit or improve CodeJam documentation with tutorial-first style, minimal diffs, and link-first references to canonical docs."
name: "CodeJam Doc Edit"
argument-hint: "What doc change do you want? (file + intent)"
agent: "agent"
---
Improve the requested documentation in this repository using the existing CodeJam style.

## Inputs

- User request: ${input:What should be changed?}

## Requirements

- Keep edits targeted and minimal.
- Preserve workshop/tutorial flow and “do this next” clarity.
- Prefer links to canonical docs instead of duplicating long setup/process text:
  - `prerequisites.md`
  - `CONTRIBUTING.md`
  - `README.md`
  - `InstructorSetup.md`
- Keep SAP terminology and exercise sequencing consistent with existing READMEs.
- Validate and fix any affected internal markdown links.

## Output format

1. Short summary of changes made.
2. File list with one-line purpose per file.
3. Any follow-up suggestions (optional, concise).

Use `./instructions/docs-style.instructions.md` as the style baseline when applicable.
