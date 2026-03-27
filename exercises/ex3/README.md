# Exercise 3 - Create Database Artifacts Using Core Data Services (CDS) for SAP HANA Cloud

In this exercise you will define a CDS data model, deploy it to SAP HANA Cloud via HDI, and load initial data using the SAP HANA Database Explorer. By the end you will have live database tables backed by HANA and a CAP service exposing them as OData endpoints.

## Background

### What CDS does for your database

In a standard CAP project you never write raw DDL (`CREATE TABLE …`). Instead, you describe your data model in **CDS (Core Data Services)** — a high-level, domain-focused language — and CAP compiles it into the correct HANA artifacts automatically.

When you run `cds build --production`, CAP translates each CDS entity into an `.hdbtable` or `.hdbview` file inside `db/src/gen/`. The **HDI deployer** (`@sap/hdi-deploy`) then pushes those artifacts into an isolated HDI container in your HANA Cloud instance. The container owns the schema, manages versioned deployments, and ensures each project's objects are fully isolated from one another.

### The data model in this project

The solution app defines two entities in `db/interactions.cds`:

```cds
context app.interactions {
    entity Headers : cuid, managed {
        items   : Composition of many Items on items.interaction = $self;
        partner : BusinessKey;
        country : Country;
    };

    entity Items : cuid {
        interaction : Association to Headers;
        text        : localized Text;
        date        : DateTime;
        price       : Price;
        currency    : Currency;
    };
}
```

- **`cuid`** — a CDS aspect that adds a UUID primary key (`ID`) automatically.
- **`managed`** — a CDS aspect that adds `createdAt`, `createdBy`, `modifiedAt`, `modifiedBy` audit fields automatically.
- **`Composition`** — `Headers` owns `Items`; deleting a header cascades to its items.
- **`Association`** — `Items` holds a back-reference to its parent `Headers` row.
- **`Country` / `Currency`** — reused from `@sap/cds/common`, giving you standardized code-list associations without defining them yourself.

### The service layer

`srv/interaction_srv.cds` exposes projections from the data model as a single OData V4 service named `CatalogService`. CAP generates the OData metadata document, all CRUD operations, and the `$expand` / `$filter` / `$orderby` query options from the CDS definition alone — no hand-written SQL or route handlers are needed for basic CRUD.

## Exercise 3.1 — Define the CDS Model and Deploy to HANA

👉 Perform all the steps in the tutorial: [Create Database Artifacts Using Core Data Services (CDS) for SAP HANA Cloud](https://developers.sap.com/tutorials/hana-cloud-cap-create-database-cds.html)

> **What the tutorial covers:** You will create the `db/interactions.cds` data model, add the service projection in `srv/interaction_srv.cds`, run `cds build --production` to generate the HDI artifacts, and then deploy them into your HANA Cloud instance using the MTA build and deploy tools in BAS.
>
> **Where the generated files go:** After `cds build --production`, look inside `db/src/gen/` — you will find `.hdbtable` files for each entity and `.hdbview` files for any CDS views. These are the HANA-native artifacts that HDI manages. You do not edit these files directly; they are regenerated every time you build.

## Exercise 3.2 — Load Data Using the SAP HANA Database Explorer

Once the tables exist in HANA, use the Database Explorer to import sample data.

👉 Follow the data-import steps in the tutorial above. Use the **Import Data** wizard in the Database Explorer to upload the provided CSV files into `APP_INTERACTIONS_HEADERS` and `APP_INTERACTIONS_ITEMS`.

> **Why the Database Explorer?** The Database Explorer connects directly to your HANA Cloud instance and lets you browse schemas, run SQL, inspect HDI containers, and import data — all without leaving the browser. It is the primary tool for ad-hoc database work during development.
>
> **Naming convention:** CAP maps the CDS context `app.interactions` and entity `Headers` to the HANA table name `APP_INTERACTIONS_HEADERS`. The dot-separator becomes an underscore and everything is uppercased. Keep this mapping in mind when writing raw SQL queries against your HDI schema.

## Summary

At the end of this exercise you have:

- A CDS data model (`db/interactions.cds`) with two related entities using `cuid`, `managed`, `Composition`, and `Association`
- A CAP service (`srv/interaction_srv.cds`) exposing the entities as an OData V4 `CatalogService`
- HANA tables deployed into your HDI container via the MTA build and deploy pipeline
- Sample data loaded into those tables via the SAP HANA Database Explorer

### Questions for Discussion

1. We loaded data using the Database Explorer import wizard. Are there [alternatives](https://cap.cloud.sap/docs/guides/databases#providing-initial-data) for getting initial data into CAP tables?

   <details><summary>Answer</summary>

   Yes — the most common CAP-native approach is to place CSV files in the `db/data/` folder. Name each file after the entity it targets using the fully qualified namespace, for example:

   ```text
   db/data/app.interactions-Headers.csv
   db/data/app.interactions-Items.csv
   ```

   CAP detects these files automatically and loads them during `cds deploy` (local SQLite) or as part of an HDI deployment. For HANA targets the data is seeded using `.hdbtabledata` artifacts that CAP generates from the CSV files.

   SAP Build Code also has an AI-assisted CSV generator that can create realistic sample data from your CDS model in seconds.

   **When to use HANA Table Import (Database Explorer) instead of CSV files:**
   - **Large data sets** — HDI table import streams data directly; CSV files via CAP load everything in memory first.
   - **External sources** — you can import from spreadsheets, other database tables, or custom formats.
   - **Incremental loads** — import only new or changed rows without a full redeployment.
   - **Data transformations** — apply column mappings or default values during import.

   The CSV-in-project approach wins for reproducibility: the data travels with the code and is automatically available in every developer environment and CI pipeline.

   </details>

1. Where does `Country` come from in `interactions.cds`? [Hint](https://cap.cloud.sap/docs/guides/reuse-and-compose)

   <details><summary>Answer</summary>

   At the top of `db/interactions.cds` you will find:

   ```cds
   using {
       Country,
       Currency,
       cuid,
       managed
   } from '@sap/cds/common';
   ```

   `@sap/cds/common` is a built-in CDS library (part of the `@sap/cds` package) that ships a set of pre-built aspects, types, and code-list entities used across nearly every SAP business application:

   | Name | What it provides |
   | --- | --- |
   | `cuid` | A `key ID : UUID` field, auto-generated by CAP |
   | `managed` | `createdAt`, `createdBy`, `modifiedAt`, `modifiedBy` audit fields |
   | `Country` | An association to `sap.common.Countries` (ISO 3166 alpha-2 codes) |
   | `Currency` | An association to `sap.common.Currencies` (ISO 4217 codes) |
   | `Language` | An association to `sap.common.Languages` (BCP 47 tags) |

   The companion package `@sap/cds-common-content` seeds the `Countries`, `Currencies`, and `Languages` code-list tables with their standard values at deployment time.

   By reusing these common definitions you get consistent field names and structures across all CAP projects, and tools like Fiori Elements can automatically render country/currency pickers and locale-aware labels.

   </details>

1. What is the difference between [Composition](https://cap.cloud.sap/docs/guides/domain-modeling#_5-add-compositions) and [Association](https://cap.cloud.sap/docs/guides/domain-modeling#associations)?

   <details><summary>Answer</summary>

   Both model relationships between entities, but they differ in **ownership** and **lifecycle**:

   **Composition** — the child cannot exist without the parent.

   In `db/interactions.cds`, `Headers` owns `Items`:

   ```cds
   entity Headers : cuid, managed {
       items : Composition of many Items on items.interaction = $self;
       ...
   };
   ```

   - Deleting a `Headers` row automatically deletes all its `Items` (cascading delete).
   - CAP's deep-insert and deep-update APIs let you create a header and all its items in a single OData request.
   - OData draft mode (enabled on `Interactions_Header` in `interaction_srv.cds`) requires a Composition root — it cannot be applied to a standalone Association.

   **Association** — the related entity can exist independently.

   `Items` holds a back-reference to its parent via an Association:

   ```cds
   entity Items : cuid {
       interaction : Association to Headers;
       ...
   };
   ```

   - Deleting an `Items` row does not affect `Headers`.
   - Associations map to foreign-key columns in HANA (here: `INTERACTION_ID`).
   - Use Associations when modelling relationships between independently-managed entities, for example linking an order to a product catalogue entry.

   **Rule of thumb:** if the child's existence is meaningless without the parent (like order line items), use Composition. If both sides can live and be managed independently, use Association.

   </details>

1. In `interaction_srv.cds`, how do you know that CAP is creating an OData service?

   <details><summary>Answer</summary>

   The `service` keyword in CDS always produces an OData service in CAP — it is the default protocol. No extra annotation is needed to opt in to OData; you would need an explicit annotation to opt out.

   Looking at the solution's `srv/interaction_srv.cds`:

   ```cds
   service CatalogService {

       @requires           : 'authenticated-user'
       @cds.redirection.target
       @odata.draft.enabled: true
       entity Interactions_Header as projection on interactions.Headers;

       @requires: 'Admin'
       entity Interactions_Items  as projection on interactions.Items;

       @readonly
       entity Languages           as projection on sap.common.Languages;

       function sleep() returns Boolean;
   }
   ```

   Several signals confirm this is an OData V4 service:

   - **`service CatalogService { … }`** — CAP compiles this into an OData service descriptor and registers it at `/catalog/` (by convention, lowercase service name without "Service").
   - **`@odata.draft.enabled: true`** — activates the OData Draft protocol (specific to OData V4) on `Interactions_Header`.
   - **`function sleep() returns Boolean`** — CDS `function` maps to an OData **Function Import** (a GET-based action in OData terminology).
   - **`@readonly`** — restricts the OData capabilities to `GET` only (no `POST`/`PATCH`/`DELETE`).

   When you run the CAP server, you can confirm the service is live by navigating to `$metadata` (e.g. `http://localhost:4004/catalog/$metadata`) — this is the OData service document that describes every entity set, property, and function.

   </details>

1. What is a CDS aspect, and why are `cuid` and `managed` used here instead of defining the fields manually?

   <details><summary>Answer</summary>

   A **CDS aspect** is a named, reusable fragment of a CDS definition — similar to a mixin or trait in other languages. You apply it to an entity with `:` syntax:

   ```cds
   entity Headers : cuid, managed { … }
   ```

   This is exactly equivalent to writing:

   ```cds
   entity Headers {
       key ID        : UUID;
       createdAt     : Timestamp @cds.on.insert : $now;
       createdBy     : String(255) @cds.on.insert : $user;
       modifiedAt    : Timestamp @cds.on.insert : $now  @cds.on.update : $now;
       modifiedBy    : String(255) @cds.on.insert : $user @cds.on.update : $user;
       …
   }
   ```

   The `@cds.on.insert` and `@cds.on.update` annotations tell the CAP runtime to populate those fields automatically — you never set `createdAt` or `modifiedBy` manually. CAP handles it for every `INSERT` and `UPDATE` operation, regardless of whether the request comes via OData, a CAP handler, or the `cds.run()` API.

   Using `cuid` and `managed` means:
   - Every entity in the project gets a consistent, UUID-based primary key — no accidental integer keys or composite keys.
   - Audit fields are guaranteed to be present and correctly populated without any custom handler code.
   - Fiori Elements can automatically detect and display the audit fields in the object page.

   </details>

1. After running `cds build --production`, look inside `db/src/gen/`. What files were generated, and how do they correspond to the CDS entities you defined?

   <details><summary>Answer</summary>

   Inside `db/src/gen/` you will find files like:

   ```text
   APP_INTERACTIONS_HEADERS.hdbtable
   APP_INTERACTIONS_ITEMS.hdbtable
   ```

   Each `.hdbtable` file is an HDI table artifact containing the SQL `CREATE TABLE` DDL that HANA will execute when the HDI deployer runs. CAP derives the filename from the CDS entity's fully-qualified name: the context prefix `app.interactions` becomes `APP_INTERACTIONS_`, and the entity name `Headers` becomes `HEADERS`, all uppercased.

   If your CDS model includes views (e.g. projections with computed fields), CAP generates `.hdbview` files for those instead. These generated files are the bridge between your high-level CDS definitions and the HANA-native artifacts that `@sap/hdi-deploy` pushes into the database. Never edit them directly — regenerate them by re-running `cds build --production`.

   </details>

1. What would happen if you ran `cds build` without the `--production` flag? Why does HANA deployment require it?

   <details><summary>Answer</summary>

   Without `--production`, `cds build` generates artifacts for the default local database — SQLite. It produces a `gen/srv/` folder containing the CAP Node.js runtime bundle but does **not** generate the `.hdbtable`/`.hdbview` files in `db/src/gen/` that `@sap/hdi-deploy` needs.

   The `--production` flag activates the HANA build profile, which tells CAP to generate HDI-compatible artifacts instead of SQLite-compatible ones. Forgetting the flag is one of the most common deployment mistakes: the `mbt build` command succeeds, the `.mtar` archive is created, `cf deploy` runs — but the db-deployer finds nothing to push into HANA and the deployment either fails or leaves the database schema unchanged.

   </details>

## Further Study

- [Video Version of this Tutorial](https://youtu.be/hlHY7eBriRA)
- [SAP HANA Database Explorer](https://help.sap.com/docs/HANA_CLOUD/a2cea64fa3ac4f90a52405d07600047b/7fa981c8f1b44196b243faeb4afb5793.html?locale=en-US)
- [Domain Modeling with CDS](https://cap.cloud.sap/docs/guides/domain-modeling)
- [CDS Built-in Types and Aspects (`@sap/cds/common`)](https://cap.cloud.sap/docs/cds/common)
- [Generated HDI Artifacts](https://cap.cloud.sap/docs/guides/databases-hana#generated-hdi-artifacts)
- [Providing Initial Data (CSV files in CAP)](https://cap.cloud.sap/docs/guides/databases#providing-initial-data)
- [CDS Compositions and Associations](https://cap.cloud.sap/docs/cds/cdl#associations)

## Next

Continue to 👉 [Exercise 4 - Create a User Interface with CAP (SAP HANA Cloud)](../ex4/README.md)
