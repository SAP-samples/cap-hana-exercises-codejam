# Exercise 5 - Add User Authentication to Your Application (SAP HANA Cloud)

In this exercise you will define security roles, provision a real XSUAA service instance, and wire it into your CAP application so that every request is authenticated via OAuth2. By the end, the Application Router, the CAP service, and SAP BTP all agree on who is allowed to do what.

Perform all the steps in 👉 [tutorial: Add User Authentication to Your Application (SAP HANA Cloud)](https://developers.sap.com/tutorials/hana-cloud-cap-add-authentication.html)

## Background

### The three-layer auth model

When authentication is fully wired up, every request passes through three layers that each enforce a different concern:

```text
Browser → Application Router (XSUAA OAuth2 flow) → CAP service (@requires annotations) → HANA HDI container
```

| Layer | Enforces | How |
| --- | --- | --- |
| **Application Router** | User is logged in | Redirects to XSUAA login; attaches JWT to every downstream request |
| **CAP service** | User has the right role or is authenticated | `@requires: 'authenticated-user'` / `@requires: 'Admin'` in `srv/*.cds` |
| **HANA HDI** | DB-level permissions | HDI container grants are set during deployment; CAP's technical user holds them |

### What XSUAA does

XSUAA (SAP Authorization and Trust Management Service) is SAP BTP's OAuth2 authorization server. It:

1. Authenticates the user against your identity provider (IDP)
2. Issues a signed **JWT** (JSON Web Token) that lists the user's scopes
3. Validates that JWT on every API call when the CAP service or Application Router checks it

The `xs-security.json` file is what you deploy to XSUAA to tell it which scopes and role templates your application defines. For this app it looks like:

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
      "scope-references": [ "$XSAPPNAME.Admin" ]
    }
  ],
  "oauth2-configuration": {
    "redirect-uris": [ "https://*.applicationstudio.cloud.sap/**" ]
  }
}
```

The `$XSAPPNAME` macro is replaced at deploy time with the actual application name. The `redirect-uris` wildcard allows the XSUAA login callback to reach your app running inside Business Application Studio preview ports.

### How CAP consumes the XSUAA token

Once `"auth": "xsuaa"` is set in `package.json`, CAP validates the incoming JWT on every request and maps the scopes it contains to the CDS authorization annotations in your service:

```cds
// srv/interaction_srv.cds

@requires: 'authenticated-user'        // any logged-in user
entity Interactions_Header as projection on interactions.Headers;

@requires: 'Admin'                     // only users with the Admin scope
entity Interactions_Items  as projection on interactions.Items;
```

A user without the `Admin` role will receive HTTP 403 when attempting to access `Interactions_Items`, even if they are authenticated. The role collection must be assigned to the user in BTP cockpit after deployment.

### The hybrid testing flow

Because you are running the CAP server locally inside BAS but connecting to a real XSUAA instance in BTP, the authentication flow during development works like this:

1. Your browser opens the Application Router preview URL in BAS
2. The router detects no session and redirects to the XSUAA login page
3. You log in with your BTP credentials; XSUAA redirects back to the `redirect-uri` in `xs-security.json`
4. The router exchanges the authorization code for a JWT and stores it in a session cookie
5. Subsequent requests to `/odata/v4/catalog/` carry the JWT as a `Bearer` token
6. CAP validates the JWT against XSUAA's public keys and checks `@requires` annotations

This is what makes the `redirect-uris` wildcard for `*.applicationstudio.cloud.sap` necessary — without it XSUAA would reject the login callback as coming from an untrusted origin.

## Exercise Steps

👉 Perform all the steps in the tutorial linked at the top of this page.

The tutorial covers:

1. Creating the `xs-security.json` with scopes and role templates
2. Deploying a real XSUAA service instance using `cf create-service`
3. Binding the XSUAA instance so the local Application Router can use it
4. Setting `"auth": "xsuaa"` in `package.json` under `cds.requires`
5. Adding `@requires` annotations in `srv/interaction_srv.cds`
6. Testing the secured app via the Application Router preview URL in BAS
7. Assigning the `Admin` role collection to your BTP user in the BTP cockpit

## Summary

At the end of this exercise you have:

- An `xs-security.json` that defines the `Admin` scope and role template for your application
- A live XSUAA service instance bound to your project (replacing the mock auth from earlier exercises)
- CAP configured to validate real JWT tokens (`"auth": "xsuaa"` in `package.json`)
- `@requires: 'authenticated-user'` on `Interactions_Header` and `@requires: 'Admin'` on `Interactions_Items`
- A working hybrid test setup: CAP runs locally in BAS but authenticates against the real XSUAA instance

While you could use CAP's mock authentication for unit testing, this exercise goes a step further by wiring up real XSUAA so you experience the full OAuth2 flow — including JWT issuance, scope mapping, and role collection assignment — before deploying to production.

### Questions for Discussion

1. Why is the `redirect-uris` entry needed in `xs-security.json`, and why does it use a wildcard?

   <details><summary>Answer</summary>

   After a successful login, XSUAA redirects the browser back to the application with an authorization code. XSUAA will **only** redirect to URIs explicitly listed (or matched by wildcard) in `xs-security.json` — any other target is rejected as a potential open-redirect attack.

   The wildcard `https://*.applicationstudio.cloud.sap/**` is needed because each developer's BAS workspace gets a unique subdomain (e.g., `port8080-workspaces-ws-abc12.applicationstudio.cloud.sap`). Using a static URI would mean every developer would have to update `xs-security.json` with their own subdomain and redeploy the XSUAA instance. The wildcard covers all BAS preview URLs without that overhead.

   In a production deployment the wildcard is replaced with the specific application URL from your Cloud Foundry space, which removes the security risk of an overly broad redirect target.

   </details>

1. What other [authentication strategies](https://cap.cloud.sap/docs/node.js/authentication#strategies) could you use with CAP, and when would you choose each?

   <details><summary>Answer</summary>

   | Strategy | When to use |
   | --- | --- |
   | **`dummy`** | Local development only — any request is accepted as an admin user, no credentials needed |
   | **`mocked`** | Automated testing — define mock users with specific roles in `cds.requires.auth.users` |
   | **`basic`** | Simple scenarios where HTTP Basic (username/password) is acceptable; not recommended for production |
   | **`xsuaa`** | BTP production workloads — full OAuth2 with BTP role collections; what this exercise configures |
   | **`ias`** | SAP Cloud Identity Services — preferred for new BTP apps; supports more IDP protocols than XSUAA |
   | **JWT** (custom) | Bring-your-own token — validate tokens from any OAuth2 IDP by implementing a custom `cds.auth.passport` strategy |

   CAP's development default (`dummy`) is deliberately insecure so that local testing requires no setup. The strategy is changed in `package.json` (`cds.requires.auth`) and does not require code changes in the service layer — the `@requires` annotations remain the same regardless of strategy.

   </details>

1. Why did the request to `/user-api/` work? We didn't implement it, and it is not part of the CAP service. [Where does it come from](https://blogs.sap.com/2021/02/20/sap-tech-bytes-approuter-user-api-service/)?

   <details><summary>Answer</summary>

   `/user-api/` is a **built-in service of the SAP Application Router** (`@sap/approuter`). It is not a custom route and is not implemented in your CAP backend. The route in `xs-app.json` that maps it is:

   ```json
   { "source": "^/user-api(.*)", "service": "sap-approuter-userapi" }
   ```

   The `"service": "sap-approuter-userapi"` value is a special keyword — it tells the router to handle the request internally rather than forwarding it to a destination. The built-in handler reads the validated JWT from the session and returns the logged-in user's attributes (name, email, scopes) as JSON.

   This is useful for displaying the current user's name in a Fiori UI without making a separate backend call, and for debugging which scopes the JWT actually contains.

   </details>

1. What is the difference between a **scope**, a **role template**, and a **role collection** in BTP, and how do they relate to each other?

   <details><summary>Answer</summary>

   These three concepts form a hierarchy from fine-grained permission to user assignment:

   | Concept | Defined in | Purpose |
   | --- | --- | --- |
   | **Scope** | `xs-security.json` → XSUAA | The atomic permission unit (e.g., `$XSAPPNAME.Admin`). Scopes are included in the JWT. |
   | **Role template** | `xs-security.json` → XSUAA | A named grouping of one or more scopes. Templates are instantiated into roles per environment. |
   | **Role collection** | BTP cockpit | A grouping of role instances that can be assigned to users or groups. This is what you assign to a BTP user account. |

   The flow is:
   1. You deploy `xs-security.json` → XSUAA creates the scope and role template
   2. BTP automatically creates a role from the template (or you create one manually in the cockpit)
   3. You add that role to a role collection in the BTP cockpit
   4. You assign the role collection to your user
   5. XSUAA now includes the `Admin` scope in the user's JWT
   6. CAP's `@requires: 'Admin'` check passes

   If you skip step 3–4, authentication still succeeds (the user can log in) but authorization fails (HTTP 403) because the `Admin` scope is absent from the JWT.

   </details>

1. What HTTP status code do you receive when calling a `@requires: 'Admin'` endpoint without the Admin role assigned? Is it the same code you get when not logged in at all?

   <details><summary>Answer</summary>

   They are different, and the difference is meaningful:

   - **Not logged in** — the Application Router intercepts the request before it reaches CAP and issues an HTTP `302 Found` redirect to the XSUAA login page. If you call the CAP service directly (bypassing the router), you get `401 Unauthorized`.
   - **Logged in but missing the Admin scope** — the user has a valid JWT, so authentication passes. CAP validates the `@requires: 'Admin'` check, finds the scope absent, and returns `403 Forbidden`.

   The practical diagnosis rule: a `302` or `401` means the authentication layer failed (no valid session or token). A `403` means authentication succeeded but authorization failed — the user is known but not permitted. When you see a `403` after deployment, the first thing to check is the role collection assignment in the BTP cockpit, not the XSUAA configuration.

   </details>

1. Look at the JWT that XSUAA issues for your user. Can you find your scopes in it?

   <details><summary>Answer</summary>

   Navigate to `/user-api/currentUser` via the Application Router preview URL in BAS. The built-in `sap-approuter-userapi` service returns a JSON object with your user attributes (name, email, and more) extracted from the validated JWT.

   To inspect the raw JWT, open the browser's developer tools (F12), go to the **Network** tab, and find any request to the CAP service. Look at the `Authorization: Bearer <token>` request header. Copy the token value and paste it into [jwt.io](https://jwt.io) to decode it — **never do this with production tokens in a shared environment**. In the decoded payload you will find:

   - `scope` — the list of granted scopes; `<xsappname>.Admin` appears here once the role collection is assigned
   - `sub` — the user's unique identity
   - `email` — the user's email address
   - `exp` — the token expiry time (Unix timestamp)

   If you receive a `403` and cannot find your scope in the `scope` array, the role collection has not been assigned to your user in the BTP cockpit — that is the fix.

   </details>

## Further Study

- [CAP Authentication Strategies](https://cap.cloud.sap/docs/node.js/authentication#strategies) — full reference for dummy, mocked, XSUAA, IAS, and custom strategies
- [CAP Authorization and Access Control](https://cap.cloud.sap/docs/guides/authorization) — `@requires`, `@restrict`, instance-based authorization
- [XSUAA in Hybrid Setup](https://cap.cloud.sap/docs/node.js/authentication#xsuaa-setup) — how to bind a real XSUAA instance for local testing
- [SAP BTP Roles and Role Collections](https://help.sap.com/docs/BTP/65de2977205c403bbc107264b8eccf4b/14a877c6e2f14832999df500ffa6e05e.html) — how to assign role collections to users in the BTP cockpit
- [Application Router user-api service](https://blogs.sap.com/2021/02/20/sap-tech-bytes-approuter-user-api-service/) — built-in user info endpoint provided by `@sap/approuter`
- [`xs-security.json` reference](https://help.sap.com/docs/CP_AUTHORIZ_TRUST_MNG/ae8e8427ecdf407790d96dad93b5f723/517895a9612241259d6941dbf9ad81cb.html) — full schema for scopes, role templates, and OAuth2 configuration

## Next

Continue to 👉 [Exercise 6 - Create Calculation View and Expose via CAP (SAP HANA Cloud)](../ex6/README.md)
