# MyHANAApp — CAP + SAP HANA Cloud Reference Solution

This is the reference solution for the SAP CodeJam workshop on building full-stack applications with **SAP Cloud Application Programming Model (CAP)** and **SAP HANA Cloud**. Every concept introduced in the exercises is demonstrated here in working, deployable code.

Read this document to understand the architecture, the data flow from the database to the browser, how authentication is enforced end-to-end, and how to run, extend, and deploy the application.

---

## Table of Contents

1. [What the Application Does](#1-what-the-application-does)
2. [Architecture Overview](#2-architecture-overview)
3. [Project Structure](#3-project-structure)
4. [The Data Model — `db/`](#4-the-data-model--db)
5. [The Service Layer — `srv/`](#5-the-service-layer--srv)
6. [The UI Layer — `app/`](#6-the-ui-layer--app)
7. [Authentication and Authorization](#7-authentication-and-authorization)
8. [The AppRouter — `app/router/`](#8-the-approuter--approuter)
9. [How a Request Travels End-to-End](#9-how-a-request-travels-end-to-end)
10. [HANA-Native Artifacts — `db/src/`](#10-hana-native-artifacts--dbsrc)
11. [Development Profiles: Local, Hybrid, Deployed](#11-development-profiles-local-hybrid-deployed)
12. [Running the Application](#12-running-the-application)
13. [Deploying to SAP BTP Cloud Foundry](#13-deploying-to-sap-btp-cloud-foundry)
14. [Key Configuration Files Explained](#14-key-configuration-files-explained)
15. [Dependency Map](#15-dependency-map)

---

## 1. What the Application Does

The application manages **Interaction records** — a simple business object that pairs a partner (a short business key) with a country, and attaches one or more line items to each record. Each line item carries a text description (in multiple languages), a date, and a price in a chosen currency.

This is intentionally a straightforward domain so that the workshop focus stays on the infrastructure: CAP, HANA Cloud, OData V4, Fiori Elements, XSUAA authentication, and HDI deployment — not on business logic complexity.

**End-to-end data path:**

```text
SAP HANA Cloud HDI Container
  │  (tables: app_interactions_Headers, app_interactions_Items, etc.)
  │
  ▼
CAP Node.js service  (OData V4 at /odata/v4/catalog/)
  │
  ▼
SAP AppRouter        (XSUAA authentication, token forwarding)
  │
  ▼
SAP Fiori Elements UI  (List Report → Object Page → Item Object Page)
```

---

## 2. Architecture Overview

```text
┌────────────────────────────────────────────────────────────────────┐
│  Browser                                                           │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  SAP Fiori Elements (SAPUI5 sap.fe.templates)               │  │
│  │  app/interaction_items/webapp/                              │  │
│  └───────────────────┬─────────────────────────────────────────┘  │
└──────────────────────│─────────────────────────────────────────────┘
                       │ HTTP (OData V4)
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│  SAP AppRouter  (app/router/)                                    │
│  • Handles XSUAA OAuth2 PKCE login flow                         │
│  • Validates JWT on every request                               │
│  • Routes /odata/v4/* → destination srv-api                     │
│  • Serves static UI files from /interaction_items/*             │
└──────────────────────┬───────────────────────────────────────────┘
                       │ HTTP + JWT (forwarded)
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│  CAP Node.js Service  (srv/)                                     │
│  • Verifies JWT with XSUAA public key                           │
│  • Enforces @requires annotations (role checks)                 │
│  • Translates OData V4 queries → SQL                            │
│  • Handles draft lifecycle (Interactions_Header)                │
│  • Calls HANA stored procedure for the sleep() function         │
└──────────────────────┬───────────────────────────────────────────┘
                       │ SQL / HDI APIs
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│  SAP HANA Cloud HDI Container  (db/)                            │
│  • Tables: Headers, Items, drafts, localization texts           │
│  • Calculation view: V_INTERACTION                              │
│  • Stored procedure: sleep                                      │
└──────────────────────────────────────────────────────────────────┘
```

### Key design principle

CAP acts as the **translation layer** between the high-level CDS model and the low-level database. You write entity definitions and service projections in CDS; CAP compiles these to HANA DDL and SQL at build time, and translates OData queries to SQL at runtime. You rarely write SQL by hand.

---

## 3. Project Structure

```text
MyHANAApp/
│
├── db/                          ← Data layer
│   ├── interactions.cds         ← CDS entity definitions (the schema)
│   ├── undeploy.json            ← HDI artifacts to drop on re-deploy
│   └── src/                     ← HANA-native HDI artifacts
│       ├── .hdiconfig           ← Maps file extensions to HDI plugins
│       ├── V_INTERACTION.hdbcalculationview  ← Graphical calc view
│       └── sleep.hdbprocedure   ← Native HANA stored procedure
│
├── srv/                         ← Service layer
│   ├── interaction_srv.cds      ← Service definition + authorization
│   └── interaction_srv.js       ← Service handler (sleep function wiring)
│
├── app/                         ← UI layer
│   ├── services.cds             ← Pulls in UI annotations
│   ├── interaction_items/       ← Fiori Elements application
│   │   ├── annotations.cds      ← All UI metadata (columns, filters, etc.)
│   │   └── webapp/              ← SAPUI5 app (manifest, Component.js, i18n)
│   └── router/                  ← SAP AppRouter
│       ├── xs-app.json          ← Routing rules and authentication config
│       └── package.json         ← AppRouter npm module
│
├── mta.yaml                     ← Multi-Target Application deployment descriptor
├── xs-security.json             ← XSUAA security descriptor (scopes, roles)
├── package.json                 ← NPM metadata + CDS configuration
├── eslint.config.mjs            ← ESLint config (@sap/cds recommended)
└── .cdsrc-private.json          ← Local hybrid profile bindings (git-ignored)
```

---

## 4. The Data Model — `db/`

### `db/interactions.cds`

This file defines the core entities using CDS (Core Data Services), the domain-specific language at the heart of CAP.

```cds
context app.interactions {
    entity Headers : cuid, managed {
        items   : Composition of many Items on items.interaction = $self;
        partner : BusinessKey;     // String(10)
        country : Country;         // from @sap/cds/common
    };

    entity Items : cuid {
        interaction : Association to Headers;
        text        : localized Text;   // String(1024), multi-language
        date        : DateTime;
        price       : Price;            // Decimal(10,2)
        currency    : Currency;         // from @sap/cds/common
    };
}
```

#### Things worth understanding here

**`cuid`** — a CAP-provided aspect (a reusable mixin) that adds a UUID primary key `ID : UUID`. You never have to write `key ID : UUID` yourself when you include this.

**`managed`** — another built-in aspect that adds four audit fields: `createdAt`, `createdBy`, `modifiedAt`, `modifiedBy`. CAP populates these automatically on every create and update. No application code required.

**`Composition of many Items`** — this is the parent-child relationship. A `Composition` is deeper than a simple `Association`: it declares that `Items` are *owned* by `Headers`. CAP enforces this by cascading deletes and by enabling deep insert/update (you can POST a header with its items in one request). At the database level, CAP creates a foreign key `interaction_ID` on the `Items` table.

**`localized Text`** — the `localized` keyword tells CAP to generate a companion entity `Items.texts` and a view `Items_texts`. The companion entity holds translations: each row stores a locale code and the translated value. Translatable fields are stored in the companion entity; the main entity stores the fallback value. The `@sap/cds-common-content` package provides translations for the standard `Country` and `Currency` code lists.

**`Country` and `Currency`** — these are not plain strings. They are `Association to sap.common.Countries` and `Association to sap.common.Currencies` respectively, defined in `@sap/cds/common`. This means `country` carries a `country_code` foreign key column and navigates to a rich `Countries` entity with names, descriptions, and ISO codes. CAP resolves the join automatically when the UI requests `country.descr`.

#### What CAP generates from this model

When you run `cds build --production` or `cds deploy`, CAP compiles these CDS entities to:

- HANA table definitions (`.hdbtable` files in `gen/db/src/gen/`)
- A HANA view for draft support (`_drafts` table and associated view)
- A HANA view for the localized texts
- The full OData V4 `$metadata` document served at runtime

You never write these artifacts by hand — they are managed outputs.

#### `V_INTERACTION` — the calculation view entity

```cds
@cds.persistence.exists
@cds.persistence.calcview
Entity V_INTERACTION { ... }
```

This is a special entity. The two annotations tell CAP:

- `@cds.persistence.exists` — do not try to create a table for this; the object already exists in the database.
- `@cds.persistence.calcview` — it is a HANA Calculation View; generate the correct metadata so OData can expose it.

The actual calculation view definition lives in [`db/src/V_INTERACTION.hdbcalculationview`](db/src/V_INTERACTION.hdbcalculationview) and is deployed by the HDI deployer. CAP bridges it into the service model so it appears as a read-only OData entity.

---

## 5. The Service Layer — `srv/`

### `srv/interaction_srv.cds` — Service Definition

```cds
service CatalogService {

    @requires: 'authenticated-user'
    @odata.draft.enabled: true
    entity Interactions_Header as projection on interactions.Headers;

    @requires: 'Admin'
    entity Interactions_Items  as projection on interactions.Items;

    @readonly
    entity Languages           as projection on sap.common.Languages;

    @readonly
    @restrict: [{ grant: 'READ', where: 'country_code = ''DE''' }]
    entity HeaderView          as projection on interactions.Headers;

    function sleep() returns Boolean;

    @readonly
    entity V_Interaction       as projection on V_INTERACTION;
}
```

#### What a CAP service definition does

A CAP service is an OData service. Every `entity` inside `service CatalogService { }` becomes an OData entity set accessible under `/odata/v4/catalog/`. CAP handles all of the HTTP parsing, OData protocol compliance, SQL generation, and response formatting automatically.

`as projection on` means the service exposes a *view* of the underlying db entity. The service can rename fields, restrict columns, add computed fields, or add annotations — without touching the data model itself. This separation keeps concerns clean: `db/` describes *what data exists*; `srv/` describes *how it is exposed*.

#### Authorization annotations

| Annotation | What it does |
| --- | --- |
| `@requires: 'authenticated-user'` | CAP rejects any request that does not carry a valid JWT. Any logged-in user passes. |
| `@requires: 'Admin'` | CAP checks that the JWT contains the `Admin` scope (defined in `xs-security.json`). Users without that role get HTTP 403. |
| `@restrict: [{ grant: 'READ', where: ... }]` | Instance-level filter: even Admin users only see rows where `country_code = 'DE'` on `HeaderView`. CAP injects this as a `WHERE` clause into every SQL query. |

#### `@odata.draft.enabled: true`

This single annotation activates CAP's draft handling for `Interactions_Header`. Draft handling is a pattern where in-progress edits are saved to the server (in a `_drafts` shadow table) before the user explicitly saves. The Fiori Elements UI renders Edit / Save / Discard buttons automatically when it detects this annotation in the OData metadata. No JavaScript required on either side.

#### `function sleep() returns Boolean`

This is a CAP *unbound function* — it maps to an OData `FunctionImport` callable as:

```http
GET /odata/v4/catalog/sleep()
```

The function exists to demonstrate how to call a native HANA stored procedure from a CAP handler. See [`srv/interaction_srv.js`](srv/interaction_srv.js) for the implementation.

### `srv/interaction_srv.js` — Service Handler

```js
module.exports = cds.service.impl(async function () {
    const db = await cds.connect.to('db')

    this.on('sleep', async () => {
        try {
            const result = await db.run('Call "sleep"()')
            cds.log('sleep').debug(result)
            return true
        } catch (error) {
            cds.log('sleep').error(error)
            throw cds.error(error)
        }
    })
})
```

`cds.service.impl` registers this module as the implementation of the service defined in `interaction_srv.cds`. CAP matches them by file name.

`this.on('sleep', ...)` registers a handler for the `sleep` function import. When the OData call arrives, CAP invokes this handler.

`db.run('Call "sleep"()')` sends a raw SQL call to the connected database. In development (SQLite), this call would fail because the `sleep` procedure does not exist there — it is HANA-only. In production (HDI) or hybrid mode (connected to the real HANA container), CAP executes it against the live database.

`cds.error(error)` wraps the raw database error in a CAP error object, which the framework then serializes as a proper OData error response body with an HTTP 500 status. This keeps the error contract consistent with the rest of the OData API.

---

## 6. The UI Layer — `app/`

The UI is a **SAP Fiori Elements** application — a framework where the UI is generated at runtime from OData metadata and annotations rather than hand-written XML views. It provides a three-level drill-down:

1. **List Report** — filterable table of all Interaction Headers
2. **Header Object Page** — details of one Header plus its Items sub-table
3. **Item Object Page** — details of one Item including localized text translations

For full documentation of the UI layer, see [app/interaction_items/README.md](app/interaction_items/README.md).

### `app/services.cds`

```cds
using from './interaction_items/annotations';
```

This one-line file pulls the UI annotations into the CDS compilation. CAP processes `app/` as part of the overall project model, which means `annotations.cds` is compiled into the OData `$metadata` document served at runtime. The UI5 framework reads that metadata and renders the UI. This is how a change to `annotations.cds` is immediately reflected in the UI without touching any JavaScript.

---

## 7. Authentication and Authorization

This application uses **XSUAA** (SAP's OAuth2 / OpenID Connect service) for authentication. Understanding the auth flow helps enormously when debugging access issues.

### The security descriptor — `xs-security.json`

```json
{
  "xsappname": "myhanaapp00",
  "tenant-mode": "dedicated",
  "scopes": [
    { "name": "$XSAPPNAME.Admin", "description": "Admin" }
  ],
  "role-templates": [
    {
      "name": "Admin",
      "scope-references": ["$XSAPPNAME.Admin"]
    }
  ]
}
```

This file defines the authorization model of the application:

- A **scope** is the atomic unit of permission: `<appname>.Admin`.
- A **role template** packages one or more scopes under a friendly name. In SAP BTP, a Role Template becomes a **Role**, and Roles are assigned to users via **Role Collections**.
- When a user logs in, XSUAA issues a JWT that contains the scopes assigned to that user. CAP reads this JWT and checks the scopes against the `@requires` annotations on each entity.

The `$XSAPPNAME` placeholder is replaced at deploy time with the actual XSUAA instance name (set to `MyHANAApp-${org}-${space}` in `mta.yaml`), ensuring scope names are unique per deployment space.

### The full auth flow (production)

```text
1. User visits the app URL (AppRouter)
2. AppRouter has no session → redirects to XSUAA login page
3. User authenticates (username/password or SSO)
4. XSUAA issues OAuth2 authorization code
5. AppRouter exchanges code for access token (JWT) via PKCE flow
6. AppRouter stores the session, redirects user back to the app
7. Browser loads the Fiori UI; UI makes OData requests to AppRouter
8. AppRouter validates the session, adds the JWT as Authorization: Bearer header
9. Request arrives at CAP service
10. CAP (via @sap/xssec) validates JWT signature against XSUAA public keys
11. CAP extracts scopes from the JWT and checks @requires annotations
12. SQL query runs; response returns to browser
```

### Local development (mock auth)

When running `cds watch` locally without any profile, CAP uses its built-in mock authentication. Any request is treated as an authenticated user. You can simulate different users and roles by adding a `cds.requires.auth` configuration in `package.json`, or by passing `?sap-approuter-username=alice&alice.admin=true` query parameters when testing locally.

---

## 8. The AppRouter — `app/router/`

The AppRouter is SAP's standard reverse proxy for BTP applications. It handles authentication and sits in front of the CAP service. Key reasons it exists:

1. **Centralized login** — the browser never contacts XSUAA or the CAP service directly; the AppRouter mediates everything.
2. **Token forwarding** — the AppRouter adds the JWT to each proxied request so the CAP service does not need to run its own login UI.
3. **CSRF protection** — the AppRouter enforces CSRF token validation on mutating requests (POST, PUT, PATCH, DELETE).
4. **Static file serving** — it can serve the UI files directly, removing the need for a separate static host.

### `app/router/xs-app.json`

```json
{
  "authenticationMethod": "route",
  "welcomeFile": "/interaction_items/webapp/index.html",
  "routes": [
    {
      "source": "^/app/(.*)$",
      "localDir": ".",
      "authenticationType": "xsuaa"
    },
    {
      "source": "^/(.*)$",
      "destination": "srv-api",
      "csrfProtection": true,
      "authenticationType": "xsuaa"
    }
  ]
}
```

The critical route is the last one: any path that reaches the AppRouter and is not a static file is forwarded to the `srv-api` destination. `srv-api` is the name declared in `mta.yaml` under the `provides` block of the `MyHANAApp-srv` module. At runtime, MTA wires the actual URL of the running CAP service into this destination name — the AppRouter never needs to know the URL at build time.

`csrfProtection: true` means the AppRouter automatically handles the CSRF token exchange that Fiori Elements expects before any data-modifying request.

---

## 9. How a Request Travels End-to-End

Tracing one concrete scenario: a user opens the app, logs in, and saves an edited Header record.

### Step 1 — Browser loads the app

```text
GET https://<approuter-url>/interaction_items/webapp/index.html
→ AppRouter: no session → redirect to XSUAA
→ XSUAA login → JWT issued
→ AppRouter creates session cookie → returns index.html
→ SAPUI5 bootstraps; manifest.json loaded; OData model initialized
```

### Step 2 — List Report fetches data

```text
GET /odata/v4/catalog/Interactions_Header
    ?$select=ID,partner,country_code,IsActiveEntity,...
    &$orderby=partner asc
    &$count=true
→ AppRouter: validate session; add Authorization: Bearer <jwt>
→ CAP: validate JWT; check @requires 'authenticated-user' → pass
→ CAP: translate OData query → SQL SELECT
→ HANA: execute query → return rows
→ CAP: serialize to JSON OData response → 200 OK
→ Fiori Elements: render table rows
```

### Step 3 — User clicks Edit on a Header

```text
POST /odata/v4/catalog/Interactions_Header(<id>)/draftEdit
→ CAP: creates a draft copy in app_interactions_Headers_drafts table
→ Returns draft entity with IsActiveEntity=false
→ UI switches to edit mode; Save / Discard buttons appear
```

### Step 4 — User changes a field and clicks Save

```text
PATCH /odata/v4/catalog/Interactions_Header(<id>)
  Body: { "partner": "NEWNAME" }
→ CAP: updates the draft record

POST /odata/v4/catalog/Interactions_Header(<id>)/draftActivate
→ CAP: validates the draft; copies from _drafts to main table
→ Returns the activated (IsActiveEntity=true) entity
→ UI exits edit mode; table row updates
```

---

## 10. HANA-Native Artifacts — `db/src/`

Files in `db/src/` are **HDI artifacts** — objects that the HDI deployer installs directly into the HANA HDI container, bypassing CAP's CDS compilation. This is how you use HANA capabilities that have no CDS equivalent.

### `.hdiconfig` — plugin registry

This file tells the HDI deployer which HANA plugin to use for each file extension. For example:

```json
"hdbcalculationview": { "plugin_name": "com.sap.hana.di.calculationview" },
"hdbprocedure":       { "plugin_name": "com.sap.hana.di.procedure" }
```

Without this file, the HDI deployer would not know how to process `.hdbcalculationview` or `.hdbprocedure` files. The `.hdiconfig` included here registers every standard HANA artifact type so you can add any type you need in future without editing this file.

### `sleep.hdbprocedure` — Native Stored Procedure

```sql
PROCEDURE "sleep" ()
   LANGUAGE SQLSCRIPT
   SQL SECURITY INVOKER
   READS SQL DATA AS
BEGIN USING SQLSCRIPT_SYNC as SyncLib;
    call SyncLib:SLEEP_SECONDS(10);
END
```

This procedure uses the built-in `SQLSCRIPT_SYNC` library to pause execution for 10 seconds. Its purpose in the workshop is to demonstrate the pattern of calling a native HANA procedure from a CAP service handler (see `srv/interaction_srv.js`).

`SQL SECURITY INVOKER` means the procedure runs with the privileges of the calling user (the HDI container's runtime user), not the procedure's owner. This is the safer default for application procedures.

### `V_INTERACTION.hdbcalculationview` — Calculation View

Calculation views are HANA's graphical multi-dimensional analytics layer. They can join multiple tables, define measures and dimensions, apply filters, and leverage HANA's column-store parallelism for fast aggregations. The graphical editor for calculation views is only available in **SAP Business Application Studio** — it cannot be edited as plain XML in a local IDE.

This particular view joins `Headers` and `Items` so that both partner/country information and item details are visible in a single flat projection. It is exposed as a read-only `V_Interaction` entity in the CAP service.

`@cds.persistence.exists` in `db/interactions.cds` is the bridge: it tells CAP that this entity already exists in the database and should not be compiled to a CREATE TABLE statement. CAP still generates the OData metadata for it so the service can expose it.

### `db/undeploy.json`

```json
[
  "src/gen/**/*.hdbview",
  "src/gen/**/*.hdbindex",
  "src/gen/**/*.hdbconstraint",
  "src/gen/**/*_drafts.hdbtable",
  "src/gen/**/*.hdbcalculationview"
]
```

When you run `cds deploy`, CAP generates HANA DDL artifacts into `db/src/gen/`. If you later *remove* an entity from your CDS model, the old generated file disappears from `gen/`, but the HDI container still has the old database object. `undeploy.json` tells the HDI deployer to drop objects whose source files match these glob patterns and are no longer present. Without this, stale objects accumulate in the container.

Note the `*.hdbcalculationview` entry — this ensures that if CAP ever mistakenly generates a calculation view artifact, it will be cleaned up. The real calculation view (in `src/`, not `src/gen/`) is not matched by these patterns because it lives at a different path.

---

## 11. Development Profiles: Local, Hybrid, Deployed

CAP supports three development modes and it is important to know which one you are in.

### Local (SQLite)

```bash
npm start
# or
cds watch
```

CAP uses an in-memory SQLite database. There is no HANA connection. The HANA stored procedure and calculation view are not available. Draft handling works. Authentication is mocked — any request is treated as authenticated.

**When to use:** Day-to-day UI development and service logic. Very fast — no cloud connection required.

### Hybrid

```bash
npm run watch-hybrid
# or
cds watch --profile hybrid
```

CAP uses the local Node.js process but connects to a **real SAP HANA Cloud HDI container** and a **real XSUAA instance** in Cloud Foundry. The `.cdsrc-private.json` file holds the binding configuration for both services (this file is git-ignored because it contains credentials).

**When to use:** Testing HANA-specific features (calculation views, stored procedures, HANA data types) while still developing locally. Requires `npm run create-xsuaa` and `npm run deploy-hana` to have been run at least once.

### Fully deployed (MTA)

All three modules (CAP service, HDI deployer, AppRouter) run on Cloud Foundry. Build and deploy with:

```bash
npx cds build --production
mbt build
cf deploy mta_archives/MyHANAApp_1.0.0.mtar
```

See [Deploying to SAP BTP Cloud Foundry](#13-deploying-to-sap-btp-cloud-foundry) for the full sequence.

---

## 12. Running the Application

### Prerequisites

- Node.js even-numbered LTS (18, 20, 22, or 24)
- `npm ci` run from `solution/MyHANAApp/`

### Quick start (local SQLite)

```bash
cd solution/MyHANAApp
npm ci
npm start
```

Open <http://localhost:4004> for the CAP index page with links to the OData service and the UI.

### With live-reload and the Fiori UI open

```bash
npm run watch-interaction_items
```

This opens the UI automatically in the browser and reloads it when any file changes.

### Lint

```bash
npx eslint .
```

Uses `eslint.config.mjs` with `@sap/cds` recommended rules.

### Connect to real HANA and XSUAA (hybrid)

```bash
# One-time setup: create XSUAA and HANA service instances, bind locally
npm run create-xsuaa
npm run deploy-hana

# Start with hybrid profile
npm run watch-hybrid
```

---

## 13. Deploying to SAP BTP Cloud Foundry

Deployment is driven by `mta.yaml`, which describes a **Multi-Target Application (MTA)** — a bundle of Cloud Foundry modules and service instances that are deployed and configured together.

### What gets deployed

| MTA module | CF artifact | Description |
| --- | --- | --- |
| `MyHANAApp-srv` | Node.js app | The CAP service, built from `gen/srv/` |
| `MyHANAApp-db-deployer` | One-shot Node.js task | Runs the HDI deployer against the HANA container |
| `MyHANAApp` | AppRouter Node.js app | The AppRouter, sourced from `app/router/` |
| `MyHANAApp-auth` | CF managed service | XSUAA instance (from `xs-security.json`) |
| `MyHANAApp-db` | CF managed service | HANA HDI container (service: hana, plan: hdi-shared) |

### Deployment sequence

```bash
# 1. Install dependencies and build CAP artifacts
npm ci
npx cds build --production
# Generates: gen/srv/ and gen/db/

# 2. Build the MTA archive
mbt build
# Produces: mta_archives/MyHANAApp_1.0.0.mtar

# 3. Deploy to Cloud Foundry
cf login -a https://api.cf.<region>.hana.ondemand.com
cf deploy mta_archives/MyHANAApp_1.0.0.mtar
```

### What happens during deployment

1. MTA deployer creates the `MyHANAApp-auth` XSUAA service instance using `xs-security.json`.
2. MTA deployer creates the `MyHANAApp-db` HDI container.
3. `MyHANAApp-db-deployer` runs: connects to the HDI container and deploys all artifacts from `gen/db/src/` (CAP-generated tables, views, draft tables) plus `db/src/` (calculation view, stored procedure).
4. `MyHANAApp-srv` starts: binds to XSUAA and HANA, begins serving OData V4.
5. `MyHANAApp` (AppRouter) starts: receives the `srv-api` destination URL, which points to the running CAP service.

After deployment, the public URL is the AppRouter's URL. Users never see or access the CAP service URL directly.

---

## 14. Key Configuration Files Explained

### `package.json` — CDS configuration block

```json
"cds": {
  "requires": {
    "auth": "xsuaa"
  },
  "sql": {
    "native_hana_associations": false
  }
}
```

`"auth": "xsuaa"` tells CAP to use XSUAA for authentication in production. In local development without a bound XSUAA instance, CAP falls back to mock auth.

`"native_hana_associations": false` tells CAP not to generate HANA foreign-key constraints for CDS associations. This is important because some HANA HDI deployment scenarios fail with FK constraints when data is loaded in the wrong order. CAP enforces referential integrity at the application layer instead.

### `mta.yaml` — parallel deployments and readiness check

```yaml
parameters:
  enable-parallel-deployments: true
```

By default MTA deploys modules sequentially. Parallel deployment is faster but requires that modules do not have hard ordering dependencies. The CAP service and the HDI deployer can safely run in parallel because the CAP service has a readiness check (`/health`) and will not receive traffic until it is healthy.

```yaml
readiness-health-check-type: http
readiness-health-check-http-endpoint: /health
```

CAP exposes a `/health` endpoint automatically. CF waits for it to return 200 before routing traffic to the new instance, preventing users from hitting a starting instance.

### `.cdsrc-private.json` — hybrid bindings (never commit this)

This file is generated by `cds bind` and stores credentials for the Cloud Foundry service instances used in hybrid mode. It is listed in `.gitignore`. Each developer creates their own by running `npm run create-xsuaa` and `npm run deploy-hana` once against their CF space.

---

## 15. Dependency Map

Understanding which file depends on which prevents confusion when making changes.

```text
db/interactions.cds
  │  defines entities Headers, Items, V_INTERACTION
  │
  ├──► srv/interaction_srv.cds        (projects and exposes as CatalogService)
  │       │
  │       ├──► srv/interaction_srv.js  (handles sleep() function import)
  │       │
  │       └──► app/interaction_items/annotations.cds
  │                │  (annotates CatalogService entities for UI)
  │                │
  │                └──► app/services.cds  (imports annotations into CDS model)
  │
  └──► db/src/V_INTERACTION.hdbcalculationview  (HANA-native, bridges via @cds.persistence.exists)
  └──► db/src/sleep.hdbprocedure               (called by interaction_srv.js at runtime)

xs-security.json
  │  defines scopes and role-templates
  ├──► srv/interaction_srv.cds   (@requires 'Admin' checks the Admin scope)
  ├──► app/router/xs-app.json   (authenticationType: xsuaa)
  └──► mta.yaml                 (deploys XSUAA instance from this file)

app/router/xs-app.json
  │  routes all /odata/* to destination srv-api
  └──► mta.yaml                 (provides srv-api destination with CAP service URL)

app/interaction_items/webapp/manifest.json
  │  connects UI to /odata/v4/catalog/
  └──► srv/interaction_srv.cds  (CatalogService must expose Interactions_Header etc.)
```

**Cross-file consistency rule:** When changing auth, roles, routing, or deployment, the four files that must stay aligned are:

1. `xs-security.json` — scope/role definitions
2. `package.json` (cds.requires.auth) — auth kind for CAP
3. `app/router/xs-app.json` — destination name `srv-api`
4. `mta.yaml` — provides `srv-api`, references `xs-security.json`
