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

The document's top-level `# Instructor Setup for CodeJam` H1 heading is preserved unchanged.

All new top-level sections (Introduction, Pre-Event Checklist, Pre-Event Setup, After the Event) are `##`-level headings. The four subsections within Pre-Event Setup are `###`-level headings.

The `> ⚠️ **Important:**` blockquote callout format is chosen for the HANA Cloud warnings. The repo has no existing warning-callout convention, so no conflict exists.

### 1. Introduction (`##`)

2–3 sentences: what this document covers, that all steps must be completed before the event day, and what access the instructor needs (Global Account administrator access).

### 2. Pre-Event Checklist (`##`)

A `- [ ]` tick-list of 6 items covering every discrete action, targeted at returning instructors who want a quick scan before an event:

- [ ] Navigate to the SAP BTP subaccount
- [ ] Enable Cloud Foundry and create the `dev` space (including adding co-instructors as Space Members)
- [ ] Provision the SAP HANA Cloud instance
- [ ] Map the HANA Cloud instance to the CF org and space
- [ ] Set HANA Cloud allowed connections to "Allow All IP Addresses"
- [ ] Create participant users, assign the `CodeJam` Role Collection, and add to the CF `dev` space

Notes:

- The "Enable CF" checklist item explicitly includes adding co-instructors as Space Members, since this step (existing line 18 of the file) is preserved in the detailed instructions but easy to overlook. It is kept as a parenthetical within the existing item rather than a separate 7th item, since it is a one-time setup for a persistent space.
- The checklist user item stays as a single combined line despite the two distinct sub-steps in section 3d — the checklist is a scan aid, not a 1:1 mirror of every sub-step.

### 3. Pre-Event Setup (`##`)

Four `###`-level subsections, each with a one-sentence context intro and numbered steps.

#### 3a. The SAP BTP SubAccount (`###`)

- Rename heading: "The SAP BTP SubAccount Details" → "The SAP BTP SubAccount" (drop "Details").
- Fix typo: "Direcotries" → "Directories"
- Fix missing space: "section.There" → "section. There"
- Context sentence: this is a shared, persistent subaccount — do not create a new one.
- Steps unchanged otherwise.

#### 3b. Enable Cloud Foundry and Create a `dev` Space (`###`)

- Fix heading capitalisation: change `` `Dev` `` → `` `dev` `` to match the actual CF space name used throughout the document.
- Fix typos: "Enviroment" (one instance) → "Environment", "Enablment" → "Enablement"
- Context sentence: CF is required because participants deploy HDI container service instances into this space.
- Steps unchanged otherwise (including the step to add co-instructors as Space Members with all roles).

#### 3c. Provision SAP HANA Cloud (`###`)

- Context sentence: a single shared HANA Cloud instance serves all participants.
- Keep the link to the SAP tutorial.
- Add a warning callout after the tutorial link using a `> ⚠️ **Important:**` blockquote, covering two steps that are easy to miss and cause serious problems if skipped:
  1. **CF org/space mapping** — the HANA Cloud instance must be mapped to the Cloud Foundry org and space.
  2. **Allow All IP Addresses** — the instance's allowed connections must be set to "Allow All IP Addresses"; without this, dev tools (BAS, etc.) cannot connect.

#### 3d. Adding Users (`###`)

- No typos to fix in this section.
- Context sentence: participants need both a BTP subaccount user and a CF space membership to complete all exercises.
- Add explicit note: the `CodeJam` Role Collection **already exists** (pre-built with all 41 roles covering BAS, HANA Cloud, Destinations, and more) — do not create a new one, simply assign the existing one.
- Clarify the user setup as two distinct numbered actions:
  1. Create user in `Security → Users` and assign the `CodeJam` Role Collection.
  2. Add the same user as a member of the CF `dev` Space.

### 4. After the Event (`##`)

- Rename from "Clean Up After the Event" to "After the Event". No inbound anchor links exist in the repo pointing to the old heading — confirmed safe to rename.
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
