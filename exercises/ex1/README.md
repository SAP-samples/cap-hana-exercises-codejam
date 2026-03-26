# Exercise 1 - Set Up SAP HANA Cloud and SAP Business Application Studio

> **CodeJam participants:** For this CodeJam it is no longer necessary to provision your own SAP HANA Cloud instance. Your instructor will provide you with access to an SAP BTP subaccount that already contains a running SAP HANA Cloud instance. You will only have temporary access to this account during the event. If you wish to continue learning independently after the CodeJam, this exercise contains the steps to provision your own SAP HANA Cloud instance on your own SAP BTP account.
>
> If you are attending the CodeJam, skip ahead to 👉 [Exercise 2 - Create an SAP Cloud Application Programming Model Project for SAP HANA Cloud](../ex2/README.md)

## Introduction

Before we can start building our CAP application, we need two things in place:

1. **An SAP HANA Cloud database instance** — this is the database that will store our application data and host our HDI (HANA Deployment Infrastructure) containers.
2. **An SAP Business Application Studio workspace** — this is the cloud-based IDE we will use to write, build, and deploy our CAP application.

SAP HANA Cloud is provisioned in a "multi-environment" context using the SAP HANA Cloud Administration Tools. This means the HANA instance itself is not tied to a specific runtime environment (like Cloud Foundry), giving you flexibility to connect from multiple environments. See the "Further Study" section below for more on this.

## Exercise 1.1 Deploy SAP HANA Cloud

We will use the SAP BTP Cockpit to provision a free SAP HANA Cloud instance. This is a one-time activity per account.

👉 Perform all the steps in the tutorial: [Deploy SAP HANA Cloud](https://developers.sap.com/tutorials/hana-cloud-deploying.html).

Once complete, you have a fully functional SAP HANA Cloud database with the complete set of HANA capabilities available to you — including in-memory processing, advanced analytics, JSON document store, and graph engine.

> **Important — daily restart required.** SAP HANA Cloud trial instances are stopped automatically each night to conserve resources. You must manually restart your instance each day before using it. Forgetting to restart the instance is the most common cause of connection errors in this CodeJam. The restart procedure is covered in the tutorial above.

## Exercise 1.2 Set Up SAP Business Application Studio

SAP Business Application Studio (BAS) is a cloud-based development environment available on SAP BTP. It comes pre-configured with the tools, extensions, and runtimes you need for CAP and HANA development, so you don't need to install anything locally.

The setup steps differ slightly depending on whether you are using the SAP BTP free trial or free tier.

<summary>SAP BTP free trial</summary>

👉 If you are using the [SAP BTP free trial](https://developers.sap.com/tutorials/hcp-create-trial-account.html), perform all the steps in the tutorial: [Set Up SAP Business Application Studio for Development](https://developers.sap.com/tutorials/appstudio-onboarding.html).

## Summary

You now have an SAP HANA Cloud database instance provisioned and SAP Business Application Studio set up as your development environment. These two components form the foundation for everything we build in this CodeJam.

### Questions for Discussion

1. Why is SAP HANA Cloud provisioned in a "multi-environment" context rather than directly inside Cloud Foundry?<details><summary>Answer</summary>
   The multi-environment approach decouples the HANA database lifecycle from any specific runtime. An SAP HANA Cloud instance provisioned at the subaccount level can be mapped to Cloud Foundry spaces, Kyma namespaces, or accessed directly via APIs — without needing to be re-provisioned for each environment. This is important for organizations that use multiple runtimes or want to share a single HANA instance across teams.</details>

1. Why does a free trial SAP HANA Cloud instance stop every night?<details><summary>Answer</summary>
   Free trial accounts are designed to provide access to SAP technology at no cost for learning and development. Automatic nightly shutdown helps SAP manage infrastructure costs for these free accounts. In productive (paid) subscriptions, your HANA Cloud instance runs continuously unless you explicitly stop it.</details>

1. What is the difference between SAP Business Application Studio and a local development environment (e.g. VS Code on your laptop)?<details><summary>Answer</summary>
   SAP Business Application Studio is a hosted, browser-based IDE running in SAP BTP. Key differences:
   * **Pre-configured tooling:** Dev spaces come with SAP-specific extensions, the CDS CLI (`@sap/cds-dk`), Cloud Foundry CLI, and other tools already installed — no local setup required.
   * **Dev spaces:** Each dev space is a containerized environment tailored to a specific scenario (Full Stack Cloud Application, SAP Fiori, etc.), keeping tools scoped to what you need.
   * **Network access:** BAS runs inside the SAP BTP network, which can simplify connectivity to SAP services.
   * **Trade-offs:** Because it runs in a browser, it depends on a stable internet connection. Local VS Code offers more flexibility and offline access. SAP also provides a [CDS language extension for VS Code](https://marketplace.visualstudio.com/items?itemName=SAPSE.vscode-cds) if you prefer working locally.</details>

1. What is an HDI container, and how does it relate to SAP HANA Cloud?<details><summary>Answer</summary>
   HDI stands for **HANA Deployment Infrastructure**. An HDI container is an isolated schema within an SAP HANA database that is managed by the HDI service. Each container has its own set of database objects (tables, views, procedures, etc.) and its own deployment history.
   * HDI containers are created and managed as Cloud Foundry service instances (using the `hana` service with the `hdi-shared` plan), even though the HANA Cloud instance itself may not be running inside Cloud Foundry.
   * CAP projects use HDI containers to deploy all database artifacts. The `@sap/hdi-deploy` tool handles the actual deployment into the container.
   * This isolation means multiple CAP applications can share one HANA Cloud instance without interfering with each other's schemas.</details>

## Further Study

* [Deploy SAP HANA Cloud (Tutorial)](https://developers.sap.com/tutorials/hana-cloud-deploying.html)
* [Tools to Manage and Access SAP HANA Cloud](https://developers.sap.com/tutorials/hana-cloud-mission-trial-4.html)
* [Subscribing to the SAP HANA Cloud Administration Tools](https://help.sap.com/docs/hana-cloud/sap-hana-cloud-administration-guide/subscribing-to-sap-hana-cloud-administration-tools)
* [SAP HANA Cloud Multi-Environment Overview](https://community.sap.com/topics/hana)
* [SAP Business Application Studio Documentation](https://community.sap.com/topics/business-application-studio)

## Next

Continue to 👉 [Exercise 2 - Create an SAP Cloud Application Programming Model Project for SAP HANA Cloud](../ex2/README.md)
