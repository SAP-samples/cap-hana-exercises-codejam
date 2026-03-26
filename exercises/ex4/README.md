# Exercise 4 - Create a User Interface with CAP (SAP HANA Cloud)

In this exercise you will use the SAP Fiori tools wizard in SAP Business Application Studio (BAS) to generate an SAPUI5 Fiori Elements List Report application on top of the CAP OData service you built in Exercise 3. You will also add and configure an Application Router, which becomes the front door for the entire application.

## Background

### What Fiori Elements generates for you

Fiori Elements is a framework of **ready-made page templates** — List Report, Object Page, Analytical List Page, and others — that render entirely from OData V4 metadata and CDS UI annotations. You do not write view controllers or UI bindings by hand; instead, you annotate your CDS model and the framework generates the correct UI at runtime.

The Fiori tools wizard in BAS introspects your running CAP service, reads its `$metadata` document, and generates three files for you:

| File | Purpose |
|---|---|
| `app/interaction_items/webapp/manifest.json` | SAPUI5 app descriptor: routes, data sources, libraries |
| `app/interaction_items/annotations.cds` | CDS UI annotations that control columns, fields, and facets |
| `app/interaction_items/webapp/index.html` | Entry point for local preview |

The annotations file is where the UI is "configured" rather than coded. For example, the `UI.LineItem` annotation in `app/interaction_items/annotations.cds` defines which columns appear in the list table:

```cds
annotate service.Interactions_Header with @(
    UI.LineItem: [
        { $Type: 'UI.DataField', Label: 'Partner', Value: partner },
        { $Type: 'UI.DataField', Label: 'Country',  Value: country.name }
    ]
);
```

Changing the list of `DataField` entries changes the table columns — no JavaScript required.

### How manifest.json wires the UI to the CAP service

`manifest.json` is the SAPUI5 application descriptor. The key section is `sap.app.dataSources`:

```json
"dataSources": {
  "mainService": {
    "uri": "/odata/v4/catalog/",
    "type": "OData",
    "settings": { "odataVersion": "4.0" }
  }
}
```

This tells the app to call `/odata/v4/catalog/` for all data. The three routing targets (`Interactions_HeaderList`, `Interactions_HeaderObjectPage`, `Interactions_ItemsObjectPage`) map to `sap.fe.templates.ListReport` and `sap.fe.templates.ObjectPage` — these are the Fiori Elements page templates from the `sap.fe.templates` library.

### What the Application Router does

The Application Router (`@sap/approuter`) is a Node.js reverse proxy that sits in front of both the SAPUI5 app and the CAP backend. It serves as the single entry point for the browser, handling:

- **Static file serving** — serves the SAPUI5 app from `app/router/` (or a CDN in production)
- **Request routing** — forwards API calls matching `^/(.*)$` to the backend destination `srv-api`
- **Authentication** — enforces XSUAA login before allowing access to protected routes
- **CSRF protection** — automatically adds CSRF token validation on state-changing requests

The routing rules live in `app/router/xs-app.json`:

```json
{
  "authenticationMethod": "route",
  "routes": [
    { "source": "^/app/(.*)", "localDir": ".", "authenticationType": "xsuaa" },
    { "source": "^/user-api(.*)", "service": "sap-approuter-userapi" },
    { "source": "^/(.*)", "destination": "srv-api", "csrfProtection": true, "authenticationType": "xsuaa" }
  ]
}
```

The `destination` named `srv-api` is defined in `mta.yaml` — it points to the URL of the deployed CAP service. During local development, `default-env.json` (or `cds bind`) provides the equivalent environment variables so the router can find the backend.

## Exercise 4.1 — Generate the Fiori Elements UI

👉 Perform all the steps in the tutorial: [Create a User Interface with CAP (SAP HANA Cloud)](https://developers.sap.com/tutorials/hana-cloud-cap-create-ui.html)

> **What the tutorial covers:** You will use the Fiori Application Generator wizard in BAS to create a List Report app targeting `CatalogService`. The wizard reads your CAP service's `$metadata` and generates `manifest.json` and `annotations.cds` automatically.
>
> **Where the generated files land:** All UI artifacts are placed under `app/interaction_items/`. The annotations file (`annotations.cds`) is what you will edit to change which fields appear in the list and object pages. Do not edit `manifest.json` routing targets by hand — use the Fiori tools page map instead.

## Exercise 4.2 — Add and Configure the Application Router

The Application Router is a separate Node.js module that must be added to your project and wired to the CAP service via a named destination.

👉 Follow the app router setup steps in the tutorial above to add `app/router/package.json`, `app/router/xs-app.json`, and the corresponding `mta.yaml` entries.

> **Why a separate module?** The Application Router runs as its own MTA module in BTP. This gives it an independent scaling policy and keeps the authentication/routing logic decoupled from the business logic in the CAP service module.
>
> **The `srv-api` destination:** `mta.yaml` defines a `provides` block named `srv-api` in the CAP service module. The Application Router module consumes it via a `requires` entry. BTP resolves this at deployment time and injects the correct backend URL into the router's environment — no hard-coded URLs needed.

## Summary

At the end of this exercise you have:

- An SAPUI5 Fiori Elements List Report app (`app/interaction_items/`) driven entirely by CDS UI annotations
- A `manifest.json` connecting the app to `/odata/v4/catalog/` and defining three navigation targets (list, header object page, items object page)
- An Application Router (`app/router/`) that serves the UI and proxies API calls to the CAP service via the `srv-api` destination
- A `default-env.json` (or `cds bind` equivalent) that lets you test the full stack locally without deploying to BTP

### Questions for Discussion

1. We added an [Application Router](https://www.npmjs.com/package/@sap/approuter) to the project. What is it, and why is it needed?

   <details><summary>Answer</summary>

   The Application Router (`@sap/approuter`) is a Node.js reverse proxy that acts as the **single entry point** for the browser. In the MTA architecture, the browser never talks directly to the CAP service — it always goes through the router.

   The router handles three responsibilities that would otherwise have to be duplicated in every backend service:

   1. **Authentication** — it redirects unauthenticated users to the XSUAA login page and validates JWT tokens on every request, so the CAP service only ever sees authenticated traffic.
   2. **Request routing** — rules in `xs-app.json` map URL patterns to destinations. The catch-all rule `"source": "^/(.*)"` with `"destination": "srv-api"` forwards all OData calls to the CAP service; the `/app/` rule serves the static SAPUI5 files locally.
   3. **CSRF protection** — the `"csrfProtection": true` flag on the backend route means the router enforces CSRF token exchange for state-changing OData operations, protecting against cross-site request forgery without any code in the CAP service.

   Without the router, every BTP microservice would need to implement its own OAuth2 flow — the router centralises that complexity in one place.

   </details>

1. Why does `default-env.json` work for local development? What role does [@sap/xsenv](https://www.npmjs.com/package/@sap/xsenv) play, and how does `cds bind` [avoid the need for it](https://cap.cloud.sap/docs/advanced/hybrid-testing#bind-to-cloud-services)?

   <details><summary>Answer</summary>

   When a BTP application runs in the cloud, service credentials (HANA, XSUAA, etc.) are injected automatically as the `VCAP_SERVICES` environment variable. `@sap/xsenv` is a utility library that reads `VCAP_SERVICES` and makes those credentials accessible in a structured way — both `@sap/approuter` and CAP use it internally.

   During **local development**, there is no BTP runtime to inject `VCAP_SERVICES`. `default-env.json` is a local substitute: place your service credentials in that file and `@sap/xsenv` reads it as if it were `VCAP_SERVICES`. This is why the app can authenticate against a real HANA Cloud instance from your laptop.

   **`cds bind` is a cleaner alternative.** Running `cds bind --to <service-instance-name>` stores a reference to the live BTP service binding in a `.cdsrc-private.json` file (never committed to git). When you start the CAP server locally, it resolves those bindings on the fly — no credential file to manage, no risk of committing secrets, and the bindings stay in sync with BTP automatically.

   </details>

1. What is the difference between a standalone and a managed Application Router, and when would you use each?

   <details><summary>Answer</summary>

   | | Standalone | Managed |
   |---|---|---|
   | **Ownership** | You deploy and maintain `@sap/approuter` as your own MTA module | SAP runs it as a BTP service — you configure it, SAP operates it |
   | **Configuration** | Full control via `xs-app.json`, custom middleware, npm scripts | Configuration via the HTML5 App Repository service; limited extensibility |
   | **Updates** | You control when the `@sap/approuter` npm version is bumped | SAP keeps it current automatically |
   | **Use case** | Custom authentication flows, non-standard routing, on-premise destinations, complex middleware requirements | Standard Fiori launchpad scenarios on BTP where ease of operation matters more than customisation |

   In this CodeJam we use the **standalone** router because it makes the routing configuration explicit and visible in `xs-app.json`, which is the best way to understand how the pieces connect. In production SAP BTP projects, the managed router is more common for standard Fiori apps because it reduces operational overhead.

   </details>

1. What is CAP hybrid testing (`cds bind`), and why does it matter for developers?

   <details><summary>Answer</summary>

   **Hybrid testing** means running the CAP server locally while connecting to real BTP cloud services (HANA Cloud, XSUAA, etc.) instead of local mocks. This is the recommended development workflow because:

   - **Catches real integration issues early** — local SQLite behaves differently from HANA (data types, case sensitivity, stored procedures). Running against the real HANA instance means issues surface during development, not at deployment.
   - **No credential files to manage** — `cds bind` stores a pointer to the BTP service instance, not the credentials themselves. The CAP runtime fetches a short-lived token at startup.
   - **Fast iteration** — you still get hot-reload (`cds watch`) but against production-grade data and auth, without having to build and deploy an MTA every time.

   The workflow is:
   ```bash
   cds bind --to MyHANAApp-db        # bind to the HDI container service instance
   cds bind --to MyHANAApp-xsuaa     # bind to the XSUAA service instance
   cds watch --profile hybrid         # start server using the live bindings
   ```

   </details>

## Further Study

- [@sap/approuter on npm](https://www.npmjs.com/package/@sap/approuter) — full `xs-app.json` configuration reference
- [@sap/xsenv on npm](https://www.npmjs.com/package/@sap/xsenv) — how service bindings are resolved from `VCAP_SERVICES` and `default-env.json`
- [CAP Hybrid Testing](https://cap.cloud.sap/docs/advanced/hybrid-testing) — `cds bind` and the `--profile hybrid` workflow
- [Fiori Elements Feature Showcase App](https://ui5.sap.com/test-resources/sap/fe/core/fpmExplorer/index.html#/buildingBlocks/buildingBlockOverview) — interactive explorer for all Fiori Elements building blocks and annotations
- [UI Annotations in CAP](https://cap.cloud.sap/docs/advanced/fiori#fiori-annotations) — how to write `UI.LineItem`, `UI.Facets`, and other annotations in CDS
- [MTA Deployment Descriptor Reference](https://help.sap.com/docs/btp/sap-business-technology-platform/multitarget-application-descriptor-format) — how `provides`/`requires` destinations work in `mta.yaml`

## Next

Continue to 👉 [Exercise 5 - Add User Authentication to Your Application (SAP HANA Cloud)](../ex5/README.md)
