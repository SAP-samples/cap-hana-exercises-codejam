# Exercise 6 - Create Calculation View and Expose via CAP (SAP HANA Cloud)

In this exercise we will learn how to combine HANA native artifacts, like calculation views, with SAP Cloud Application Programming Model (CAP).

Perform all the steps in 👉 [tutorial: Create Calculation View and Expose via CAP (SAP HANA Cloud)](https://developers.sap.com/tutorials/hana-cloud-cap-calc-view.html)

## Summary

You've now experienced Calculation View development in the Business Application Studio.  For some of you this might have been a big change from HANA Studio.  For others coming from SAP Web IDE, the difference isn't really all that much.

But perhaps more importantly you now know how to create a CAP `proxy` entity to import an existing database artifact into CAP (and therefore also use it in the service layer).  This can be done for database tables that weren't modeled in CAP or that come from another schema/container as well as SQL Views.

### Questions for Discussion

1. This was a very basic Calculation View and perhaps everyone in the room is already familiar with Calculation Views; but if new to the topic -- what is a [Calculation View](https://help.sap.com/docs/SAP_HANA_PLATFORM/52715f71adba4aaeb480d946c742d1f6/18e1d60a75524e43b81acff652dae772.html) and how is it different from a [SQL View](https://help.sap.com/docs/HANA_CLOUD_DATABASE/c1d3f60099654ecfb3fe36ac93c121bb/20d5fa9b75191014a33eee92692f1702.html)?<details><summary>Answer</summary>A Calculation View is a powerful feature in SAP HANA that allows for complex data transformations and aggregations. It is different from a SQL View in that it can include multiple data sources, advanced calculations, and graphical modeling, whereas a SQL View is a simpler, predefined query on a single table or a set of joined tables.</details>

1. Why did we change from a [namespace](https://cap.cloud.sap/docs/guides/domain-modeling#using-namespaces) to a [context](https://cap.cloud.sap/docs/cds/cdl#context) in steps three?<details><summary>Answer</summary>We changed from a namespace to a context to better organize and encapsulate the entities and services within the CAP model. Contexts provide a way to group related entities and services, making the model more modular and easier to manage. But most important in this case is the need for the proxy entity name to match the underlying database object (in this case the Calculation View) EXACTLY. The namespace is applied to everything in the file, but the context allows us to have the same functionality but only applied to a section of the objects in the cds file. This allows us to have the benefits above for all the native CDS objects but also keep the specific, simple name to match the Calculation View.</details>

1. What is [`@cds.persistence.exists`](https://cap.cloud.sap/docs/cds/annotations#persistence) doing?<details><summary>Answer</summary>The `@cds.persistence.exists` annotation indicates that the entity already exists in the database and should not be created or altered by the CAP framework. It is used to integrate existing database artifacts into the CAP model without modifying them. This is particularly useful when you want to use existing tables, views, or other database objects that were not created by CAP but need to be part of your CAP service. By using this annotation, you ensure that CAP does not attempt to recreate or modify these objects during deployment, thus preserving their original structure and data.</details>

1. What is [`@cds.persistence.calcview`](https://cap.cloud.sap/docs/advanced/hana#calculated-views-and-user-defined-functions) doing?<details><summary>Answer</summary>The `@cds.persistence.calcview` annotation is used to indicate that the entity represents a calculation view in SAP HANA. This allows CAP to recognize and interact with the calculation view as part of the service layer.</details>

## Further Study

* [CAP - Using Native SAP HANA Artifacts](https://cap.cloud.sap/docs/advanced/hana)
* [SAP HANA Cloud, SAP HANA Database Modeling Guide for SAP Business Application Studio](https://help.sap.com/docs/HANA_CLOUD_DATABASE/d625b46ef0b445abb2c2fd9ba008c265/9ed48614318a4831a8a6b3e3222a05f0.html)
* [hana-cli inspectView](https://github.com/SAP-samples/hana-developer-cli-tool-example#inspectview)
The `hana-cli inspectView` command is used to inspect the details of a calculation view in SAP HANA. It provides metadata about the view, including its structure, columns, and dependencies. This command is useful for understanding the composition and properties of a calculation view, which can aid in debugging and development.

## Next

Continue to 👉 [Exercise 7 - Create HANA Stored Procedure and Expose as CAP Service Function (SAP HANA Cloud)](../ex7/README.md)
