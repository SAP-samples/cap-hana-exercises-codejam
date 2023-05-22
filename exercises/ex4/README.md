# Exercise 4 - Create a User Interface with CAP (SAP HANA Cloud)

In this exercise we will use services based on SAP Cloud Application Programming Model Node.js and use an SAP Fiori wizard to create a user interface.

Perform all the steps in 👉 [tutorial: Create a User Interface with CAP (SAP HANA Cloud)](https://developers.sap.com/tutorials/hana-cloud-cap-create-ui.html)

## Summary

You now have an SAPUI5 based user interface for your CAP application. But in fact we've done much more than that in this exercise.  You've also added and configured the application router and "wired" the configuration between the CAP and the application router.

### Questions for Discussion

1. We added an [Application Router](https://www.npmjs.com/package/@sap/approuter) to your application, but what is it really and why is it helpful?

2. We added a [Standalone Approuter](https://blogs.sap.com/2020/04/03/sap-application-router/), but there was also an option for a Managed Approuter. What's [the difference](https://blogs.sap.com/2021/05/17/sap-tech-bytes-faq-managed-approuter-vs.-standalone-approuter/)?

3. Why does the file default-env.json work?  Hint it has everything to do with [@sap/xsenv](https://www.npmjs.com/package/@sap/xsenv). How does `cds bind` avoid the need for the default-env.json? 

## Further Study

* [@sap/approuter](https://www.npmjs.com/package/@sap/approuter)
* [@sap/xsenv](https://www.npmjs.com/package/@sap/xsenv)
* [SAPUI5](https://sapui5.hana.ondemand.com/)

## Next

Continue to 👉 [Exercise 5 - Add User Authentication to Your Application (SAP HANA Cloud)](../ex5/README.md)
