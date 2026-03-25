---
description: "Write or update tests for CAP service handlers in solution/MyHANAApp/srv with minimal diffs and auth-aware coverage."
name: "CAP Service Test Write"
argument-hint: "What service behavior should be tested?"
agent: "agent"
---
Create or update tests for CAP service logic in this repository.

## Inputs

- Request: ${input:What service behavior should be tested?}

## Scope and context

- Focus on `solution/MyHANAApp/srv/*` behavior and any related CDS service contracts.
- Keep authorization semantics intact (`@requires`, `@restrict`) unless explicitly requested.
- Follow existing project patterns and avoid introducing new frameworks.

## Requirements

- Add tests only where they provide clear value for the requested behavior.
- Cover happy-path and at least one relevant edge/error-path scenario.
- Keep edits targeted and minimal.
- If test infrastructure is missing or ambiguous, propose the smallest viable approach and implement it.
- Do not change unrelated runtime configuration.

## Output format

1. Summary of what was tested.
2. Files added/changed with one-line purpose each.
3. How verification was performed (or what blocked full verification).

Use `./instructions/cap-service-guardrails.instructions.md` as a baseline when service files are involved.
