# Exercise 8 Bonus Homework - Deploy CAP with SAP HANA Cloud project as MTA

> **Note:** This exercise cannot be performed during the CodeJam because we are using a shared BTP subaccount with limited resources. However, you can complete this exercise later in your own environment. If you do not have access to a corporate BTP account, you can sign up for a [BTP trial account](https://www.sap.com/products/business-technology-platform/trial.html) to try it out. Knowing how to deploy the final application with real security in a production environment is valuable as it ensures that your application is secure and scalable.

In this exercise, you will learn how to deploy a CAP project with SAP HANA Cloud as a Multi-Target Application (MTA). This involves creating an MTA project, configuring the deployment, and deploying it to SAP Business Technology Platform.

Perform all the steps in 👉 [tutorial: Deploy CAP with SAP HANA Cloud project as MTA](https://developers.sap.com/tutorials/hana-cloud-cap-deploy-mta.html)

## Summary

In this exercise, you have successfully deployed a CAP project with SAP HANA Cloud as an MTA. You learned how to create an MTA project, configure the deployment, build the MTA archive, and deploy it to SAP BTP.

## Questions for Discussion

1. What is the Cloud MTA Build Tool?<details><summary>Answer</summary>The Cloud MTA Build Tool (MBT) is a command-line tool used to build multi-target applications (MTAs). It packages the application into a deployable archive (MTAR file) that can be deployed to SAP Business Technology Platform.</details>

1. Why is the db-deployer application in a Stopped status?<details><summary>Answer</summary>The db-deployer application is in a Stopped status because it is only needed during the deployment process to set up the database schema. Once the deployment is complete, the application is stopped to save resources.</details>

## Further Study

* [MTA Build Tool](https://sap.github.io/cloud-mta-build-tool/)
  * The MTA Build Tool (MBT) is a command-line tool used to build multi-target applications (MTAs). It packages the application into a deployable archive (MTAR file) that can be deployed to SAP Business Technology Platform.
* [xs-security.json](https://help.sap.com/docs/btp/sap-business-technology-platform/add-authentication-and-functional-authorization-checks-to-your-application?locale=en-US&q=xs-security.json)
  * The `xs-security.json` file is used to define the security configuration for applications deployed to SAP BTP, including roles, scopes, and attributes.
* [MTAR file](https://help.sap.com/docs/btp/sap-business-technology-platform/multitarget-applications-in-cloud-foundry-environment?locale=en-US&q=MTAR+)
  * An MTAR file is a deployable archive created by the MTA Build Tool that contains all the resources and modules of a multi-target application.
* [SAP BTP Cloud Foundry Runtime](https://help.sap.com/docs/btp/sap-business-technology-platform/cloud-foundry-environment?locale=en-US&q=Cloud+Foundry)
  * The SAP BTP Cloud Foundry Runtime is a platform-as-a-service (PaaS) offering that allows developers to build, deploy, and run applications on SAP Business Technology Platform using Cloud Foundry.
* [Cloud Foundry Deploy](https://docs.cloudfoundry.org/devguide/deploy-apps/deploy-app.html)
  * Cloud Foundry Deploy refers to the process of deploying applications to the Cloud Foundry environment, including pushing the application code, binding services, and managing application instances.
* [MultiApps CF CLI Plugin](https://github.com/cloudfoundry/multiapps-cli-plugin)
  * This is a Cloud Foundry CLI plugin (formerly known as CF MTA Plugin) for performing operations on Multitarget Applications (MTAs) in Cloud Foundry, such as deploying, removing, viewing, etc. It is a client for the CF MultiApps Controller (known also as CF MTA Deploy Service), which is an MTA deployer implementation for Cloud Foundry. The business logic and actual processing of MTAs happens into CF MultiApps Controller backend.
* [Cloud Foundry Application Routes](https://docs.cloudfoundry.org/devguide/deploy-apps/routes-domains.html)
  * Cloud Foundry Application Routes are used to map URLs to applications running in the Cloud Foundry environment, allowing external access to the applications.
