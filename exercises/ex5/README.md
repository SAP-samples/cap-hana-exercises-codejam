# Exercise 5 - Add User Authentication to Your Application (SAP HANA Cloud)

In this exercise we will define security and enable user authentication and authorization for your SAP HANA Cloud CAP application.

Perform all the steps in 👉 [tutorial: Add User Authentication to Your Application (SAP HANA Cloud)](https://developers.sap.com/tutorials/hana-cloud-cap-add-authentication.html)

## Summary

While we could use CAP to mock the authentication, we've gone a step further in this exercise and generated a real XSUAA instance and added authentication to our application in a way that allows us to still test via the locally running services in the Business Application Studio.

### Questions for Discussion

1. Why is the `redirect-uris` needed in the [xs-security.json](https://www.npmjs.com/package/@sap/approuter#xs-appjson-configuration-file)?<details><summary>Answer</summary>
   The `redirect-uris` are needed in the `xs-security.json` to specify the URIs to which the authentication service can redirect the user after a successful login. This ensures that the user is redirected to a valid and trusted location within the application.
   The `xs-app.json` configuration file is used to define the routes and authentication settings for the SAP Application Router. It includes properties such as `authenticationMethod`, `routes`, and `redirect-uris` to control how requests are handled and authenticated. This configuration ensures secure access to the application and proper routing of requests.</details>

1. What other [authentication strategies](https://cap.cloud.sap/docs/node.js/authentication#strategies) could we have used with CAP?<details><summary>Answer</summary>
   Other authentication strategies that could be used with CAP include:
   - Dummy Authentication: Used for local development and testing without real authentication.
   - Mocked Authentication: Simulates authentication for testing purposes.
   - Basic Authentication: Uses a username and password for authentication.
   - JWT (JSON Web Token): Uses tokens for stateless authentication.
   - XSUAA (SAP Authorization and Trust Management Service): Provides OAuth2-based authentication and authorization.
   - IAS (Identity Authentication Service): SAP's cloud-based identity service.
   - Custom Authentication: Implementing custom logic to handle authentication based on specific requirements.
   Each of these strategies offers different mechanisms for verifying user identities and can be chosen based on the specific requirements and security policies of the application.</details>

1. Why did the request to `/user-api/` work?  We didn't code it and CAP didn't provide it. So [where did it come from](https://blogs.sap.com/2021/02/20/sap-tech-bytes-approuter-user-api-service/)?<details><summary>Answer</summary>
   The request to `/user-api/` worked because it is provided by the SAP Application Router. The Application Router includes a built-in service called `user-api` that exposes user information and authentication details. This service is automatically available when using the Application Router, allowing applications to access user-related data without needing to implement this functionality themselves.</details>

## Further Study

- [SAP CAP Authentication](https://cap.cloud.sap/docs/node.js/authentication)
- [XSUAA in Hybrid Setup](https://cap.cloud.sap/docs/node.js/authentication#xsuaa-setup)
- [CAP Authorization and Access Control](https://cap.cloud.sap/docs/guides/authorization)
- [SAP BTP Roles and Role Collections](https://help.sap.com/docs/BTP/65de2977205c403bbc107264b8eccf4b/14a877c6e2f14832999df500ffa6e05e.html)

## Next

Continue to 👉 [Exercise 6 - Create Calculation View and Expose via CAP (SAP HANA Cloud)](../ex6/README.md)
