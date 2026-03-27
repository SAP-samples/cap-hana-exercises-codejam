# Exercise 7 - Create HANA Stored Procedure and Expose as CAP Service Function (SAP HANA Cloud)

In this exercise you will create a native SAP HANA stored procedure and wire it into your CAP application as a callable service function — without exposing it as an OData entity set.

Perform all the steps in 👉 [tutorial: Create HANA Stored Procedure and Expose as CAP Service Function (SAP HANA Cloud)](https://developers.sap.com/tutorials/hana-cloud-cap-stored-proc.html)

## Background

### Stored procedures vs. entities

In Exercise 6 you exposed a Calculation View as a **read-only OData entity set** using the proxy entity pattern. A stored procedure is fundamentally different: it is a callable unit of logic with its own input/output parameters, not a tabular result set you page through with `$top` and `$skip`.

CAP models this distinction at the service definition level:

| Database artifact | CAP surface | OData surface |
|---|---|---|
| Table / Calculation View | Entity / Projection | Entity set (`GET /Interactions_Header`) |
| Stored procedure / function | CAP function or action | Function import (`GET /sleep()`) or action import (`POST /sleep`) |

### CAP functions vs. actions

CAP's OData vocabulary distinguishes two kinds of callable operations:

- **Function** — read-only, has no side effects, addressed with HTTP `GET`. Modelled with the `function` keyword in CDS.
- **Action** — may modify state, addressed with HTTP `POST`. Modelled with the `action` keyword in CDS.

The `sleep` procedure used in this exercise is declared as a function because it only reads data (the `READS SQL DATA` clause in SQLScript):

```cds
// srv/interaction_srv.cds
function sleep() returns Boolean;
```

A write-heavy procedure — one that inserts or updates rows — would be declared as an `action` instead.

### The `.hdbprocedure` artifact

Stored procedures that live inside your HDI container are defined in `.hdbprocedure` files under `db/src/`. The HDI deployer compiles these files into native HANA stored procedures during `cds deploy`.

The `sleep` procedure in this exercise looks like this:

```sql
-- db/src/sleep.hdbprocedure
PROCEDURE "sleep" ( )
   LANGUAGE SQLSCRIPT
   SQL SECURITY INVOKER
   READS SQL DATA AS
BEGIN USING SQLSCRIPT_SYNC as SyncLib;

call SyncLib:SLEEP_SECONDS(10);

END
```

Key clauses:
- `LANGUAGE SQLSCRIPT` — written in HANA's native procedural SQL dialect
- `SQL SECURITY INVOKER` — the procedure runs with the permissions of the calling user, not the procedure owner
- `READS SQL DATA` — declares the procedure as read-only (no `INSERT`/`UPDATE`/`DELETE`); required to use the `SQLSCRIPT_SYNC` library
- `USING SQLSCRIPT_SYNC as SyncLib` — imports the built-in library that provides the `SLEEP_SECONDS` procedure

### Calling the stored procedure from CAP

Unlike entity-based access (where CAP generates and executes the SQL automatically), calling a stored procedure requires a custom handler in `srv/interaction_srv.js`. The handler uses `cds.run()` with a raw `CALL` statement:

```js
// srv/interaction_srv.js
const cds = require('@sap/cds')
module.exports = cds.service.impl(function () {
    this.on('sleep', async () => {
        try {
            let dbQuery = ' Call "sleep"( )'
            let result = await cds.run(dbQuery, { })
            cds.log().info(result)
            return true
        } catch (error) {
            cds.log().error(error)
            return false
        }
    })
})
```

`cds.run()` is the CAP-managed, driver-agnostic way to execute raw SQL or stored procedure calls against the bound database. It automatically uses the correct underlying driver (`hdb`, `@sap/hana-client`, or the SQLite shim in local development) without you needing to manage a connection or import a driver module directly. This is the recommended approach — using the `hdb` module directly would couple your code to a specific HANA client version.

### Why no database redeployment is needed

When you added the Calculation View in Exercise 6, a redeployment was required because CAP had to generate and deploy a thin `.hdbview` SQL wrapper to make the view addressable by OData queries.

Functions and actions work differently. The service function declaration (`function sleep() returns Boolean`) registers the operation in the OData metadata document but does not create any new database object. The stored procedure itself was already deployed as part of the HDI artifacts in `db/src/`. CAP just needs to know it exists at the service layer — a restart of the CAP server is sufficient.

## Summary

You have now wired a native HANA stored procedure into your CAP service as an OData function import. The key takeaways are:

- Stored procedures are exposed as CAP **functions** (read-only) or **actions** (stateful), not as entity sets
- The `.hdbprocedure` file in `db/src/` defines the HANA-side logic; the CDS `function` declaration defines the service-side signature
- `cds.run()` provides a driver-agnostic way to call the procedure from the Node.js handler — no direct `hdb` import needed
- No database redeployment is required when adding a function or action, only a server restart

### Questions for Discussion

1. What's [`SQLSCRIPT_SYNC`](https://help.sap.com/docs/HANA_CLOUD_DATABASE/d1cb63c8dd8e4c35a0f18aef632687f0/31321d64e34e4a808fb448e6fa312c03.html)?

   <details><summary>Answer</summary>

   `SQLSCRIPT_SYNC` is a built-in SQLScript library that provides `SLEEP_SECONDS` and `WAKEUP_CONNECTION` procedures. Its purpose is to introduce a controlled pause inside a procedure without "busy waiting" (spinning a loop and consuming CPU doing nothing useful). Importing it with `USING SQLSCRIPT_SYNC AS SyncLib` and calling `SyncLib:SLEEP_SECONDS(10)` makes the procedure pause for 10 seconds before returning.

   </details>

1. Why did we have to redeploy to the HANA database after adding the Calculation View in Exercise 6 but didn't need to after adding the Stored Procedure here?

   <details><summary>Answer</summary>

   The Calculation View proxy entity required CAP to generate and deploy a thin `.hdbview` SQL wrapper into the HDI container so that OData queries could reach the underlying Calculation View. That wrapper is a new database object — it requires a `cds deploy` to create it.

   The stored procedure, by contrast, is already present in the HDI container from the initial `db/src/` deployment. Declaring it as a CAP function adds an entry to the OData metadata document and registers a handler, but creates nothing new in the database. Restarting the CAP server is enough.

   </details>

1. What's the difference between a [function and an action](https://cap.cloud.sap/docs/guides/providing-services#actions-vs-functions)?

   <details><summary>Answer</summary>

   Both are callable OData operations, but:

   - **Function** — read-only, no side effects, called with HTTP `GET`. Declared with the `function` keyword in CDS.
   - **Action** — may modify state (insert, update, delete), called with HTTP `POST`. Declared with the `action` keyword in CDS.

   The `sleep` procedure is a function because the underlying SQLScript uses `READS SQL DATA` — it only reads, never writes.

   </details>

1. Why did we use `cds.run()` instead of the `hdb` module directly to call the stored procedure?

   <details><summary>Answer</summary>

   `cds.run()` is driver-agnostic: CAP selects the correct underlying database driver (`hdb`, `@sap/hana-client`, or the SQLite shim) at runtime based on the bound service. Your handler code stays identical regardless of which driver is configured.

   Using `hdb` directly would hard-code a dependency on a specific client, require you to manage the connection lifecycle manually, and break in environments (such as local SQLite development) where `hdb` is not available. See [CAP: Driver-agnostic results for stored procedures](https://cap.cloud.sap/docs/releases/archive/2022/mar22#driver-agnostic-results-for-stored-procedures) for more detail.

   </details>

1. Try changing the `sleep` CDS declaration from `function` to `action`. What changes in the OData metadata document, and what HTTP method would you use to call it?

   <details><summary>Answer</summary>

   In the OData `$metadata` document:
   - Before: `sleep` appears as a `<FunctionImport>` element
   - After: `sleep` appears as an `<ActionImport>` element

   The HTTP method changes from `GET` to `POST`. Calling `GET /odata/v4/catalog/sleep()` after the change will return an error — the runtime now expects `POST /odata/v4/catalog/sleep`.

   The underlying `sleep.hdbprocedure` does not need to change — `READS SQL DATA` is a database-level declaration about side effects, not an HTTP-level one. The CAP service definition is the only file to update.

   Use `function` (GET) for read-only operations with no side effects. Use `action` (POST) for operations that modify data, trigger a process, or have observable side effects — for example, a procedure that inserts an audit log entry or sends a notification.

   </details>

1. The `sleep` procedure uses `SQL SECURITY INVOKER`. What is the difference between `SQL SECURITY INVOKER` and `SQL SECURITY DEFINER`, and why does it matter?

   <details><summary>Answer</summary>

   - **`SQL SECURITY INVOKER`** — the procedure runs with the permissions of the *calling* user. If the caller cannot read a table, the procedure cannot read it either.
   - **`SQL SECURITY DEFINER`** — the procedure runs with the permissions of the procedure *owner* (typically the HDI container's technical user / schema owner), regardless of who calls it.

   For the `sleep` procedure, `INVOKER` is appropriate: the procedure only calls a library function and reads no business data, so there is no reason to elevate the caller's privileges.

   `DEFINER` is used when a procedure legitimately needs to access objects the calling user cannot reach directly — for example, a reporting procedure that aggregates data from a restricted audit table. However, `DEFINER` introduces a privilege escalation risk: a caller can do things through the procedure that they could not do directly. SAP recommends defaulting to `INVOKER` and only switching to `DEFINER` when there is a clear, justified need.

   </details>

## Further Study

- [CAP - Using Native SAP HANA Artifacts](https://cap.cloud.sap/docs/advanced/hana) — proxy entities, user-defined functions, and stored procedures in CAP
- [CAP - Actions and Functions](https://cap.cloud.sap/docs/guides/providing-services#actions-and-functions) — how to define and implement OData operations
- [SAP HANA Cloud SQLScript Reference](https://help.sap.com/docs/HANA_CLOUD_DATABASE/d1cb63c8dd8e4c35a0f18aef632687f0/28f2d64d4fab4e789ee0070be418419d.html) — full SQLScript language reference
- [SQLSCRIPT_SYNC library](https://help.sap.com/docs/HANA_CLOUD_DATABASE/d1cb63c8dd8e4c35a0f18aef632687f0/31321d64e34e4a808fb448e6fa312c03.html) — `SLEEP_SECONDS` and `WAKEUP_CONNECTION` reference
- [SAP Tech Bytes: HANA Client Tools for JavaScript (Part 4)](https://blogs.sap.com/2022/04/07/sap-tech-bytes-hana-client-tools-for-javascript-developers-part-4-xsjs-and-cap/) — comparison of `hdb`, `@sap/hana-client`, and CAP-managed database access

## Next

Continue to 👉 [Exercise 8 - Deploy CAP with SAP HANA Cloud project as MTA](../ex8/README.md)
