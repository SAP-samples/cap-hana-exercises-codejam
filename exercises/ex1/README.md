# Exercise 1 - Set Up SAP HANA Cloud and CAP Project

Before we can begin development we need to provision an SAP HANA Cloud database instance and ensure that we have access to our chosen development environment. 

## Exercise 1.1 Deploy SAP HANA Cloud

We will use the SAP BTP cockpit as a graphical tool to provision your free SAP HANA Cloud instance if you don't already have one in your account.

1. Perform all the steps in [tutorial: Deploy SAP HANA Cloud](https://developers.sap.com/tutorials/hana-cloud-deploying.html)

2. This is a one time activity. You know have a HANA Database fully accessible to you with the full range of HANA Cloud capabilities.  

3. **Very important** The system is stopped automatically each night and you need to manually restart every day you want to use it as described in the above tutorial. The most common error that people make is not restarting their HANA Cloud instance.

## Exercise 1.2 Set Up SAP Business Application Studio for Development

SAP Business Application Studio is a development environment available on SAP Business Technology Platform. Before you can start developing using SAP Business Application Studio, you must perform the required onboarding steps that are described in this step once.

<details><summary>SAP BTP free tier</summary>

1. If you are using the SAP BTP free tier, then you only need to perform the following steps
2. Step 2

</details>

<details><summary>SAP BTP free trial</summary>

1. If you are using the SAP BTP free trial, then perform all the steps in [this tutorial - Set Up SAP Business Application Studio for Development](https://developers.sap.com/tutorials/appstudio-onboarding.html)

</details>

## Summary

Now that you have your SAP HANA Cloud database instance and have setup the basics of your development environment, we are 

Continue to - [Exercise 2 - Exposing and Consuming Services via HTTP](../ex2/README.md)

## Further reading

* [Tools to Manage and Access the SAP HANA Cloud, SAP HANA Database](https://developers.sap.com/tutorials/hana-cloud-mission-trial-3.html)
