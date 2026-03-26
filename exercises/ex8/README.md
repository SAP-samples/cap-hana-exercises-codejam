# Exercise 8 Bonus Homework - Deploy CAP with SAP HANA Cloud project as MTA

> **Note:** This exercise cannot be performed during the CodeJam because we are using a shared BTP subaccount with limited resources. However, you can complete this exercise later in your own environment. If you do not have access to a corporate BTP account, you can sign up for a [BTP trial account](https://www.sap.com/products/business-technology-platform/trial.html) to try it out. Knowing how to deploy the final application with real security in a production environment is valuable as it ensures that your application is secure and scalable.

In this exercise, you will deploy your CAP project with SAP HANA Cloud as a Multi-Target Application (MTA) to SAP Business Technology Platform. This is the step that takes the app from a development-time prototype running locally in BAS into a fully secured, production-grade application accessible over the internet.

👉 Perform all the steps in [tutorial: Deploy CAP with SAP HANA Cloud project as MTA](https://developers.sap.com/tutorials/hana-cloud-cap-deploy-mta.html)

## Background

### What is an MTA?

A Multi-Target Application (MTA) is SAP BTP's packaging and deployment format for applications that span multiple Cloud Foundry modules and managed services. Instead of deploying each piece independently and manually wiring them together, you describe the entire application — its modules, their dependencies, and the services they consume — in a single `mta.yaml` descriptor file. The MTA toolchain then builds and deploys everything in the correct order with the correct bindings.

For a CAP + HANA Cloud application, the MTA graph looks like this:

```text
┌─────────────────────────────────────────────────────────┐
│                    MTA: MyHANAApp                       │
│                                                         │
│  ┌──────────────┐    ┌──────────────┐                   │
│  │ MyHANAApp    │    │ MyHANAApp    │                   │
│  │ (AppRouter)  │───▶│ -srv (CAP)   │                   │
│  └──────────────┘    └──────┬───────┘                   │
│                             │                           │
│                      ┌──────▼───────┐                   │
│                      │ MyHANAApp    │                   │
│                      │ -db-deployer │ (runs once, stops) │
│                      └──────┬───────┘                   │
│                             │                           │
│  ┌──────────────┐    ┌──────▼───────┐                   │
│  │ MyHANAApp    │    │ MyHANAApp-db │                   │
│  │ -auth (XSUAA)│    │ (HDI container)│                 │
│  └──────────────┘    └──────────────┘                   │
└─────────────────────────────────────────────────────────┘
```

### The three Cloud Foundry modules

The `mta.yaml` in this project defines three modules:

| Module | Type | Purpose |
| --- | --- | --- |
| `MyHANAApp-srv` | `nodejs` | The CAP Node.js service — serves OData endpoints, enforces authorization |
| `MyHANAApp-db-deployer` | `hdb` | A one-shot HDI deployer — pushes the database artifacts into the HDI container, then stops |
| `MyHANAApp` | `approuter.nodejs` | The SAP AppRouter — handles XSUAA login flows and proxies authenticated requests to the CAP service |

And two managed services:

| Service | Type | Purpose |
| --- | --- | --- |
| `MyHANAApp-auth` | `xsuaa` | Issues JWT tokens; defines the `Admin` scope referenced in `@requires: 'Admin'` in the CDS service definition |
| `MyHANAApp-db` | `hana` (hdi-shared plan) | An HDI container on your HANA Cloud instance — stores all tables, views, and native artifacts |

### Why the db-deployer stops after deployment

The `MyHANAApp-db-deployer` module exists solely to push the compiled HDI artifacts (`gen/db`) into the HDI container. It connects to `MyHANAApp-db`, runs the deployment, and then the process exits — which Cloud Foundry reports as a "Stopped" status. This is expected and correct behaviour. The deployer does not need to keep running because it has no incoming requests to serve; all database access at runtime goes through the CAP service layer.

### The `mta.yaml` build pipeline

The `before-all` build hook runs two commands before any module is packaged:

```yaml
build-parameters:
  before-all:
    - builder: custom
      commands:
        - npm ci
        - npx cds build --production
```

`npx cds build --production` compiles the CDS model and generates two output folders:

- `gen/srv` — the production Node.js bundle for `MyHANAApp-srv`
- `gen/db` — the compiled HDI artifact set for `MyHANAApp-db-deployer`

The MBT tool then packages each generated folder into the MTAR archive according to the `path:` values in `mta.yaml`.

### The security layer: XSUAA, AppRouter, and role assignments

In the earlier exercises, the CAP server ran without real authentication — the `@requires: 'authenticated-user'` and `@requires: 'Admin'` annotations were present in the CDS model but were not enforced because no XSUAA service was bound. Deploying as an MTA wires the real security chain:

1. **`xs-security.json`** — defines the `Admin` scope and a matching role template. The `xsappname` in this file must be unique within your BTP subaccount.
2. **XSUAA service** (`MyHANAApp-auth`) — created from `xs-security.json` by the MTA deployment. Issues JWT tokens that contain the scopes the user has been granted.
3. **AppRouter** (`MyHANAApp`) — the front door. It redirects unauthenticated users to the XSUAA login page, obtains a JWT on their behalf, and forwards it in the `Authorization` header of every request it proxies to the CAP service.
4. **CAP service** (`MyHANAApp-srv`) — validates the JWT on every request and checks that the required scope (`Admin`) is present before allowing access to restricted entities.

The destination `srv-api` is the glue between AppRouter and CAP service. It is **provided** by `MyHANAApp-srv` in `mta.yaml` and **consumed** by the AppRouter module. At runtime, the AppRouter resolves the `srv-api` destination to the internal URL of the CAP service, which is never directly exposed to the internet.

```yaml
# MyHANAApp-srv provides the destination
provides:
  - name: srv-api
    properties:
      srv-url: ${default-url}

# AppRouter consumes it
requires:
  - name: srv-api
    group: destinations
    properties:
      name: srv-api          # matches xs-app.json route destination
      url: ~{srv-url}
      forwardAuthToken: true # passes the XSUAA JWT to the CAP service
```

`forwardAuthToken: true` is critical — without it, the AppRouter would strip the JWT before forwarding, and the CAP service would reject every request as unauthenticated.

### The role assignment step

After deployment, the `Admin` role template defined in `xs-security.json` must be assigned to a user before they can access the Admin-restricted endpoints. This is done in the BTP cockpit:

1. Navigate to your subaccount → **Security → Role Collections**
2. Create a new Role Collection (e.g. `MyHANAApp-Admin`)
3. Edit the collection and add the `Admin` role from the `MyHANAApp` application
4. Assign the Role Collection to your BTP user under **Security → Users**

Without this step, authenticated users receive a valid JWT but it will not contain the `Admin` scope, and the CAP service will return `403 Forbidden` on restricted endpoints.

### Cloud MTA Build Tool (MBT)

The Cloud MTA Build Tool (`mbt`) is the command-line tool that reads `mta.yaml`, runs the `before-all` build commands, packages each module's output folder, and produces a single deployable `.mtar` archive file. The `.mtar` is a ZIP archive containing all module artifacts plus the MTA descriptor.

```bash
mbt build -p cf
# produces: mta_archives/MyHANAApp_1.0.0.mtar
```

The `-p cf` flag targets Cloud Foundry (as opposed to Neo, the legacy SAP BTP runtime).

### Deploying the MTAR with the MultiApps CF CLI plugin

The `cf deploy` command from the MultiApps CF CLI plugin reads the `.mtar` file and orchestrates the full deployment:

1. Uploads the archive to the CF MultiApps Controller
2. Creates or updates managed services (`MyHANAApp-auth`, `MyHANAApp-db`)
3. Deploys modules in dependency order (db-deployer before srv, srv before approuter)
4. Binds each module to its required services
5. Starts modules (db-deployer runs and stops; srv and approuter stay running)

```bash
cf deploy mta_archives/MyHANAApp_1.0.0.mtar
```

You can monitor progress with `cf mta MyHANAApp` and `cf apps`.

## Summary

You have deployed a CAP + SAP HANA Cloud application as a fully secured MTA. The key takeaways are:

- The MTA descriptor (`mta.yaml`) describes the entire application — modules, services, and their wiring — so the toolchain deploys everything consistently in one step
- Three CF modules work together: the CAP service (`srv`), a one-shot HDI deployer (`db-deployer`), and the AppRouter
- The db-deployer stopping after deployment is expected — it is a run-once task, not a long-running service
- XSUAA + AppRouter + CAP form a three-layer security chain; `forwardAuthToken: true` in `mta.yaml` is the connector between AppRouter and CAP
- After deployment you must manually assign the `Admin` role collection to users in the BTP cockpit before they can access restricted endpoints

## Questions for Discussion

1. What is the Cloud MTA Build Tool?

   <details><summary>Answer</summary>

   The Cloud MTA Build Tool (MBT) is a command-line tool that reads `mta.yaml`, executes the `before-all` build commands (`npm ci`, `npx cds build --production`), packages each module's output folder, and produces a single deployable `.mtar` archive. The `.mtar` is a ZIP file containing all module artifacts and the MTA descriptor, which can then be deployed to SAP BTP with `cf deploy`.

   </details>

1. Why is the db-deployer application in a Stopped status?

   <details><summary>Answer</summary>

   The `MyHANAApp-db-deployer` module is a one-shot HDI deployer: it connects to the HDI container, pushes the compiled database artifacts, and then exits. Cloud Foundry reports a process that has exited cleanly as "Stopped". This is expected — the deployer has no incoming requests to serve at runtime. All database access goes through the running CAP service (`MyHANAApp-srv`), which stays in "Started" status.

   </details>

1. What does `forwardAuthToken: true` do in `mta.yaml`, and what happens if it is missing?

   <details><summary>Answer</summary>

   `forwardAuthToken: true` tells the AppRouter to include the user's XSUAA JWT in the `Authorization` header when it proxies a request to the CAP service backend. Without it, the AppRouter strips the token before forwarding, and the CAP service receives an unauthenticated request — every call to a `@requires`-protected endpoint returns `403 Forbidden`, even for logged-in users.

   </details>

1. Why do users get a `403 Forbidden` response immediately after a successful deployment, and how do you fix it?

   <details><summary>Answer</summary>

   A successful deployment only creates the XSUAA service instance with the `Admin` scope defined. It does not automatically grant that scope to any user. Users must be assigned a Role Collection that includes the `Admin` role template before the scope appears in their JWT.

   Fix: in the BTP cockpit, create a Role Collection, add the `Admin` role from `MyHANAApp` to it, and assign the Role Collection to the relevant user under **Security → Users**.

   </details>

## Further Study

- [MTA Build Tool](https://sap.github.io/cloud-mta-build-tool/) — the MBT documentation, including all `mta.yaml` schema options and the `mbt build` command reference
- [MultiApps CF CLI Plugin](https://github.com/cloudfoundry/multiapps-cli-plugin) — the `cf deploy` plugin for deploying `.mtar` archives; includes `cf undeploy`, `cf mta`, and `cf mta-ops` commands
- [CAP - Deploying to Cloud Foundry](https://cap.cloud.sap/docs/guides/deployment/to-cf) — the CAP guide for production deployments, including `mta.yaml` generation with `cds add mta`
- [Multitarget Applications in Cloud Foundry](https://help.sap.com/docs/btp/sap-business-technology-platform/multitarget-applications-in-cloud-foundry-environment) — SAP BTP documentation on the MTA model, MTAR format, and deployment lifecycle
- [SAP BTP XSUAA Configuration](https://help.sap.com/docs/btp/sap-business-technology-platform/add-authentication-and-functional-authorization-checks-to-your-application) — `xs-security.json` reference: scopes, role templates, and OAuth2 configuration
- [AppRouter Documentation](https://www.npmjs.com/package/@sap/approuter) — full `xs-app.json` route configuration, destination forwarding, and logout endpoint options
- [SAP BTP Cloud Foundry Runtime](https://help.sap.com/docs/btp/sap-business-technology-platform/cloud-foundry-environment) — overview of the CF environment on SAP BTP, including org/space structure, buildpacks, and service marketplace
