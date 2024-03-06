# Exercise 3 - Create Database Artifacts Using Core Data Services (CDS) for SAP HANA Cloud

In this exercise we will use SAP Cloud Application Programming Model (CAP) and Core Data Services (CDS) to generate SAP HANA Cloud basic database artifacts.

Perform all the steps in 👉 [tutorial: Create Database Artifacts Using Core Data Services (CDS) for SAP HANA Cloud](https://developers.sap.com/tutorials/hana-cloud-cap-create-database-cds.html)

## Summary

You've now designed database tables, deployed them into an SAP HANA Cloud database instance, and loaded data into them using the Database Explorer.

### Questions for Discussion

1. We loaded data into the tables using the import feature of the Database Explorer. Is anyone familiar with [alternatives](https://cap.cloud.sap/docs/guides/databases#providing-initial-data) to this to get initial data into your new tables?

1. Where is Country coming from in interactions.cds? [Hint](https://cap.cloud.sap/docs/guides/reuse-and-compose)

   ```cds
   using { Country } from '@sap/cds/common';
   ```

1. What's the difference between [Composition](https://cap.cloud.sap/docs/guides/domain-modeling#_5-add-compositions) and [Association](https://cap.cloud.sap/docs/guides/domain-modeling#associations)? [Additional reading on Compositions](https://cap.cloud.sap/docs/cds/cdl#compositions) and [additional reading on Associations](https://cap.cloud.sap/docs/cds/cdl#associations)

1. In the service implementation (interaction_srv.cds), how do you know you are creating an OData service?

## Further Study

* [Video Version of this Tutorial](https://youtu.be/hlHY7eBriRA)
* [SAP HANA Database Explorer](https://help.sap.com/docs/HANA_CLOUD/a2cea64fa3ac4f90a52405d07600047b/7fa981c8f1b44196b243faeb4afb5793.html?locale=en-US)
* [Domain Modeling with CDS](https://cap.cloud.sap/docs/guides/domain-modeling)
* [Generated HDI Artifacts](https://cap.cloud.sap/docs/guides/databases-hana#generated-hdi-artifacts)

## Next

Continue to 👉 [Exercise 4 - Create a User Interface with CAP (SAP HANA Cloud)](../ex4/README.md)
