# Exercise 2 - Create an SAP Cloud Application Programming Model Project for SAP HANA Cloud

In this exercise we will use the wizard for the SAP Cloud Application Programming Model to create a project in SAP Business Application Studio that will also support SAP HANA Cloud.

Perform all the steps in [tutorial: Create an SAP Cloud Application Programming Model Project for SAP HANA Cloud](https://developers.sap.com/tutorials/hana-cloud-cap-create-project.html)

## Summary

At the end of this tutorial you have your `dev space`, the basic CAP project and have configured source control for this project. 

### Questions for discussion

1. What is the value of the `dev space` in the SAP Business Application Studio? To help with this discussion point consider the [prerequisites section](../../prerequisites.md) for not using the SAP Business Application Studio.

2. Why do you think it was necessary to login to Cloud Foundry?  HANA Cloud itself isn't actually running in Cloud Foundry not does it use Cloud Foundry for technical connections. But it's important to understand [HDI (HANA Deployment Infrastructure)](https://help.sap.com/docs/HANA_CLOUD_DATABASE/c2cc2e43458d4abda6788049c58143dc/e28abca91a004683845805efc2bf967c.html) containers and how they are controlled via Cloud Foundry service instances.

3. What's the purpose of the [mta.yaml](https://help.sap.com/docs/HANA_CLOUD_DATABASE/c2b99f19e9264c4d9ae9221b22f6f589/d8226e641a124b629b0e8f7c111cd1ae.html) file?

4. Who can explain what NPM is and how and why it is used?

5. Version Control with Git. How familiar is everyone with Git? Any ABAP developers in the room (if so we should talk). What's the reason/impact of using local Git repository as we did in this tutorial?

Continue to - [Exercise 3 - Create Database Artifacts Using Core Data Services (CDS) for SAP HANA Cloud](../ex3/README.md)

## Further Study

* [Video Version of this Tutorial](https://youtu.be/ydDOGz7P--8)
* [SAP Business Application Studio](https://community.sap.com/topics/business-application-studio)
* [SAP HDI Containers](https://help.sap.com/docs/HANA_CLOUD_DATABASE/c2cc2e43458d4abda6788049c58143dc/e28abca91a004683845805efc2bf967c.html)
* [HANA Cloud: HDI - Under the Hood](https://www.youtube.com/watch?v=UmOkjPxE6Us)
* [openSAP Version Control with Git](https://open.sap.com/courses/git1)
* [Git basics in 10 minutes](https://www.freecodecamp.org/news/learn-the-basics-of-git-in-under-10-minutes-da548267cc91/)