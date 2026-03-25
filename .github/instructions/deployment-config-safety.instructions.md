---
description: "Use when modifying deployment, auth, or routing config in MyHANAApp. Enforces cross-file consistency for XSUAA, AppRouter routes, and MTA destination wiring."
name: "Deployment Config Safety Checks"
applyTo: "solution/MyHANAApp/mta.yaml, solution/MyHANAApp/xs-security.json, solution/MyHANAApp/app/router/xs-app.json, solution/MyHANAApp/package.json"
---
# Deployment Config Safety Checks

When changing auth, routing, or deployment settings, verify consistency across all related files:

## Destination contract

- `solution/MyHANAApp/mta.yaml` must provide destination `srv-api` for the AppRouter module.
- `solution/MyHANAApp/app/router/xs-app.json` must route backend traffic to destination `srv-api`.

## Authentication alignment

- `solution/MyHANAApp/package.json` should keep `cds.requires.auth = xsuaa` unless intentionally changed.
- `solution/MyHANAApp/xs-security.json` should remain aligned with expected XSUAA setup.
- AppRouter routes requiring backend/API access should use `authenticationType: xsuaa` as intended.

## Safe change policy

- Prefer minimal diffs; avoid unrelated formatting changes.
- State cross-file impact in the PR/summary when config changes affect runtime behavior.
- If one file changes and related files are not updated, explicitly document why no sync change is needed.
