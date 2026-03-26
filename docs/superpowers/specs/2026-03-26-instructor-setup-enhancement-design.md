# Design: InstructorSetup.md Enhancement

**Date:** 2026-03-26
**Scope:** Rewrite and expand `InstructorSetup.md` for both first-time and returning instructors.

---

## Problem

The current `InstructorSetup.md` is sparse (~55 lines), contains several typos, has no intro or context, no quick-reference checklist, and is missing two critical warnings in the HANA Cloud provisioning section that have caused problems at events.

## Audience

Both first-time instructors (need thorough end-to-end guidance) and returning instructors (need a scannable reference). The document must serve both without being bloated.

## Approach

Full restructure (Option B): add introduction, pre-event checklist, expand each section with a one-sentence "why this matters" context, fix all typos, add HANA Cloud warnings, separate cleanup into its own named part.

---

## Document Structure

### 1. Introduction
- 2–3 sentences: what this document covers, that all steps must be completed before the event day, and what access the instructor needs (Global Account administrator access).

### 2. Pre-Event Checklist
- A `- [ ]` tick-list of 5–6 items covering every major action.
- Targeted at returning instructors who want a quick scan before an event.
- Items mirror the subsections in Pre-Event Setup.

### 3. Pre-Event Setup
Four subsections, each with a one-sentence context intro and numbered steps:

#### 3a. The SAP BTP SubAccount
- Fix typo: "Direcotries" → "Directories"
- Context: this is a shared, persistent subaccount — do not create a new one.
- Steps unchanged otherwise.

#### 3b. Enable Cloud Foundry and Create a `dev` Space
- Fix typos: "Enviroment" (×2) → "Environment", "Enablment" → "Enablement", "Enablment dialog" → "Enablement dialog"
- Context: CF is required because participants deploy HDI container service instances into this space.
- Steps unchanged otherwise.

#### 3c. Provision SAP HANA Cloud
- Context: a single shared HANA Cloud instance serves all participants.
- Keep the link to the SAP tutorial.
- Add a prominent warning callout (⚠️) for two steps that are covered in the tutorial but are easy to miss and cause serious problems if skipped:
  1. **CF org/space mapping** — the HANA Cloud instance must be mapped to the Cloud Foundry org and space.
  2. **Allow All IP Addresses** — the instance's allowed connections must be set to "Allow All IP Addresses"; without this, dev tools (BAS, etc.) cannot connect.

#### 3d. Adding Users
- Context: participants need both a BTP subaccount user and a CF space membership to complete all exercises.
- Expand to explicitly state: the `CodeJam` Role Collection **already exists** (pre-built with all 41 roles covering BAS, HANA Cloud, Destinations, and more). Do not create a new one — simply assign the existing one.
- Clarify the two-step flow as distinct numbered actions:
  1. Create user in `Security → Users`, assign the `CodeJam` Role Collection.
  2. Add the same user as a member of the CF `dev` Space.

### 4. After the Event
- One-sentence intro: cleanup avoids ongoing costs and resets the subaccount for the next event.
- Fix typo: "Enviroment" → "Environment"
- Step order unchanged:
  1. Delete HDI container service instances
  2. Disable the Cloud Foundry Environment
  3. Delete the HANA Cloud instance
  4. Remove users
  5. Delete role collections created by workshop users

---

## Out of Scope

- Timing labels per step (order is sufficient)
- A separate checklist file (single-document approach preferred)
- Changes to any other file in the repository
