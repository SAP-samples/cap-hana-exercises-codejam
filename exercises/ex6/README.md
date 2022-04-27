# Exercise 6 - Create Calculation View and Expose via CAP (SAP HANA Cloud)

In this exercise we will learn how to combine HANA native artifacts, like calculation views, with SAP Cloud Application Programming Model (CAP).

Perform all the steps in 👉 [tutorial: Create Calculation View and Expose via CAP (SAP HANA Cloud)](https://developers.sap.com/tutorials/hana-cloud-cap-calc-view.html)

## Summary

You've now experienced Calculation View development in the Business Application Studio.  For some of you this might have been a big change from HANA Studio.  For others coming from SAP Web IDE, the difference isn't really all that great.

But perhaps more importantly you now know how to create a CAP `proxy` entity to import an existing database artifact into CAP (and therefore also use it in the service layer).  This can be done for database tables that weren't modeled in CAP or that come from another schema/container as well as SQL Views.

### Questions for Discussion

1. This was a very basic Calculation View and perhaps everyone in the room is already familiar with Calculation Views; but if new to the topic -- what is a [Calculation View](https://help.sap.com/docs/SAP_HANA_PLATFORM/52715f71adba4aaeb480d946c742d1f6/18e1d60a75524e43b81acff652dae772.html) and how is it different from a [SQL View](https://help.sap.com/docs/HANA_CLOUD_DATABASE/c1d3f60099654ecfb3fe36ac93c121bb/20d5fa9b75191014a33eee92692f1702.html)?

2. Why did we change from a [namespace](https://cap.cloud.sap/docs/guides/domain-models#using-namespaces) to a [context](https://cap.cloud.sap/docs/guides/domain-models#prefer-namespaces-over-top-level-contexts) in steps three?

3. What is [`@cds.persistence.exists`](https://cap.cloud.sap/docs/cds/annotations#persistence) doing?

4. What is [`@cds.persistence.calcview`](https://cap.cloud.sap/docs/advanced/hana#calculated-views-and-user-defined-functions) doing?

## Further Study

* [CAP - Using Native SAP HANA Artifacts](https://cap.cloud.sap/docs/advanced/hana)
* [SAP HANA Cloud, SAP HANA Database Modeling Guide for SAP Business Application Studio](https://help.sap.com/docs/HANA_CLOUD_DATABASE/d625b46ef0b445abb2c2fd9ba008c265/9ed48614318a4831a8a6b3e3222a05f0.html)
* [hana-cli inspectView](https://github.com/SAP-samples/hana-developer-cli-tool-example#inspectview)

## Next

Continue to 👉 [Exercise 7 - Create HANA Stored Procedure and Expose as CAP Service Function (SAP HANA Cloud)](../ex7/README.md)
