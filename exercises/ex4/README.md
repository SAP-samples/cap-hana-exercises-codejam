# Exercise 4 - Create a User Interface with CAP (SAP HANA Cloud)

In this exercise we will use services based on SAP Cloud Application Programming Model Node.js and use an SAP Fiori wizard to create a user interface.

Perform all the steps in 👉 [tutorial: Create a User Interface with CAP (SAP HANA Cloud)](https://developers.sap.com/tutorials/hana-cloud-cap-create-ui.html)

## Summary

You now have an SAPUI5 based user interface for your CAP application. But in fact we've done much more than that in this exercise.  You've also added and configured the application router and "wired" the configuration between the CAP and the application router.

### Questions for Discussion

1. We added an [Application Router](https://www.npmjs.com/package/@sap/approuter) to your application, but what is it really and why is it helpful?<details><summary>Answer</summary>The Application Router (@sap/approuter) is a Node.js package that acts as a reverse proxy. It routes incoming requests to backend microservices and handles authentication, authorization, and other cross-cutting concerns. It simplifies the development of cloud applications by managing these aspects centrally.</details>

1. Why does the file default-env.json work?  Hint it has everything to do with [@sap/xsenv](https://www.npmjs.com/package/@sap/xsenv). How does `cds bind` [avoid the need for the default-env.json](https://cap.cloud.sap/docs/advanced/hybrid-testing#bind-to-cloud-services)?<details><summary>Answer</summary>The `default-env.json` file works because it contains environment variables that are read by the `@sap/xsenv` package to configure the application. The `@sap/xsenv` package simplifies the process of reading these variables and binding services to the application. The `cds bind` command avoids the need for the `default-env.json` file by directly binding cloud services to the CAP application, using service bindings defined in the SAP Business Technology Platform (BTP) environment. </details>

1. What is the difference between the standalone and managed app router, and why and when might you use each?<details><summary>Answer</summary>The standalone app router is deployed and managed by the developer, giving full control over its configuration and updates. It is suitable for custom scenarios where specific configurations are needed. The managed app router, on the other hand, is provided as a service by SAP and is automatically updated and maintained. It is ideal for standard use cases where ease of maintenance and reduced operational overhead are prioritized.</details>

1. What is the `cds bind` command, CAP hybrid testing, and why is this important to developers?<details><summary>Answer</summary>The `cds bind` command is used to bind services to a CAP application, allowing it to connect to external services such as databases or messaging systems. CAP hybrid testing refers to the ability to test CAP applications both locally and in the cloud, ensuring that they work correctly in different environments. This is important to developers because it allows them to develop and test their applications in a flexible and efficient manner, reducing the risk of issues when deploying to production.</details>

## Further Study

* [@sap/approuter](https://www.npmjs.com/package/@sap/approuter) - A Node.js module that acts as a reverse proxy, routing incoming requests to backend microservices. It handles authentication, authorization, and other cross-cutting concerns, simplifying the development of cloud applications.
* [@sap/xsenv](https://www.npmjs.com/package/@sap/xsenv) - A Node.js module that simplifies the process of reading environment variables and binding services to SAP applications. It helps in configuring applications by extracting service bindings and credentials from the environment.

## Next

Continue to 👉 [Exercise 5 - Add User Authentication to Your Application (SAP HANA Cloud)](../ex5/README.md)
