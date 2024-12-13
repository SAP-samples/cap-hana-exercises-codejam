# Exercise 7 - Create HANA Stored Procedure and Expose as CAP Service Function (SAP HANA Cloud)

In this exercise we will further combine SAP HANA Cloud native artifacts with the SAP Cloud Application Programming Model (CAP), and expose SQLScript procedures as service functions.

Perform all the steps in 👉 [tutorial: Create HANA Stored Procedure and Expose as CAP Service Function (SAP HANA Cloud)](https://developers.sap.com/tutorials/hana-cloud-cap-stored-proc.html)

## Summary

The goals of this exercise are vary similar to the previous one.  Import and Expose an existing database artifact via CAP. But there are some major differences here for Stored Procedures.  Unlike views they aren't exposed as entities but as [functions or actions](https://cap.cloud.sap/docs/guides/providing-services#actions-and-functions).

### Questions for Discussion

1. What's [`SQLSCRIPT_SYNC`](https://help.sap.com/docs/HANA_CLOUD_DATABASE/d1cb63c8dd8e4c35a0f18aef632687f0/31321d64e34e4a808fb448e6fa312c03.html)?<details><summary>Answer</summary>In some scenarios you may need to let certain processes wait for a while (for example, when executing repetitive tasks). Implementing such waiting manually may lead to "busy waiting" and to the CPU performing unnecessary work during the waiting time. To avoid this, SQLScript offers a built-in library SYS.SQLSCRIPT_SYNC containing the procedures SLEEP_SECONDS and WAKEUP_CONNECTION.</details>

1. Why did we have to redeploy to the HANA Database after adding the Calculation View to the CAP service but didn't need to do the same when adding the Stored Procedure?<details><summary>Answer</summary>The Calculation View creates an entity via the Service Definition which requires deployment into the database (creating a SQL View on top of the Calculation View) for access via OData.  However functions and actions, which are used to access SQLScript objects, do not need such entities generated and therefore don't need a database deployment before they can be accessed.</details>

1. What's the difference between a [function and an action](https://cap.cloud.sap/docs/guides/providing-services#actions-vs-functions)?<details><summary>Answer</summary>Functions are read-only operations that do not change the state of the system, while actions can perform operations that modify the state of the system.</details>

1. Why did we use module CAP (https://cap.cloud.sap/docs/releases/archive/2022/mar22#driver-agnostic-results-for-stored-procedures) instead of `hdb` directly to call the Stored Procedure? You can read more about it [here](https://blogs.sap.com/2022/04/07/sap-tech-bytes-hana-client-tools-for-javascript-developers-part-4-xsjs-and-cap/).<details><summary>Answer</summary>Using the CAP module provides a driver-agnostic way to call stored procedures, which simplifies the code and makes it more maintainable compared to using the `hdb` module directly.</details>

## Further Study

* [CAP - Using Native SAP HANA Artifacts](https://cap.cloud.sap/docs/advanced/hana)
* [SAP HANA Cloud, SAP HANA SQLScript Reference](https://help.sap.com/docs/HANA_CLOUD_DATABASE/d1cb63c8dd8e4c35a0f18aef632687f0/28f2d64d4fab4e789ee0070be418419d.html)
* [hdb module](https://www.npmjs.com/package/hdb) - The `hdb` module is a Node.js client for SAP HANA that allows you to execute SQL queries, call stored procedures, and manage database connections.
* [sap-hdb-promisfied module](https://www.npmjs.com/package/sap-hdb-promisfied) - The `sap-hdb-promisfied` module is a wrapper around the `hdb` module that adds promise support, making it easier to work with asynchronous operations in a more readable and maintainable way.

## Next

Continue to 👉 [Exercise 8 - Deploy CAP with SAP HANA Cloud project as MTA](../ex8/README.md)
