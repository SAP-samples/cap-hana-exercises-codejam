# README Improvement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure `README.md` to serve event attendees — surface "what you'll build" and the exercise list first, expose known issues before the exercises, and trim generic filler prose.

**Architecture:** All changes are to a single file (`README.md`). No code, no tests — verification is visual inspection of rendered Markdown. Each task targets one logical section. Commits are grouped by related sections.

**Tech Stack:** Markdown, GitHub-flavored Markdown rendering

**Spec:** `docs/superpowers/specs/2026-03-26-readme-improvement-design.md`

---

## File Map

| File | Action |
|------|--------|
| `README.md` | Modify — all changes below |

---

### Task 1: Fix Credly badge — typo and move to title area

**Files:**
- Modify: `README.md`

The Credly badge is currently on line 10, inside the Description section, with "Credley" in the alt text. Move it to immediately below the REUSE badge (line 3) and fix the typo.

- [ ] **Step 1: Remove the Credly badge and its lead-in sentence from the Description section**

In `README.md`, find and remove both of these lines (currently at the end of the Description paragraph block):

```markdown
Complete this in-person CodeJam experience and you can receive the following badge on Credly:
[![Credley Badge](https://images.credly.com/images/5d79c77c-2def-4f1a-94a9-9b40d50c6202/blob)](https://www.credly.com/org/sap/badge/developer-skills-codejam-combine-sap-cap-with-sap-h)
```

Both lines must be removed together — the prose sentence has no home once the badge moves to the title area.

- [ ] **Step 2: Insert the corrected badge immediately below the REUSE badge**

The top of the file should look like this after the change:

```markdown
# CodeJam - Combine SAP Cloud Application Programming Model with SAP HANA Cloud to Create Full-Stack Applications

[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/cap-hana-exercises-codejam)](https://api.reuse.software/info/github.com/SAP-samples/cap-hana-exercises-codejam)
[![Credly Badge](https://images.credly.com/images/5d79c77c-2def-4f1a-94a9-9b40d50c6202/blob)](https://www.credly.com/org/sap/badge/developer-skills-codejam-combine-sap-cap-with-sap-h)
```

Note: both badges on adjacent lines with no blank line between them, immediately after the title.

- [ ] **Step 3: Verify**

Open `README.md` and confirm:
- Both badges appear on consecutive lines directly below the H1 title
- Alt text reads "Credly Badge" (not "Credley Badge")
- The badge no longer appears anywhere inside the `## Description` section

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "fix: correct Credly badge alt text typo and move badge to title area"
```

---

### Task 2: Rewrite the Description section

**Files:**
- Modify: `README.md`

Replace the single dense paragraph in `## Description` with a structured orientation: one sentence on what attendees will build, a tech-stack bullet list, and one sentence on the format.

- [ ] **Step 1: Replace the Description paragraph**

Find the current `## Description` section content:

```markdown
## Description

This repository contains the material for the CodeJam on using the SAP Cloud Application Programming Model and SAP HANA Cloud to create Full-Stack Applications. In this CodeJam we will learn how to use an instance of SAP HANA Cloud, develop a multi-target application using SAP Business Application Studio and SAP Cloud Application Programming Model, and create a service layer and SAP Fiori UI that also includes SAP HANA native artifacts, such as calculation views.
```

Replace with:

```markdown
## Description

In this CodeJam you will build a full-stack application using SAP Cloud Application Programming Model (CAP) and SAP HANA Cloud, progressing through 8 exercises from project setup to deployment.

**Tech stack at a glance:**

* SAP Cloud Application Programming Model — Node.js
* SAP HANA Cloud (HDI containers)
* SAP Business Application Studio
* SAP Fiori Elements UI (OData V4)
* XSUAA authentication
* HANA-native artifacts: calculation views and stored procedures

Complete all 8 exercises at an in-person CodeJam event to earn a Credly badge.
```

- [ ] **Step 2: Verify**

Confirm in `README.md`:
- The original single-paragraph description is gone
- The section now has an orientation sentence, a bold "Tech stack at a glance:" sub-heading with 6 bullets, and a closing sentence about the badge
- The Credly badge image/link is NOT duplicated here (it's in the header now)

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: rewrite Description as attendee-oriented orientation with tech stack list"
```

---

### Task 3: Rename "Overview" to "Before you start" and add context

**Files:**
- Modify: `README.md`

Rename the `## Overview` section, add a context sentence before the link list, and add a note about local/container development options after the list.

- [ ] **Step 1: Update the Overview section**

Find:

```markdown
## Overview

* [SAP Cloud Application Programming Model Presentation from Introduction](./slides/CAP_Small.pdf)
* [SAP HANA Cloud Presentation from Introduction](./slides/HANA_Small.pdf)
* [SAP Business Application Studio Presentation from Introduction](./slides/BAS_Small.pdf)
* [Introduction to SAP Cloud Application Programming Model Video](https://youtu.be/T1gqalbwzHk)
```

Replace with:

```markdown
## Before you start

Review the introductory slides and video below before or during the opening session.

* [SAP Cloud Application Programming Model Presentation from Introduction](./slides/CAP_Small.pdf)
* [SAP HANA Cloud Presentation from Introduction](./slides/HANA_Small.pdf)
* [SAP Business Application Studio Presentation from Introduction](./slides/BAS_Small.pdf)
* [Introduction to SAP Cloud Application Programming Model Video](https://youtu.be/T1gqalbwzHk)

If you prefer to develop locally or in a container, see the [Dev Container and Codespace options](prerequisites.md) in the prerequisites.
```

- [ ] **Step 2: Verify**

Confirm in `README.md`:
- Heading is `## Before you start` (not `## Overview`)
- A plain-text sentence appears before the link list
- The four existing links are unchanged
- A new sentence with a link to `prerequisites.md` appears after the list

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: rename Overview to 'Before you start', add session context and Dev Container note"
```

---

### Task 4: Remove `### The exercises` sub-section from Requirements

**Files:**
- Modify: `README.md`

The `### The exercises` heading and its content currently live nested inside `## Requirements`. They will become a standalone `## The exercises` section in Task 6. This task removes them from Requirements.

- [ ] **Step 1: Remove `### The exercises` and its content from Requirements**

Find and remove everything from `### The exercises` through the end of the exercise link list. The current block looks like:

```markdown
### The exercises

Here's an overview of the exercises in this CodeJam.

* Make certain that you have successfully completed all the [prerequisites](prerequisites.md)
* [Exercise 1 - Set Up SAP HANA Cloud and Development Environment](exercises/ex1/README.md)
* [Exercise 2 - Create an SAP Cloud Application Programming Model Project for SAP HANA Cloud](exercises/ex2/README.md)
* [Exercise 3 - Create Database Artifacts Using Core Data Services (CDS) for SAP HANA Cloud](exercises/ex3/README.md)
* [Exercise 4 - Create a User Interface with CAP (SAP HANA Cloud)](exercises/ex4/README.md)
* [Exercise 5 - Add User Authentication to Your Application (SAP HANA Cloud)](exercises/ex5/README.md)
* [Exercise 6 - Create Calculation View and Expose via CAP (SAP HANA Cloud)](exercises/ex6/README.md)
* [Exercise 7 - Create HANA Stored Procedure and Expose as CAP Service Function (SAP HANA Cloud)](exercises/ex7/README.md)
* [Bonus Homework - Deploy CAP with SAP HANA Cloud project as MTA](exercises/ex8/README.md)
```

After removal, `## Requirements` should contain only:

```markdown
## Requirements

The requirements to follow the exercises in this repository, including hardware and software, are detailed in the [prerequisites](prerequisites.md) file.

### Material organization

The material consists of a series of exercises. Each exercise is contained in a directory, with a main 'readme' file containing the core exercise instructions, with optional supporting files, such as screenshots and sample files.

### Following the exercises

During the CodeJam you will complete each exercise one at a time. At the end of each exercise there are questions; these are designed to help you think about the content just covered, and are to be discussed with the entire CodeJam class, led by the instructor, when everyone has finished that exercise.

If you finish an exercise early, please resist the temptation to continue with the next one. Instead, explore what you've just done and see if you can find out more about the subject that was covered. That way we all stay on track together and can benefit from some reflection via the questions (and answers).

> The exercises are written in a conversational way; this is so that they have enough context and information to be completed outside the hands-on session itself. To help you navigate and find what you have to actually do next, there are pointers like this 👉 throughout that indicate the things you have to actually do (as opposed to just read for background information).
```

- [ ] **Step 2: Verify**

Confirm `## Requirements` no longer contains `### The exercises` or any exercise links.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: remove exercises sub-section from Requirements (will be promoted to top-level)"
```

---

### Task 5: Move Known Issues before the exercise list, add Exercise 3 label

**Files:**
- Modify: `README.md`

The `## Known Issues` section currently sits after the exercise list near the bottom. Move it to immediately after `## Requirements` (and before the upcoming `## The exercises` section). Add "(affects Exercise 3)" to the heading so attendees know when to expect it.

- [ ] **Step 1: Remove Known Issues from its current location**

Find and remove the entire `## Known Issues` block from its current position:

```markdown
## Known Issues

When creating the HDI Container instance in Exercise 3, the Business Application Studio tooling sometimes does not properly wait for the container creation. In these situations, simply wait a moment for creation to complete and then repeat the step.
```

- [ ] **Step 2: Insert Known Issues immediately after Requirements**

Add the block after the closing of `## Requirements` (after the blockquote about 👉 pointers), with the updated heading:

```markdown
## Known Issues (affects Exercise 3)

When creating the HDI Container instance in Exercise 3, the Business Application Studio tooling sometimes does not properly wait for the container creation. In these situations, simply wait a moment for creation to complete and then repeat the step.
```

- [ ] **Step 3: Verify**

Confirm in `README.md`:

- `## Known Issues (affects Exercise 3)` appears immediately after the closing blockquote of `## Requirements` (after the 👉 paragraph)
- The known issues text is unchanged apart from the heading
- The section no longer appears near `## Feedback` at the bottom

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: move Known Issues before exercise list and label with affected exercise"
```

---

### Task 6: Promote The exercises to a standalone section with one-sentence outcomes

**Files:**
- Modify: `README.md`

Insert `## The exercises` as a new top-level section immediately after `## Known Issues (affects Exercise 3)`. Promote it from `###` to `##` and add a one-sentence outcome after each exercise link.

- [ ] **Step 1: Insert the new `## The exercises` section**

Add after the Known Issues block:

```markdown
## The exercises

Here's an overview of the exercises in this CodeJam.

* Make certain that you have successfully completed all the [prerequisites](prerequisites.md)
* [Exercise 1 - Set Up SAP HANA Cloud and Development Environment](exercises/ex1/README.md) — Set up an SAP HANA Cloud instance and configure your development environment in BAS
* [Exercise 2 - Create an SAP Cloud Application Programming Model Project for SAP HANA Cloud](exercises/ex2/README.md) — Scaffold a CAP Node.js project and connect it to your HANA Cloud HDI container
* [Exercise 3 - Create Database Artifacts Using Core Data Services (CDS) for SAP HANA Cloud](exercises/ex3/README.md) — Define the data model using CDS and deploy database artifacts to HANA Cloud
* [Exercise 4 - Create a User Interface with CAP (SAP HANA Cloud)](exercises/ex4/README.md) — Generate an SAP Fiori Elements list report UI served by the CAP service
* [Exercise 5 - Add User Authentication to Your Application (SAP HANA Cloud)](exercises/ex5/README.md) — Add XSUAA-based user authentication and role-based access control
* [Exercise 6 - Create Calculation View and Expose via CAP (SAP HANA Cloud)](exercises/ex6/README.md) — Build a HANA calculation view and expose it as a read-only CAP entity
* [Exercise 7 - Create HANA Stored Procedure and Expose as CAP Service Function (SAP HANA Cloud)](exercises/ex7/README.md) — Implement a HANA stored procedure and surface it as a CAP service function
* [Bonus Homework - Deploy CAP with SAP HANA Cloud project as MTA](exercises/ex8/README.md) — Package and deploy the full application as an MTA to SAP BTP Cloud Foundry
```

- [ ] **Step 2: Verify**

Confirm in `README.md`:
- `## The exercises` is a top-level H2 section (not H3)
- It appears after `## Known Issues (affects Exercise 3)`
- All 8 exercise links are present with ` — <one-liner>` appended (em-dash, space, then the sentence)
- The prerequisites bullet is first in the list with no one-liner (it's not an exercise)

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: promote exercise list to top-level section and add per-exercise outcome descriptions"
```

---

### Task 7: Trim "Further connections" prose to 2–3 sentences per sub-section

**Files:**
- Modify: `README.md`

Each of the three "What is X?" paragraphs under `## Further connections and information` is ~80 words. Trim each to 2–3 sentences. Keep all existing resource links unchanged.

- [ ] **Step 1: Trim the CAP paragraph**

Find:

```markdown
### What is the SAP Cloud Application Programming Model?

The SAP Cloud Application Programming Model (CAP) is a framework of languages, libraries, and tools for building enterprise-grade services and applications. It provides a consistent end-to-end programming model that includes best practices, out-of-the-box solutions for common tasks, and a set of tools to simplify development. CAP is designed to help developers focus on their business logic while leveraging SAP's powerful technologies.
```

Replace the paragraph with:

```markdown
### What is the SAP Cloud Application Programming Model?

The SAP Cloud Application Programming Model (CAP) is a framework of languages, libraries, and tools for building enterprise-grade services and applications. It provides a consistent end-to-end programming model with built-in best practices and out-of-the-box solutions for common tasks.
```

(Keep the existing link list that follows — do not change it.)

- [ ] **Step 2: Trim the HANA Cloud paragraph**

Find:

```markdown
### What is SAP HANA Cloud?

SAP HANA Cloud is a fully managed, in-memory cloud database as a service (DBaaS) that provides advanced data management capabilities. It allows you to manage, store, and process data in real-time, enabling you to build modern applications that require high performance and scalability. SAP HANA Cloud integrates seamlessly with other SAP services and provides tools for data integration, analytics, and application development.
```

Replace the paragraph with:

```markdown
### What is SAP HANA Cloud?

SAP HANA Cloud is a fully managed, in-memory cloud database as a service (DBaaS) that provides advanced analytics and data management capabilities. It integrates seamlessly with other SAP services including CAP, and supports real-time processing for modern enterprise applications.
```

(Keep the existing link list that follows — do not change it.)

- [ ] **Step 3: Trim the BAS paragraph**

Find:

```markdown
### What is SAP Business Application Studio?

SAP Business Application Studio is a modern development environment tailored for efficient development of business applications for the SAP ecosystem. It provides a powerful set of tools and services for developing, testing, and deploying applications, including support for SAP Fiori, SAP Cloud Application Programming Model (CAP), and SAP HANA. Business Application Studio offers a cloud-based IDE with features such as code completion, debugging, and integrated DevOps capabilities.
```

Replace the paragraph with:

```markdown
### What is SAP Business Application Studio?

SAP Business Application Studio is a cloud-based IDE tailored for SAP application development. It provides built-in support for CAP, SAP Fiori, and SAP HANA, including the graphical calculation view editor used in Exercise 6.
```

(Keep the existing link list that follows — do not change it.)

- [ ] **Step 4: Verify**

Confirm in `README.md`:
- Each of the three "What is X?" paragraphs is 2 sentences
- All three `For more information` link lists immediately below each paragraph are unchanged

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: trim Further connections paragraphs to 2 sentences each"
```

---

### Task 8: Final verification

- [ ] **Step 1: Check overall section order**

Read `README.md` top to bottom and confirm sections appear in this order:

1. Title
2. REUSE badge + Credly badge (adjacent lines)
3. `## Description` (orientation sentence + tech stack bullets + badge sentence)
4. `## What is an SAP CodeJam?`
5. `## Before you start`
6. `## Requirements` (contains only: prerequisites link, `### Material organization`, `### Following the exercises`)
7. `## Known Issues (affects Exercise 3)`
8. `## The exercises` (H2, with 8 exercise links each followed by ` — <one-liner>`)
9. `## Feedback`
10. `## How to obtain support`
11. `## Further connections and information`
12. `## Contributing`
13. `## License`

- [ ] **Step 2: Spot-check links**

Verify these links resolve to real paths (they should — no paths changed):
- `prerequisites.md` — used in Requirements and in the new "Before you start" note
- `exercises/ex1/README.md` through `exercises/ex8/README.md`
- `./slides/CAP_Small.pdf`, `./slides/HANA_Small.pdf`, `./slides/BAS_Small.pdf`

- [ ] **Step 3: Check for stray content**

Search `README.md` for:
- "Credley" — should return no matches
- `### The exercises` — should return no matches (it's now `## The exercises`)

```bash
grep -n "Credley" README.md
grep -n "### The exercises" README.md
```

Both should return empty output.
