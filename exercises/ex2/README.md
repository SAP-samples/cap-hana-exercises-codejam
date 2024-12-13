# Exercise 2 - Create an SAP Cloud Application Programming Model Project for SAP HANA Cloud

In this exercise we will use the wizard for the SAP Cloud Application Programming Model to create a project in SAP Business Application Studio that will also support SAP HANA Cloud.

Perform all the steps in 👉 [tutorial: Create an SAP Cloud Application Programming Model Project for SAP HANA Cloud](https://developers.sap.com/tutorials/hana-cloud-cap-create-project.html)

## Summary

At the end of this tutorial you have your `dev space`, the basic CAP project and have configured source control for this project.

### Questions for Discussion

1. What is the value of the `dev space` in the SAP Business Application Studio? To help with this discussion point consider the [prerequisites section](../../prerequisites.md) for not using the SAP Business Application Studio.<details><summary>Answer</summary>
   The `dev space` in SAP Business Application Studio is a pre-configured development environment tailored for specific scenarios, such as SAP Fiori, SAP HANA, and more. It provides all the necessary tools, extensions, and configurations required for development, reducing setup time and ensuring consistency across different development environments.</details>

1. Why do you think it was necessary to login to Cloud Foundry?  HANA Cloud itself isn't actually running in Cloud Foundry nor does it use Cloud Foundry for technical connections. But it's important to understand [HDI (HANA Deployment Infrastructure)](https://help.sap.com/docs/HANA_CLOUD_DATABASE/c2cc2e43458d4abda6788049c58143dc/e28abca91a004683845805efc2bf967c.html) containers and how they are controlled via Cloud Foundry service instances.<details><summary>Answer</summary>
   Logging into Cloud Foundry is necessary because HDI containers, which are used for managing database artifacts in HANA Cloud, can be controlled via Cloud Foundry service instances regardless of if the HANA instance is deployed into Cloud Foundry or not (it's not in our case). This integration allows for better management and deployment of database artifacts within the SAP ecosystem.</details>

1. What's the purpose of the [mta.yaml](https://help.sap.com/docs/HANA_CLOUD_DATABASE/c2b99f19e9264c4d9ae9221b22f6f589/d8226e641a124b629b0e8f7c111cd1ae.html) file?<details><summary>Answer</summary>
   The `mta.yaml` file is used to define the structure and components of a multi-target application (MTA). It specifies the modules, resources, and their relationships, enabling the deployment of complex applications across different environments and services in a consistent and automated manner.
   * In the context of CAP (Cloud Application Programming), HANA, and Cloud Foundry BTP applications, the `mta.yaml` file helps in bundling different components like database modules, service modules, and UI modules into a single deployable unit. This ensures that all parts of the application are deployed together and can interact seamlessly.</details>

1. Who can explain what [NPM](https://docs.npmjs.com/about-npm) is and how and why it is used?<details><summary>Answer</summary>
   NPM (Node Package Manager) is a package manager for JavaScript, primarily used to manage dependencies for Node.js projects. During CAP (Cloud Application Programming) and HANA development, NPM is used to install and manage libraries and tools required for building, testing, and deploying applications. It simplifies the process of integrating third-party modules and ensures that all dependencies are up-to-date and compatible.
   * One important package is `@sap/cds-dk`, which provides the core tools and libraries for developing CAP applications, including commands for project initialization, building, and deployment.
   * Another important package is `@sap/hdi-deploy`, which is used to deploy database artifacts to HANA databases. It helps in managing the deployment of HDI containers and ensures that all database objects are correctly created and maintained.</details>

1. Version Control with [Git](https://git-scm.com/). How familiar is everyone with Git? Any ABAP developers in the room (if so we should talk). What's the reason/impact of using local Git repository as we did in this tutorial?<details><summary>Answer</summary>
   Using a local Git repository allows developers to track changes to their code, collaborate with others, and maintain a history of their project. It provides version control, enabling developers to revert to previous versions if needed. In this tutorial, using a local Git repository helps in managing the CAP project efficiently, ensuring that changes are documented and can be shared or deployed consistently.
   * In a real project, moving to a central Git repository such as GitHub is important for better collaboration, backup, and access control. A central repository allows multiple developers to work on the same project simultaneously, merge changes, and resolve conflicts. It also provides a backup of the codebase and ensures that the latest version of the code is always accessible to the team.</details>

## Further Study

* [Video Version of this Tutorial](https://youtu.be/ydDOGz7P--8)
* [SAP Business Application Studio](https://community.sap.com/topics/business-application-studio)
* [SAP HDI Containers](https://help.sap.com/docs/HANA_CLOUD_DATABASE/c2cc2e43458d4abda6788049c58143dc/e28abca91a004683845805efc2bf967c.html)
* [HANA Cloud: HDI - Under the Hood](https://www.youtube.com/watch?v=UmOkjPxE6Us)
* [Git basics in 10 minutes](https://www.freecodecamp.org/news/learn-the-basics-of-git-in-under-10-minutes-da548267cc91/)

## Next

Continue to 👉 [Exercise 3 - Create Database Artifacts Using Core Data Services (CDS) for SAP HANA Cloud](../ex3/README.md)
