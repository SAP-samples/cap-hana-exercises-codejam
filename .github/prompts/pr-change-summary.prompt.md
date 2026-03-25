---
description: "Summarize current workspace changes for a PR, including docs/config impact, risk notes, and verification status."
name: "PR Change Summary"
argument-hint: "Optional focus (e.g., docs only, auth changes, deployment changes)"
agent: "agent"
---
Produce a pull request-ready summary of the current workspace changes.

## Inputs

- Optional focus: ${input:Optional focus area (or leave blank)}

## Requirements

- Inspect current changes and summarize intent, not just file names.
- Include a concise per-file impact summary.
- Highlight cross-file consistency checks for config/auth/routing changes when applicable:
  - `solution/MyHANAApp/mta.yaml`
  - `solution/MyHANAApp/xs-security.json`
  - `solution/MyHANAApp/app/router/xs-app.json`
  - `solution/MyHANAApp/package.json`
- Call out risks, follow-ups, and any validation gaps.
- Keep the result concise and reviewer-friendly.

## Output format

1. PR title suggestion.
2. Short overview.
3. File-by-file change summary.
4. Validation performed.
5. Risks / follow-ups.

Use `./instructions/deployment-config-safety.instructions.md` when deployment/auth/routing files are in scope.
