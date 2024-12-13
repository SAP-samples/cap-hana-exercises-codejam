# Exercise 1 - Set Up SAP HANA Cloud and CAP Project

NOTE: **For the CodeJam it is no longer necessary to provision the SAP HANA Cloud instance**. Your instructor will provide you with access to an SAP BTP Subaccount which already contains an SAP HANA Cloud instance ready to perform the necessary setps in this CodeJam. However you will only have temporary access to this account. If you wish to continue learning from your own account, this page contains the necessary steps to provision your own SAP HANA Cloud instance on SAP BTP Free Trial.

Only perform these remain steps in Exercise 1 if you want to create your own system after the CodeJam. Otherwise you can proceed directly to 👉 [Exercise 2 - Create an SAP Cloud Application Programming Model Project for SAP HANA Cloud](../ex2/README.md)

## Introduction

First, we need to provision an SAP HANA Cloud database instance. This will be in a "multi-environment" context with the SAP HANA Cloud Administration Tools (see the "Further Study" section below for a link to more information on this). We must then make that database instance available to the environment instance where we'll be managing deployments with HDI containers, which here will be in your Cloud Foundry environment instance.

## Exercise 1.1 Deploy SAP HANA Cloud

We will use the SAP BTP cockpit as a graphical tool to provision your free SAP HANA Cloud instance if you don't already have one in your account.

First, perform all the steps in 👉 [tutorial: Deploy SAP HANA Cloud](https://developers.sap.com/tutorials/hana-cloud-deploying.html). This is a one time activity. You now have an SAP HANA database fully accessible to you with the full range of HANA Cloud capabilities.  

> **Very important** The system is stopped automatically each night and you need to manually restart every day you want to use it as described in the above tutorial. The most common error that people make is not restarting their HANA Cloud instance.

## Exercise 1.2 Set Up SAP Business Application Studio for Development

SAP Business Application Studio is a development environment available on SAP Business Technology Platform. Before you can start developing using SAP Business Application Studio, you must perform the required onboarding steps that are described in this step once. Please choose your path based upon if you are using the [SAP BTP free tier](https://developers.sap.com/tutorials/btp-free-tier-account.html) or [SAP BTP free trial](https://developers.sap.com/tutorials/hcp-create-trial-account.html).

<details><summary>SAP BTP free trial</summary>

1. If you are using the [SAP BTP free trial](https://developers.sap.com/tutorials/hcp-create-trial-account.html), then perform all the steps in [this tutorial - Set Up SAP Business Application Studio for Development](https://developers.sap.com/tutorials/appstudio-onboarding.html)

</details>
<details><summary>SAP BTP free tier</summary>

1. If you are using the [SAP BTP free tier](https://developers.sap.com/tutorials/btp-free-tier-account.html), then complete the following steps

1. From you SAP BTP Global Account in the SAP BTP Cockpit, select the subaccount in which you want to enable the SAP Business Application Studio subscription.

1. From the navigation area, click Service Marketplace.
   ![Service Marketplace](../../images/ex1/service_marketplace.png)

1. In the Service Marketplace page, search for `studio`.
   ![Search for Studio](../../images/ex1/studio.png)

1. Click Actions icon (three dots) to open the list of available actions.
   ![Three Dots](../../images/ex1/three_dots.png)

1. Click Create to launch the wizard for subscribing to SAP Business Application Studio.
   ![Create](../../images/ex1/create.png)

1. In the wizard verify that `SAP Business Application Studio` is selected in the Service field and `free` is selected in the Plan field.
   ![Free Plan](../../images/ex1/free.png)

1. Click `Create` to subscribe to SAP Business Application Studio.

</details>

## Summary

Now that you have your SAP HANA Cloud database instance and have setup the basics of your development environment, we are ready to start our development project.

## Further Study

* [Tools to Manage and Access the SAP HANA Cloud, SAP HANA Database](https://developers.sap.com/tutorials/hana-cloud-mission-trial-4.html)
* [SAP HANA Cloud](https://community.sap.com/topics/hana)
* [SAP Business Application Studio](https://community.sap.com/topics/business-application-studio)
* [Subscribing to the SAP HANA Cloud Administration Tools](https://help.sap.com/docs/hana-cloud/sap-hana-cloud-administration-guide/subscribing-to-sap-hana-cloud-administration-tools)

### What is SAP HANA Cloud Multi-Environment?

The SAP HANA Cloud multi-environment is a modern approach to managing and deploying SAP HANA databases. It allows for greater flexibility and scalability by supporting multiple environments such as Cloud Foundry and Kyma. This multi-environment setup enables seamless integration and management of various services and applications within the SAP ecosystem.

#### Differences from Older Options

* **Flexibility**: The multi-environment setup supports multiple runtime environments, unlike older options which were limited to a single environment.
* **Scalability**: It provides better scalability options, allowing for dynamic allocation of resources based on demand.
* **Integration**: Enhanced integration capabilities with other SAP services and third-party applications.
* **Management**: Improved tools and interfaces for managing databases and services across different environments.

## Next

Continue to 👉 [Exercise 2 - Create an SAP Cloud Application Programming Model Project for SAP HANA Cloud](../ex2/README.md)
