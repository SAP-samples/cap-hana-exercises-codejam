# Exercise 8 - Deploy CAP with SAP HANA Cloud project as MTA)

In this exercise we will deploy your SAP HANA Cloud and Cloud Application Programming Model application as a Multi-Target Application (MTA) to SAP BTP, Cloud Foundry runtime.

Perform all the steps in 👉 [tutorial: Deploy CAP with SAP HANA Cloud project as MTA](https://developers.sap.com/tutorials/hana-cloud-cap-deploy-mta.html)

## Summary

All the development doesn't mean much if you can't deploy your project.  In this exercise we packaged the entire project for deployment as an MTAR (Multi-target Application Archive) and deployed the application to SAP BTP, Cloud Foundry runtime. But the process wasn't quite that simple, unfortunately.  We had to structure our project in certain ways to make both the CAP and HANA tooling in BAS work well together.  Now we had to undo some of those changes in order to deploy the finished application.

### Questions for Discussion

1. After you deployed the application, why was the data that we loaded from CSV gone from the newly deployed application?

2. Why do you think we added `node_modules` to the build-parameters ignore?

## Further Study

* [CAP - Deploy to Cloud Foundry](https://cap.cloud.sap/docs/guides/deployment/to-cf)
* [Building and Deploying Multitarget Applications](https://help.sap.com/docs/SAP%20Business%20Application%20Studio/9d1db9835307451daa8c930fbd9ab264/97ef204c568c4496917139cee61224a6.html)
* [The Cloud MTA Build Tool](https://www.npmjs.com/package/mbt)
* [The Cloud MTA Build Tool (MBT) User Guide](https://sap.github.io/cloud-mta-build-tool/)
* [The Multitarget Application Model](https://www.sap.com/documents/2016/06/e2f618e4-757c-0010-82c7-eda71af511fa.html)

## Next

"You're still here? It's over. Go home. Go!"
