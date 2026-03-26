# README Improvement Design — 2026-03-26

## Context

Repository: `cap-hana-exercises-codejam`
File in scope: `README.md`
Primary audience: **Event attendees** arriving before or at a CodeJam (not GitHub discovery traffic).
Approach chosen: **Option A — Attendee-first restructure**

---

## Goals

- Surface the "what you'll build" and "where to start" content immediately
- Give each exercise a one-sentence description so attendees have a map of the journey
- Move Known Issues to just before the exercise list (attendees hit this in Exercise 3)
- Expose the Dev Container / Codespace options that are currently invisible from the README
- Trim the verbose "What is X?" prose in Further Resources to signal-only content
- Fix the "Credley" badge alt-text typo

---

## Proposed Section Order

| # | Section | Change |
|---|---------|--------|
| 1 | Title + badges (REUSE + Credly) | Fix "Credley" → "Credly" in alt text; move the Credly badge from its current position (after the Description paragraph) to immediately below the REUSE badge, adjacent to the title |
| 2 | Description | Replace single dense paragraph with a short orientation sentence + tech stack bullet list (CAP, HANA Cloud, BAS, Fiori Elements, XSUAA, calculation views, stored procedures) |
| 3 | What is an SAP CodeJam? | Keep as-is |
| 4 | Before you start *(renamed from "Overview")* | Keep slides/video links; add one-liner context ("review before or during the intro session"); add note pointing to Dev Container / Codespace options in `prerequisites.md` |
| 5 | Requirements | Keep prerequisites link and the two existing sub-sections ("Material organization" and "Following the exercises") in place beneath it; remove the `### The exercises` sub-section and its link list from here (they become section 5b below) |
| 5a | Known Issues | Move here from bottom (retain `##` H2 heading level); add "(affects Exercise 3)" label inline |
| 5b | The exercises | Promote from `###` sub-section (currently nested under Requirements) to a standalone `##` section; add one-sentence outcome description per exercise |
| 6 | Feedback | Unchanged |
| 7 | How to obtain support | Unchanged |
| 8 | Further connections | Trim each "What is X?" block to 2–3 sentences + existing links; no new content |
| 9 | Contributing | Unchanged |
| 10 | License | Unchanged |

---

## Section-level Detail

### Description (section 2)

**Current:** One dense paragraph mixing marketing copy with technical detail.

**New structure:**
- One sentence: what you will build (full-stack app using CAP + HANA Cloud)
- Bullet list — tech stack at a glance:
  - SAP Cloud Application Programming Model (Node.js)
  - SAP HANA Cloud (HDI containers)
  - SAP Business Application Studio
  - SAP Fiori Elements UI (OData V4)
  - XSUAA authentication
  - HANA-native artifacts: calculation views and stored procedures
- One sentence: format (8 exercises, in-person CodeJam, Credly badge on completion)

### Before you start (section 4)

**Current heading:** "Overview"
**New heading:** "Before you start"

Add a single sentence of context before the link list:
> "Review the introductory slides and video below before or during the opening session."

Add a note after the link list:
> "If you prefer to develop locally or in a container, see the [Dev Container and Codespace options](prerequisites.md) in the prerequisites."

### Known Issues (moved to section 5a)

Move from bottom of file to just before the exercise list. Retain `##` (H2) heading level — it remains a top-level sibling section, not a sub-heading under Requirements. Add "(affects Exercise 3)" inline so attendees know when to expect it.

### Exercise list (section 5b)

Promote `### The exercises` from a sub-section under `## Requirements` to a standalone `## The exercises` section (H2). Remove it from its current nested position under Requirements. Add a one-sentence outcome to each exercise entry:

| Exercise | One-liner |
|----------|-----------|
| Ex 1 | Set up an SAP HANA Cloud instance and configure your development environment in BAS |
| Ex 2 | Scaffold a CAP Node.js project and connect it to your HANA Cloud HDI container |
| Ex 3 | Define the data model using CDS and deploy database artifacts to HANA Cloud |
| Ex 4 | Generate an SAP Fiori Elements list report UI served by the CAP service |
| Ex 5 | Add XSUAA-based user authentication and role-based access control |
| Ex 6 | Build a HANA calculation view and expose it as a read-only CAP entity |
| Ex 7 | Implement a HANA stored procedure and surface it as a CAP service function |
| Ex 8 (Bonus) | Package and deploy the full application as an MTA to SAP BTP Cloud Foundry |

### Further connections (section 8)

Trim each of the three "What is X?" paragraphs (~80 words each) to 2–3 sentences. No new links or content — just cut filler while keeping the existing resource links.

---

## Out of scope

- Exercise README content
- `prerequisites.md` content
- Any file other than `README.md`
- Adding new images or diagrams
