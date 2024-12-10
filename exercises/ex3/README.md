# Exercise 3 - Create Database Artifacts Using Core Data Services (CDS) for SAP HANA Cloud

In this exercise we will use SAP Cloud Application Programming Model (CAP) and Core Data Services (CDS) to generate SAP HANA Cloud basic database artifacts.

Perform all the steps in 👉 [tutorial: Create Database Artifacts Using Core Data Services (CDS) for SAP HANA Cloud](https://developers.sap.com/tutorials/hana-cloud-cap-create-database-cds.html)

## Summary

You've now designed database tables, deployed them into an SAP HANA Cloud database instance, and loaded data into them using the Database Explorer.

### Questions for Discussion

1. We loaded data into the tables using the import feature of the Database Explorer. Is anyone familiar with [alternatives](https://cap.cloud.sap/docs/guides/databases#providing-initial-data) to this to get initial data into your new tables?<details><summary>Answer</summary>
   In CAP, you can also load CSV files from the project. To do this, place your CSV files in the `db/data` folder of your CAP project. The CAP framework will automatically detect these files and load the data into the corresponding tables during deployment. The CSV files should be named according to the entity they represent, for example, `Books.csv` for the `Books` entity.

   Additionally, you can create CSV files via AI in SAP Build Code. SAP Build Code provides AI-assisted tools to generate CSV files based on your data model. You can use these tools to quickly create and populate CSV files with sample data, which can then be used to initialize your database tables.

   What are the advantages of loading data via HANA Table Import over using the CSV files that are part of the CAP project?
   * **Flexibility**: You can import data from various formats and sources, not just CSV files.
   * **Large Data Sets**: It is more efficient for handling large data sets, as it can leverage HANA's optimized import mechanisms.
   * **Data Transformation**: You can apply transformations and mappings during the import process.
   * **Error Handling**: Provides better error handling and logging capabilities.
   * **Incremental Loads**: Supports incremental data loads, which is useful for updating existing tables without full reloads.

   </details>

1. Where is Country coming from in interactions.cds? [Hint](https://cap.cloud.sap/docs/guides/reuse-and-compose)
   <details><summary>Answer</summary>

   ```cds
   using { Country } from '@sap/cds/common';
   ```

   The `@sap/cds-common-content` Node.js module provides a set of common data models and services that can be reused across different CAP projects. It includes predefined entities, types, and annotations that are commonly used in business applications, such as `Country`, `Currency`, and `Language`. By using this module, developers can avoid duplicating common definitions and ensure consistency across their projects. It simplifies the development process by providing a standardized set of reusable components, making it easier to build and maintain CAP applications.

   The `sap.common.Countries` entity is part of the `@sap/cds/common` module and represents a standardized list of countries. This entity includes fields such as `code` and `name`, which can be used to store and retrieve country information in a consistent manner across different CAP applications. By using `sap.common.Countries`, developers can leverage a predefined and widely accepted data model for country information, ensuring compatibility and reducing the need for custom implementations.</details>

1. What's the difference between [Composition](https://cap.cloud.sap/docs/guides/domain-modeling#_5-add-compositions) and [Association](https://cap.cloud.sap/docs/guides/domain-modeling#associations)? [Additional reading on Compositions](https://cap.cloud.sap/docs/cds/cdl#compositions) and [additional reading on Associations](https://cap.cloud.sap/docs/cds/cdl#associations)
   <details><summary>Answer</summary>

   **Composition**:
   * Represents a strong ownership relationship where the lifecycle of the child entity is dependent on the parent entity.
   * If the parent entity is deleted, the child entities are also deleted.
   * Example:

     ```cds
     entity Order {
       key ID : UUID;
       Items : Composition of many OrderItems on Items.parent = $self;
     }

     entity OrderItems {
       key ID : UUID;
       parent : Association to Order;
       product : String;
       quantity : Integer;
     }
     ```

   * Use Composition when you want to model a whole-part relationship where the parts cannot exist without the whole.

   **Association**:
   * Represents a weaker relationship where the associated entities can exist independently.
   * Deleting the parent entity does not affect the associated entities.
   * Example:

     ```cds
     entity Customer {
       key ID : UUID;
       name : String;
       orders : Association to many Order on orders.customer = $self;
     }

     entity Order {
       key ID : UUID;
       customer : Association to Customer;
       totalAmount : Decimal;
     }
     ```

   * Use Association when you want to model a relationship where the entities can exist independently and have their own lifecycle.

   </details>

1. In the service implementation (interaction_srv.cds), how do you know you are creating an OData service?
   <details><summary>Answer</summary>
   In the service implementation (`interaction_srv.cds`), you can identify that you are creating an OData service by the use of the `service` keyword and the annotations that specify the OData protocol. For example:

   ```cds
   service InteractionService {
     @odata.draft.enabled
     entity Interactions as projection on my.Interactions;
   }
   ```

   The `@odata.draft.enabled` annotation indicates that the service supports OData draft functionality. Additionally, the `service` keyword defines an OData service that exposes the specified entities. These annotations and keywords are part of the CDS syntax that CAP uses to generate OData services automatically.

   The default service type in CAP is the OData V4 service. When you define a service using the `service` keyword in CDS, it is automatically treated as an OData service unless specified otherwise.
   </details>

## Further Study

* [Video Version of this Tutorial](https://youtu.be/hlHY7eBriRA)
* [SAP HANA Database Explorer](https://help.sap.com/docs/HANA_CLOUD/a2cea64fa3ac4f90a52405d07600047b/7fa981c8f1b44196b243faeb4afb5793.html?locale=en-US)
* [Domain Modeling with CDS](https://cap.cloud.sap/docs/guides/domain-modeling)
* [Generated HDI Artifacts](https://cap.cloud.sap/docs/guides/databases-hana#generated-hdi-artifacts)

## Next

Continue to 👉 [Exercise 4 - Create a User Interface with CAP (SAP HANA Cloud)](../ex4/README.md)
