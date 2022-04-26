# Exercise 5 - Add User Authentication to Your Application (SAP HANA Cloud)

In this exercise we will define security and enable user authentication and authorization for your SAP HANA Cloud CAP application.

Perform all the steps in 👉 [tutorial: Add User Authentication to Your Application (SAP HANA Cloud)](https://developers.sap.com/tutorials/hana-cloud-cap-add-authentication.html)

## Summary

While we could use CAP to mock the authentication, we've gone a step further in this exercise and generated a real XSUAA instance and added authentication to our application in a way that allows us to still test via the locally running services in the Business Application Studio.

### Questions for Discussion

1. Why is the `redirect-uris` needed in the [xs-security.json](https://www.npmjs.com/package/@sap/approuter#xs-appjson-configuration-file)?

2. What other [authentication strategies](https://cap.cloud.sap/docs/node.js/authentication#strategies) could we have used with CAP?

3. Why did the request to `/user-api/` work?  We didn't code it and CAP didn't provide it. So [where did it come from](https://blogs.sap.com/2021/02/20/sap-tech-bytes-approuter-user-api-service/)?

## Further Study

* [SAP CAP Authentication](https://cap.cloud.sap/docs/node.js/authentication)
* [XSUAA in Hybrid Setup](https://cap.cloud.sap/docs/node.js/authentication#xsuaa-setup)
* [CAP Authorization and Access Control](https://cap.cloud.sap/docs/guides/authorization)
* [SAP BTP Roles and Role Collections](https://help.sap.com/docs/BTP/65de2977205c403bbc107264b8eccf4b/14a877c6e2f14832999df500ffa6e05e.html)

## Next

Continue to 👉 [Exercise 6 - Create Calculation View and Expose via CAP (SAP HANA Cloud)](../ex6/README.md)
