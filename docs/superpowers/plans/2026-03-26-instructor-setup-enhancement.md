# InstructorSetup.md Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite `InstructorSetup.md` to serve both first-time and returning instructors by adding an introduction, a pre-event checklist, context sentences per section, two critical HANA Cloud warnings, and fixing all typos.

**Architecture:** Single-file documentation edit. The document is restructured from a flat list of `##` sections into: Introduction → Pre-Event Checklist → Pre-Event Setup (four `###` subsections) → After the Event. All changes are confined to `InstructorSetup.md`.

**Tech Stack:** Markdown. No build step, no tests. Verification is a read-back of the edited lines after each task.

**Spec:** `docs/superpowers/specs/2026-03-26-instructor-setup-enhancement-design.md`

---

## File Map

| File | Action |
|------|--------|
| `InstructorSetup.md` | Modify — all changes in this plan |

---

## Task 1: Add Introduction and Pre-Event Checklist sections

**Files:**
- Modify: `InstructorSetup.md` (insert after line 1)

The document currently jumps straight into the SubAccount section. Add two new `##` sections — Introduction and Pre-Event Checklist — immediately after the H1 heading.

- [ ] **Step 1: Insert Introduction and Checklist after the H1 heading**

Replace:
```markdown
# Instructor Setup for CodeJam

## The SAP BTP SubAccount Details
```

With:
```markdown
# Instructor Setup for CodeJam

## Introduction

This document covers everything an instructor needs to prepare the SAP BTP environment for a CAP + SAP HANA Cloud CodeJam. All steps must be completed before the day of the event. You will need Global Account administrator access to the [SAP BTP Global Account: Developer Advocates Free Tier](https://emea.cockpit.btp.cloud.sap/cockpit/#/globalaccount/275320f9-4c26-4622-8728-b6f5196075f5/accountModel&//?section=HierarchySection&view=TreeTableView).

## Pre-Event Checklist

Use this checklist before each event to confirm everything is in place.

- [ ] Navigate to the SAP BTP subaccount
- [ ] Enable Cloud Foundry and create the `dev` space (including adding co-instructors as Space Members)
- [ ] Provision the SAP HANA Cloud instance
- [ ] Map the HANA Cloud instance to the CF org and space
- [ ] Set HANA Cloud allowed connections to "Allow All IP Addresses"
- [ ] Create participant users, assign the `CodeJam` Role Collection, and add to the CF `dev` space

## Pre-Event Setup

## The SAP BTP SubAccount Details
```

- [ ] **Step 2: Verify the inserted content**

Read back lines 1–25 of `InstructorSetup.md` and confirm:
- `## Introduction` section exists with 2–3 sentences
- `## Pre-Event Checklist` section exists with 6 `- [ ]` items
- `## Pre-Event Setup` container heading exists immediately before the SubAccount heading

Do not commit yet — wait until all four subsections (Tasks 2–5) are updated so the heading hierarchy is valid before committing.

---

## Task 2: Update the SubAccount subsection (3a)

**Files:**
- Modify: `InstructorSetup.md`

Promote the SubAccount section to a `###` subsection under Pre-Event Setup, drop "Details" from the heading, replace the intro line, and fix the two text errors on line 8.

- [ ] **Step 1: Update the SubAccount heading and intro**

Replace:
```markdown
## The SAP BTP SubAccount Details

Provide details about the SAP BTP SubAccount required for the CodeJam.

1. Log in the [SAP BTP Global Account: Developer Advocates Free Tier](https://emea.cockpit.btp.cloud.sap/cockpit/#/globalaccount/275320f9-4c26-4622-8728-b6f5196075f5/accountModel&//?section=HierarchySection&view=TreeTableView).
1. Navigate to the Direcotries and SubAccounts section.There you will find a folder for CodeJams. Within that is the Subaccount [CAP CodeJam](https://emea.cockpit.btp.cloud.sap/cockpit/#/globalaccount/275320f9-4c26-4622-8728-b6f5196075f5/subaccount/13f4f274-4515-4c67-8274-cbde80a4e744/subaccountoverview).  That's where we will work.
![SAP BTP SubAccount](images/instructor/subaccount.png "SAP BTP SubAccount")
```

With:
```markdown
### The SAP BTP SubAccount

This is a shared, persistent subaccount used for all CAP CodeJams — do not create a new one.

1. Log in the [SAP BTP Global Account: Developer Advocates Free Tier](https://emea.cockpit.btp.cloud.sap/cockpit/#/globalaccount/275320f9-4c26-4622-8728-b6f5196075f5/accountModel&//?section=HierarchySection&view=TreeTableView).
1. Navigate to the Directories and SubAccounts section. There you will find a folder for CodeJams. Within that is the Subaccount [CAP CodeJam](https://emea.cockpit.btp.cloud.sap/cockpit/#/globalaccount/275320f9-4c26-4622-8728-b6f5196075f5/subaccount/13f4f274-4515-4c67-8274-cbde80a4e744/subaccountoverview).  That's where we will work.
![SAP BTP SubAccount](images/instructor/subaccount.png "SAP BTP SubAccount")
```

- [ ] **Step 2: Verify**

Read back the subsection and confirm:
- Heading is `###` and reads "The SAP BTP SubAccount" (no "Details")
- Intro line is the new context sentence
- "Directories" is spelled correctly
- "section. There" has the space after the period

Do not commit yet — wait until all four subsections are updated.

---

## Task 3: Update the Enable Cloud Foundry subsection (3b)

**Files:**
- Modify: `InstructorSetup.md`

Promote to `###`, fix `` `Dev` `` → `` `dev` `` in heading, replace intro line, fix "Enviroment" and "Enablment".

- [ ] **Step 1: Update the Enable CF heading, intro, and typos**

Replace:
```markdown
## Enable Cloud Foundry and Create a `Dev` Space

Instructions on how to Enable Cloud Foundry Environment.

1. Enable the Cloud Foundry Enviroment. ![Enable Cloud Foundry](images/instructor/enableCloudFoundry.png "Enable Cloud Foundry")
1. Use the default Enablment dialog choices.
```

With:
```markdown
### Enable Cloud Foundry and Create a `dev` Space

CF is required because participants deploy HDI container service instances into this space.

1. Enable the Cloud Foundry Environment. ![Enable Cloud Foundry](images/instructor/enableCloudFoundry.png "Enable Cloud Foundry")
1. Use the default Enablement dialog choices.
```

- [ ] **Step 2: Verify**

Read back the subsection and confirm:
- Heading is `###` with lowercase `` `dev` ``
- Intro line is the new context sentence
- "Environment" is spelled correctly (no "Enviroment")
- "Enablement" is spelled correctly (no "Enablment")
- The remaining two steps (create space, add co-instructors) are unchanged

Do not commit yet — wait until all four subsections are updated.

---

## Task 4: Update the HANA Cloud subsection (3c)

**Files:**
- Modify: `InstructorSetup.md`

Promote to `###`, replace intro line, keep tutorial step unchanged, add `> ⚠️ **Important:**` warning callout after it.

- [ ] **Step 1: Update the HANA Cloud heading, intro, and add warning callout**

Replace:
```markdown
## Provisioning of SAP HANA Cloud

Instructions on how to provision SAP HANA Cloud for the event.

1. Perform all the steps in 👉 [tutorial: Deploy SAP HANA Cloud](https://developers.sap.com/tutorials/hana-cloud-deploying.html). You now have an SAP HANA database fully accessible to you with the full range of HANA Cloud capabilities.
```

With:
```markdown
### Provisioning of SAP HANA Cloud

A single shared SAP HANA Cloud instance serves all participants during the event.

1. Perform all the steps in 👉 [tutorial: Deploy SAP HANA Cloud](https://developers.sap.com/tutorials/hana-cloud-deploying.html). You now have an SAP HANA database fully accessible to you with the full range of HANA Cloud capabilities.

> ⚠️ **Important:** The tutorial covers two steps that are easy to miss but will prevent participants from connecting to the database if skipped:
>
> 1. **CF org/space mapping** — map the HANA Cloud instance to the Cloud Foundry org and space.
> 2. **Allow All IP Addresses** — set the instance's allowed connections to "Allow All IP Addresses"; without this, dev tools such as SAP Business Application Studio cannot connect.
```

- [ ] **Step 2: Verify**

Read back the subsection and confirm:
- Heading is `###` and reads "Provisioning of SAP HANA Cloud" (unchanged)
- Intro line is the new context sentence
- Tutorial link step and trailing sentence are unchanged
- Warning callout appears after the tutorial step with both sub-points

Do not commit yet — wait until Task 5 (Adding Users) is also complete, then commit all structural changes together.

---

## Task 5: Update the Adding Users subsection (3d)

**Files:**
- Modify: `InstructorSetup.md`

Promote to `###`, replace intro line, add `CodeJam` Role Collection note, restructure the existing 5 steps into two clearly separated numbered actions.

- [ ] **Step 1: Update the Adding Users heading, intro, and steps**

Replace:
```markdown
## Adding Users

Guide on how to add users to the SAP BTP Subaccount and Cloud Foundry Environment

1. Navigate to the "Security" section in your SubAccount. `Security -> Users` ![Navigate to User Management](images/instructor/securityUsers.png "Navigate to User Management")
1. Create User ![Create User](images/instructor/createUser.png "Create User")
1. Enter the email addresses of the participants and use the `Default identity provider` ![Create User Dialog](images/instructor/createUserDialog.png "Create User Dialog")
1. Assign them to the `CodeJam` Role Collection. ![Assign Role Collection](images/instructor/assignRoleCollection.png "Assign Role Collection") ![Assign CodeJam Role Collection](images/instructor/assignCodeJamRC.png "Assign CodeJam Role Collection")
1. Assign the users to the Cloud Foundry `dev` Space ![Add Space Members](images/instructor/spaceMembers.png "Add Space Members")
```

With:
```markdown
### Adding Users

Each participant needs both a BTP subaccount user and a Cloud Foundry space membership to complete all exercises.

> **Note:** The `CodeJam` Role Collection already exists in this subaccount (pre-built with all 41 roles covering SAP Business Application Studio, SAP HANA Cloud, Destinations, and more). Do not create a new one — simply assign the existing one to each participant.

**Action 1: Create the subaccount user and assign the Role Collection**

1. Navigate to the "Security" section in your SubAccount. `Security -> Users` ![Navigate to User Management](images/instructor/securityUsers.png "Navigate to User Management")
1. Create User ![Create User](images/instructor/createUser.png "Create User")
1. Enter the email addresses of the participants and use the `Default identity provider` ![Create User Dialog](images/instructor/createUserDialog.png "Create User Dialog")
1. Assign them to the `CodeJam` Role Collection. ![Assign Role Collection](images/instructor/assignRoleCollection.png "Assign Role Collection") ![Assign CodeJam Role Collection](images/instructor/assignCodeJamRC.png "Assign CodeJam Role Collection")

**Action 2: Add the user to the Cloud Foundry space**

1. Assign the users to the Cloud Foundry `dev` Space ![Add Space Members](images/instructor/spaceMembers.png "Add Space Members")
```

- [ ] **Step 2: Verify**

Read back the subsection and confirm:
- Heading is `###` and reads "Adding Users" (unchanged)
- Intro line is the new context sentence
- Role Collection note appears before the steps
- Steps are split into Action 1 (4 steps) and Action 2 (1 step)
- All image references are intact and unchanged

- [ ] **Step 3: Commit all structural changes (Tasks 1–5)**

This is the first commit — it covers all changes from Tasks 1–5 together so no intermediate state with a broken heading hierarchy is ever persisted to git.

```bash
git add InstructorSetup.md
git commit -m "docs: restructure InstructorSetup with intro, checklist, Pre-Event Setup container, and expanded subsections"
```

---

## Task 6: Update the After the Event section

**Files:**
- Modify: `InstructorSetup.md`

Rename heading, replace intro line, fix "Enviroment" typo. Steps unchanged.

- [ ] **Step 1: Update heading, intro, and typo**

Replace:
```markdown
## Clean Up After the Event

Instructions on how to clean up resources after the event.

1. Delete all the HDI container instances from the BTP Cockpit SubAccount/Instances views. ![Delete Service Instances](images/instructor/cleanupDeleteServiceInstances.png "Delete Service Instances")

1. Disable the Cloud Foundry Enviroment. This will remove all user access at the CF level and clean up remaining resources. ![Disable Cloud Foundry](images/instructor/cleanupCloudFoundry.png "Disable Cloud Foundry")
```

With:
```markdown
## After the Event

Run these steps after every event to avoid ongoing costs and reset the subaccount for next time.

1. Delete all the HDI container instances from the BTP Cockpit SubAccount/Instances views. ![Delete Service Instances](images/instructor/cleanupDeleteServiceInstances.png "Delete Service Instances")

1. Disable the Cloud Foundry Environment. This will remove all user access at the CF level and clean up remaining resources. ![Disable Cloud Foundry](images/instructor/cleanupCloudFoundry.png "Disable Cloud Foundry")
```

- [ ] **Step 2: Verify**

Read back the section and confirm:
- Heading reads "After the Event" (not "Clean Up After the Event")
- Intro line is the new context sentence
- "Environment" is spelled correctly in step 2
- Remaining steps 3–5 (Delete HANA, Remove Users, Remove Role Collections) are unchanged

- [ ] **Step 3: Commit**

```bash
git add InstructorSetup.md
git commit -m "docs: rename cleanup section, update intro, fix Environment typo"
```

---

## Final Verification

- [ ] Read the complete `InstructorSetup.md` from top to bottom and confirm the overall flow makes sense: Introduction → Checklist → Pre-Event Setup (4 subsections) → After the Event.
- [ ] Confirm no orphaned `##` headings remain where `###` was intended.
- [ ] Confirm all 6 checklist items in the Checklist section are present and use `- [ ]` syntax.
