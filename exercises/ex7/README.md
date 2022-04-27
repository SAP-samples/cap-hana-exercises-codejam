# Exercise 7 - Create HANA Stored Procedure and Expose as CAP Service Function (SAP HANA Cloud)

In this exercise we will further combine SAP HANA Cloud native artifacts with the SAP Cloud Application Programming Model (CAP), and expose SQLScript procedures as service functions.

Perform all the steps in 👉 [tutorial: Create HANA Stored Procedure and Expose as CAP Service Function (SAP HANA Cloud)](https://developers.sap.com/tutorials/hana-cloud-cap-stored-proc.html)

## Summary

The goals of this exercise are vary similar to the previous one.  Import and Expose an existing database artifact via CAP. But there are some major differences here for Stored Procedures.  Unlike views they aren't exposed as entities but as [functions or actions](https://cap.cloud.sap/docs/guides/providing-services#actions-and-functions).

### Questions for Discussion

1. What's [`SQLSCRIPT_SYNC`](https://help.sap.com/docs/HANA_CLOUD_DATABASE/d1cb63c8dd8e4c35a0f18aef632687f0/31321d64e34e4a808fb448e6fa312c03.html)?

2. Why did we have to redeploy to the HANA Database after adding the Calculation View to the CAP service but didn't need to do the same when adding the Stored Procedure?

3. What's the difference between a [function and an action](https://cap.cloud.sap/docs/guides/providing-services#actions-vs-functions)?

4. Why did we use module [`sap-hdb-promisfied`](https://blogs.sap.com/2022/04/05/sap-tech-bytes-hana-client-tools-for-javascript-developers-part-2-promises/) instead of `hdb` directly?

5. A note and not a question.  There is a [new, experimental feature](https://cap.cloud.sap/docs/releases/mar22#driver-agnostic-results-for-stored-procedures) to call stored procedures directly using `cds.run` introduced in the March 2022 version of CAP. You can read more about it [here](https://blogs.sap.com/2022/04/07/sap-tech-bytes-hana-client-tools-for-javascript-developers-part-4-xsjs-and-cap/).

## Further Study

* [CAP - Using Native SAP HANA Artifacts](https://cap.cloud.sap/docs/advanced/hana)
* [SAP HANA Cloud, SAP HANA SQLScript Reference](https://help.sap.com/docs/HANA_CLOUD_DATABASE/d1cb63c8dd8e4c35a0f18aef632687f0/28f2d64d4fab4e789ee0070be418419d.html)
* [hdb module](https://www.npmjs.com/package/hdb)
* [sap-hdb-promisfied module](https://www.npmjs.com/package/sap-hdb-promisfied)

## Next

Continue to 👉 [Exercise 8 - Deploy CAP with SAP HANA Cloud project as MTA](../ex8/README.md)
