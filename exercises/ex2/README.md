# Exercise 2 - Create an SAP Cloud Application Programming Model Project for SAP HANA Cloud

In this exercise you will use the SAP CAP project wizard in SAP Business Application Studio to scaffold a new CAP Node.js application that is pre-configured to target SAP HANA Cloud as its database. By the end you will have a working project skeleton, a Git repository to track your changes, and a Cloud Foundry login ready for HDI container deployment.

## Background

SAP Cloud Application Programming Model (CAP) is SAP's opinionated framework for building full-stack cloud-native applications. Rather than writing raw SQL or low-level service code, you describe your data model and services in **CDS (Core Data Services)** — a high-level, declarative language — and CAP generates the boilerplate for you: OData endpoints, database tables, service bindings, and more.

By default, CAP uses an in-memory SQLite database for local development. To use SAP HANA Cloud instead, you need to configure the project for **HDI (HANA Deployment Infrastructure)** — the mechanism that deploys and manages database artifacts inside an isolated HANA container. The CAP wizard handles this configuration for you automatically.

## Exercise 2.1 Create the CAP Project

The CAP project wizard in SAP Business Application Studio generates the project skeleton, sets up the `package.json` with the correct SAP dependencies, and adds the `mta.yaml` deployment descriptor needed for Cloud Foundry deployment.

👉 Perform all the steps in the tutorial: [Create an SAP Cloud Application Programming Model Project for SAP HANA Cloud](https://developers.sap.com/tutorials/hana-cloud-cap-create-project.html)

> **What the wizard creates:** After running the wizard, your project contains a `db/` folder for your data model, a `srv/` folder for your service definitions, an `app/` folder for any UI content, and a `package.json` that already includes `@sap/cds`, `@sap/hdi-deploy`, and other SAP-specific dependencies.

## Exercise 2.2 Log In to Cloud Foundry

Before you can deploy or bind an HDI container, the Cloud Foundry CLI in BAS needs to know which Cloud Foundry organization and space to use.

👉 In BAS, open the command palette and run **CF: Login to Cloud Foundry**. Select your API endpoint, provide your credentials, and select the org and space where your HANA Cloud instance is mapped.

> **Why Cloud Foundry?** SAP HANA Cloud instances are provisioned in a "multi-environment" context — the database itself is not running inside Cloud Foundry — but HDI containers are still created and managed as Cloud Foundry service instances (using the `hana` service with the `hdi-shared` plan). Logging in lets the CAP tooling find and bind those containers later.

## Exercise 2.3 Initialize a Git Repository

Version control is important from day one. The tutorial has you initialize a local Git repository so you can track every change you make as you progress through the exercises.

👉 Follow the Git initialization steps in the tutorial. Stage and commit your initial project files once the wizard finishes.

> **Local vs. remote:** A local Git repository gives you commit history and the ability to revert changes, but the code only lives on your BAS dev space. In a real project you would push to a central repository (GitHub, GitLab, Azure DevOps, etc.) for backup, collaboration, and CI/CD integration.

## Summary

At the end of this exercise you have:

- A CAP Node.js project scaffolded and configured for SAP HANA Cloud
- A `package.json` with the correct SAP dependencies (`@sap/cds`, `@sap/hdi-deploy`, etc.)
- An `mta.yaml` deployment descriptor ready for Cloud Foundry MTA builds
- A Cloud Foundry CLI session pointed at the correct org and space
- A local Git repository with an initial commit

### Questions for Discussion

1. What is the value of the dev space in SAP Business Application Studio? To help with this discussion point consider the [prerequisites section](../../prerequisites.md) for not using SAP Business Application Studio.<details><summary>Answer</summary>
   A dev space is a pre-configured, containerized development environment in BAS tailored to a specific scenario — such as Full Stack Cloud Application, SAP Fiori, or SAP HANA Native. It ships with the correct extensions, CLI tools (`@sap/cds-dk`, Cloud Foundry CLI, MTA Build Tool), and runtimes already installed, so you can start coding immediately without any local setup.

   The trade-off versus a local environment like VS Code is that BAS requires an internet connection and runs inside SAP BTP, which can simplify connectivity to SAP services. SAP also provides a [CDS language extension for VS Code](https://marketplace.visualstudio.com/items?itemName=SAPSE.vscode-cds) for developers who prefer to work locally — see the [prerequisites](../../prerequisites.md) for details.</details>

1. Why was it necessary to log in to Cloud Foundry, even though SAP HANA Cloud itself is not running inside Cloud Foundry?<details><summary>Answer</summary>
   SAP HANA Cloud is provisioned in a multi-environment context — the database is not tied to Cloud Foundry — but **HDI containers** (the isolated schemas where your database artifacts live) are still created and managed as Cloud Foundry service instances using the `hana` service with the `hdi-shared` plan.

   When you run `cds deploy` or build the MTA, the CAP tooling uses your Cloud Foundry session to discover, create, or bind to the correct HDI container in the target space. Without a CF login, the tooling cannot locate or provision the container. See [HDI containers](https://help.sap.com/docs/HANA_CLOUD_DATABASE/c2cc2e43458d4abda6788049c58143dc/e28abca91a004683845805efc2bf967c.html) for more detail.</details>

1. What is the purpose of the `mta.yaml` file?<details><summary>Answer</summary>
   `mta.yaml` is the deployment descriptor for a **Multi-Target Application (MTA)** — a bundle that groups multiple deployable components (a database module, a CAP service module, a UI app, an AppRouter, etc.) into a single archive that can be deployed atomically to Cloud Foundry.

   In this project the `mta.yaml` defines:
   - A **db module** (`MyHANAApp-db`) that runs `@sap/hdi-deploy` to push database artifacts into the HDI container
   - A **srv module** (`MyHANAApp-srv`) that runs the CAP Node.js service and exposes the `srv-api` destination
   - **Resources** for the HANA HDI container and (later) XSUAA, which Cloud Foundry provisions as service instances

   See the [MTA specification](https://help.sap.com/docs/HANA_CLOUD_DATABASE/c2b99f19e9264c4d9ae9221b22f6f589/d8226e641a124b629b0e8f7c111cd1ae.html) for the full descriptor reference.</details>

1. Who can explain what NPM is and how it is used in this project?<details><summary>Answer</summary>
   NPM (Node Package Manager) is the standard package manager for Node.js. It reads `package.json` to install the libraries your project depends on and makes them available in `node_modules/`.

   Key packages in this CAP project:
   - **`@sap/cds`** — the CAP runtime: processes CDS models, serves OData endpoints, handles database queries.
   - **`@sap/cds-dk`** — the CAP development toolkit: provides the `cds` CLI for building, running, and deploying projects.
   - **`@sap/hdi-deploy`** — the HDI deployer: reads compiled HANA artifacts from `db/src/gen/` and deploys them into the HDI container during the MTA build.

   Run `npm ci` (not `npm install`) in CI/CD or when you first clone a project — it installs exactly the versions listed in `package-lock.json` rather than resolving fresh versions, which ensures reproducible builds.</details>

1. Version control with Git — what is the impact of using a local Git repository as we did in this tutorial?<details><summary>Answer</summary>
   A local Git repository gives you a full commit history, the ability to branch and experiment, and the safety net of reverting to any previous state. Every `git commit` is a snapshot of your project at a point in time.

   The limitation is that a local repo only exists on your BAS dev space. If the dev space is deleted or your BTP trial expires, that history is gone. In a real project you would push to a central repository (GitHub, GitLab, Azure DevOps, etc.) for:
   - **Backup** — the code survives beyond any single environment
   - **Collaboration** — multiple developers can push and pull changes
   - **CI/CD** — pipelines can trigger automatically on commits and run builds, tests, and deployments

   For ABAP developers in the room: Git-based version control in CAP works similarly to the abapGit / ABAP Development Tools (ADT) workflow you may already know, but operates at the file level rather than the transport level.</details>

1. What is the difference between `npm install` and `npm ci`, and which should you use in a build pipeline?

   <details><summary>Answer</summary>

   `npm install` resolves the dependency tree fresh from `package.json`, potentially installing newer minor or patch versions than the last run. `npm ci` installs exactly the versions locked in `package-lock.json`, deletes `node_modules` first if it already exists, and fails if `package-lock.json` is missing or out of sync with `package.json`.

   In a build pipeline — including the `before-all` hook in `mta.yaml` — `npm ci` is always preferred because it guarantees reproducible builds: every run installs exactly the same versions regardless of when the build runs or what has been published to the npm registry since `package-lock.json` was last updated.

   Use `npm install` when you are intentionally updating dependencies and want npm to resolve fresh versions. Use `npm ci` everywhere else.

   </details>

1. Look at the generated `package.json`. What does the `cds.requires.db` section tell CAP about which database to use?

   <details><summary>Answer</summary>

   The `cds.requires.db` block is CAP's database configuration. By default the wizard generates something like:

   ```json
   "cds": {
     "requires": {
       "db": {
         "kind": "sql"
       },
       "[production]": {
         "db": {
           "kind": "hana"
         }
       }
     }
   }
   ```

   `"kind": "sql"` tells CAP to use SQLite for local development — no HANA connection needed to run `cds watch` on your laptop. The `"[production]"` profile overrides this to `"kind": "hana"` when CAP is started with `--profile production` (which `cds build --production` activates).

   At runtime on BTP, CAP reads the HDI container credentials from `VCAP_SERVICES` using the `db` key as the lookup name, so the service binding in `mta.yaml` must be named to match. This single block controls both the local development database and the production HANA connection.

   </details>

## Further Study

- [Video Version of this Tutorial](https://youtu.be/ydDOGz7P--8)
- [SAP Business Application Studio](https://community.sap.com/topics/business-application-studio)
- [SAP HDI Containers](https://help.sap.com/docs/HANA_CLOUD_DATABASE/c2cc2e43458d4abda6788049c58143dc/e28abca91a004683845805efc2bf967c.html)
- [HANA Cloud: HDI — Under the Hood](https://www.youtube.com/watch?v=UmOkjPxE6Us)
- [CAP — Getting Started](https://cap.cloud.sap/docs/get-started/)
- [MTA Deployment Descriptor Reference](https://help.sap.com/docs/HANA_CLOUD_DATABASE/c2b99f19e9264c4d9ae9221b22f6f589/d8226e641a124b629b0e8f7c111cd1ae.html)
- [Git basics in 10 minutes](https://www.freecodecamp.org/news/learn-the-basics-of-git-in-under-10-minutes-da548267cc91/)

## Next

Continue to 👉 [Exercise 3 - Create Database Artifacts Using Core Data Services (CDS) for SAP HANA Cloud](../ex3/README.md)
