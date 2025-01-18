# Instructor Setup for CodeJam

## The SAP BTP SubAccount Details

Provide details about the SAP BTP SubAccount required for the CodeJam.

1. Log in the [SAP BTP Global Account: Developer Advocates Free Tier](https://emea.cockpit.btp.cloud.sap/cockpit/#/globalaccount/275320f9-4c26-4622-8728-b6f5196075f5/accountModel&//?section=HierarchySection&view=TreeTableView).
1. Navigate to the Direcotries and SubAccounts section.There you will find a folder for CodeJams. Within that is the Subaccount [CAP CodeJam](https://emea.cockpit.btp.cloud.sap/cockpit/#/globalaccount/275320f9-4c26-4622-8728-b6f5196075f5/subaccount/13f4f274-4515-4c67-8274-cbde80a4e744/subaccountoverview).  That's where we will work.
![SAP BTP SubAccount](images/instructor/subaccount.png "SAP BTP SubAccount")

## Enable Cloud Foundry and Create a `Dev` Space

Instructions on how to Enable Cloud Foundry Environment.

1. Enable the Cloud Foundry Enviroment. ![Enable Cloud Foundry](images/instructor/enableCloudFoundry.png "Enable Cloud Foundry")
1. Use the default Enablment dialog choices.
1. Once the org is created, create a space named `dev` ![Create Space](images/instructor/createSpace.png "Create Space")![Create Space Dialog](images/instructor/createSpace2.png "Create Space Dialog")
1. Add the other instructors as Space Members with all roles.![Add Space Members](images/instructor/spaceMembers.png "Add Space Members")

## Provisioning of SAP HANA Cloud

Instructions on how to provision SAP HANA Cloud for the event.

1. Perform all the steps in 👉 [tutorial: Deploy SAP HANA Cloud](https://developers.sap.com/tutorials/hana-cloud-deploying.html). You now have an SAP HANA database fully accessible to you with the full range of HANA Cloud capabilities.

## Adding Users

Guide on how to add users to the SAP BTP Subaccount and Cloud Foundry Environment

1. Navigate to the "Security" section in your SubAccount. `Security -> Users` ![Navigate to User Management](images/instructor/securityUsers.png "Navigate to User Management")
1. Create User ![Create User](images/instructor/createUser.png "Create User")
1. Enter the email addresses of the participants and use the `Default identity provider` ![Create User Dialog](images/instructor/createUserDialog.png "Create User Dialog")
1. Assign them to the `CodeJam` Role Collection. ![Assign Role Collection](images/instructor/assignRoleCollection.png "Assign Role Collection") ![Assign CodeJam Role Collection](images/instructor/assignCodeJamRC.png "Assign CodeJam Role Collection")
1. Assign the users to the Cloud Foundry `dev` Space ![Add Space Members](images/instructor/spaceMembers.png "Add Space Members")

## Clean Up After the Event

Instructions on how to clean up resources after the event.

1. Delete all the HDI container instances from the BTP Cockpit SubAccount/Instances views. ![Delete Service Instances](images/instructor/cleanupDeleteServiceInstances.png "Delete Service Instances")

1. Disable the Cloud Foundry Enviroment. This will remove all user access at the CF level and clean up remaining resources. ![Disable Cloud Foundry](images/instructor/cleanupCloudFoundry.png "Disable Cloud Foundry")

1. Delete the HANA Cloud Instance to save money.
   * From the Subscriptions click on `SAP HANA Cloud`![SAP HANA Cloud Tools](images/instructor/hanaCloudTools.png "SAP HANA Cloud Tools")
   * Then `Actions -> Delete`![Delete](images/instructor/hanaCloudDelete.png "Delete")

1. Remove Users
   * `Security -> Users` ![Navigate to User Management](images/instructor/securityUsers.png "Navigate to User Management")
   * Manually delete all workshop users ![Delete Users](images/instructor/deleteUsers.png "Delete Users")

1. Remove created Role Collections
   * `Security -> Role Collections`
   * Manually delete all role collections created by the workshop users ![Delete Role Collection](images/instructor/deleterolecollection.png)
