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

## Shared Implementation Notes

- The document's top-level `# Instructor Setup for CodeJam` H1 heading is preserved unchanged.
- All new top-level sections are `##`-level headings. The four subsections within Pre-Event Setup are `###`-level headings.
- Each section currently opens with a generic prose line (e.g., "Instructions on how to…"). **Replace** each of these with the new one-sentence context intro described per section below — do not retain the old line alongside the new one.
- The `> ⚠️ **Important:**` blockquote callout format is chosen for HANA Cloud warnings. The repo has no existing warning-callout convention; no conflict exists.
- Anchor-link safety for the "Clean Up After the Event" rename was verified by searching the repo for the string `clean-up-after` and `InstructorSetup` across all Markdown files — no inbound anchor links were found. Confirmed safe to rename.

---

## Document Structure

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

- The "Enable CF" item includes co-instructors as a parenthetical — this step (existing line 18) is a one-time setup for a persistent space and does not warrant a separate checklist line.
- The user item stays as a single combined line despite the two distinct sub-steps in section 3d — the checklist is a scan aid, not a 1:1 mirror of every sub-step.

### 3. Pre-Event Setup (`##`)

Four `###`-level subsections, each with a new one-sentence context intro (replacing the existing generic "Instructions on how to…" line) and numbered steps.

#### 3a. The SAP BTP SubAccount (`###`)

- Rename heading: "The SAP BTP SubAccount Details" → "The SAP BTP SubAccount" (drop "Details").
- Replace existing intro line with context sentence: this is a shared, persistent subaccount — do not create a new one.
- Fix typo: "Direcotries" → "Directories"
- Fix missing space: "section.There" → "section. There"
- Numbered steps unchanged otherwise.

#### 3b. Enable Cloud Foundry and Create a `dev` Space (`###`)

- Fix heading capitalisation: change `` `Dev` `` → `` `dev` `` in the heading to match the actual CF space name.
- Replace existing intro line with context sentence: CF is required because participants deploy HDI container service instances into this space.
- Fix typos: "Enviroment" (one instance in this section) → "Environment", "Enablment" → "Enablement"
- Numbered steps unchanged otherwise (including the step to add co-instructors as Space Members with all roles).

#### 3c. Provisioning of SAP HANA Cloud (`###`)

- Heading text "Provisioning of SAP HANA Cloud" is preserved unchanged.
- Replace existing intro line with context sentence: a single shared HANA Cloud instance serves all participants.
- Keep the tutorial link step as-is, including the trailing sentence ("You now have an SAP HANA database fully accessible…").
- Add a `> ⚠️ **Important:**` blockquote callout after the tutorial step, covering two steps easy to miss:
  1. **CF org/space mapping** — the HANA Cloud instance must be mapped to the Cloud Foundry org and space.
  2. **Allow All IP Addresses** — the instance's allowed connections must be set to "Allow All IP Addresses"; without this, dev tools (BAS, etc.) cannot connect.

#### 3d. Adding Users (`###`)

- Heading text "Adding Users" is preserved unchanged.
- No typos to fix in this section.
- Replace existing intro line with context sentence: participants need both a BTP subaccount user and a CF space membership to complete all exercises.
- Add explicit note: the `CodeJam` Role Collection **already exists** (pre-built with all 41 roles covering BAS, HANA Cloud, Destinations, and more) — do not create a new one, simply assign the existing one.
- Clarify the user setup as two distinct numbered actions:
  1. Create user in `Security → Users` and assign the `CodeJam` Role Collection.
  2. Add the same user as a member of the CF `dev` Space.

### 4. After the Event (`##`)

- Rename heading from "Clean Up After the Event" to "After the Event" (anchor-link safety confirmed — see Shared Implementation Notes).
- Replace existing intro line with context sentence: cleanup avoids ongoing costs and resets the subaccount for the next event.
- Fix typo: "Enviroment" → "Environment"
- Numbered step order unchanged:
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
