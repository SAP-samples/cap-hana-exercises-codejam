# Interaction Items UI

This folder contains the front-end application for browsing and editing interaction data. It is a **SAP Fiori Elements** application built on **SAPUI5**, generated with the SAP Fiori tools App Generator inside SAP Business Application Studio (BAS).

---

## Table of Contents

1. [What the User Sees](#1-what-the-user-sees)
2. [Technology Stack](#2-technology-stack)
3. [How Fiori Elements Works — the Big Idea](#3-how-fiori-elements-works--the-big-idea)
4. [The Three-Level Navigation Flow](#4-the-three-level-navigation-flow)
5. [How Annotations Drive the UI](#5-how-annotations-drive-the-ui)
6. [How `manifest.json` Wires Everything Together](#6-how-manifestjson-wires-everything-together)
7. [The OData V4 Connection](#7-the-odata-v4-connection)
8. [Running the App Locally](#8-running-the-app-locally)
9. [File-by-File Guide](#9-file-by-file-guide)

---

## 1. What the User Sees

When a user opens the app they travel through **three screens**, each automatically generated from metadata — no hand-written XML views, no custom controllers:

```text
┌──────────────────────────────────────┐
│  List Report                         │
│  (all Incidents / Headers)           │
│                                      │
│  [Filter Bar: Partner | Country]     │
│  ─────────────────────────────────── │
│  Partner      Country                │
│  ACME         Germany                │  ← click a row
│  Globex       France                 │
└──────────────────────────────────────┘
           │ navigate
           ▼
┌──────────────────────────────────────┐
│  Object Page — Incident              │
│  Header: partner name, country       │
│                                      │
│  Tabs:                               │
│    General Information               │
│    Interaction Items  (table)        │  ← click a row item
│    Administration                    │
└──────────────────────────────────────┘
           │ navigate
           ▼
┌──────────────────────────────────────┐
│  Object Page — Interaction Item      │
│  Header: item text                   │
│                                      │
│  Tabs:                               │
│    General Information (text, date,  │
│                          price)      │
│    Item Translations  (locale table) │
└──────────────────────────────────────┘
```

Each of these pages is a **Fiori Elements floor-plan template**. The app declares *what data to show*; the framework decides *how to render it*.

---

## 2. Technology Stack

| Layer | Technology | Role |
| --- | --- | --- |
| UI framework | **SAPUI5 1.131+** | Component model, data binding, theming |
| Floor-plan library | **`sap.fe.templates`** | Pre-built List Report and Object Page templates |
| Data protocol | **OData V4** | Structured HTTP API with `$select`, `$expand`, `$filter` |
| Metadata language | **CDS Annotations** (`annotations.cds`) | Declarative UI configuration — no XML view code |
| Build / dev server | **UI5 Tooling** (`ui5.yaml`) | Local dev server with live-reload |
| CAP backend | **`CatalogService`** (`srv/interaction_srv.cds`) | Serves the OData V4 endpoint at `/odata/v4/catalog/` |
| Theme | `sap_horizon` | SAP's current design system |

---

## 3. How Fiori Elements Works — the Big Idea

Traditional UI5 apps require you to write XML views, bind every field, define every column, and write controller JavaScript for navigation. That is a lot of code to maintain and keep consistent.

Fiori Elements takes a different approach: **the OData service's metadata and annotations are the source of truth**. The `sap.fe.templates` library reads the metadata at runtime and renders a complete UI automatically.

```text
annotations.cds  ──►  CDS compiler  ──►  OData $metadata document
                                              │
                                              ▼
                                    sap.fe.templates reads metadata
                                              │
                                              ▼
                                    Renders List Report / Object Page
                                    with correct columns, filters, tabs
```

The practical benefit for a workshop: you can add a new column to the UI by adding **one annotation line** in `annotations.cds` — no JavaScript, no XML edits, no recompile step.

---

## 4. The Three-Level Navigation Flow

The routing is declared in [`webapp/manifest.json`](webapp/manifest.json). There are three routes:

```json
":?query:"                                 → Interactions_HeaderList   (List Report)
"Interactions_Header({key}):?query:"       → Interactions_HeaderObjectPage
"Interactions_Header({key})/items({key2})" → Interactions_ItemsObjectPage
```

### Level 1 — List Report (`Interactions_HeaderList`)

The entry point. It shows a filter bar and a responsive table of `Interactions_Header` records.

- The **filter bar** is driven by `UI.SelectionFields: [partner, country_code]` in `annotations.cds`. Those two fields become the quick-filter inputs.
- The **table columns** are driven by `UI.LineItem` — the two `DataField` entries become the Partner and Country columns.
- The **sort order** (ascending by `partner`) comes from `UI.PresentationVariant.SortOrder`.
- The **page-level variant management** (`"variantManagement": "Page"`) lets users save their own filter/sort combinations as named variants — a built-in personalization feature with zero code.

### Level 2 — Header Object Page (`Interactions_HeaderObjectPage`)

Clicking a row navigates here. The URL becomes `Interactions_Header(guid'...')`.

The page is divided into **facets** (tabs/sections), each declared in `UI.Facets`:

| Facet | Content | CDS target |
| --- | --- | --- |
| General Information | Partner, Country | `UI.FieldGroup#GeneratedGroup` |
| Interaction Items | Child items table | `items/@UI.LineItem` |
| Administration | createdBy, modifiedBy, createdAt, modifiedAt | `UI.FieldGroup#Admin` |

The `managed` aspect in the data model (`db/interactions.cds`) is what provides the four audit fields. CAP populates them automatically — the UI just reads them.

The header area of this page is controlled by `UI.HeaderInfo`: the partner name is the title and the country description is the subtitle.

Notice `@odata.draft.enabled: true` on `CatalogService.Interactions_Header` in `srv/interaction_srv.cds`. This tells CAP and Fiori Elements to activate **draft handling** — the user can edit a record and their unsaved changes are stored as a draft on the server, surviving page refreshes. The Edit / Save / Discard buttons in the toolbar are rendered automatically because of this one annotation.

### Level 3 — Item Object Page (`Interactions_ItemsObjectPage`)

Clicking a row in the Interaction Items table navigates one level deeper. The URL becomes `Interactions_Header(guid'...')/items(guid'...')`.

This page shows:

- **General Information** — text, date, and price (rendered as a data-point with two decimal places because of `UI.DataPoint#Price`).
- **Item Translations** — because `text` is declared as `localized Text` in the data model, CAP automatically creates a companion `.texts` entity. The annotation on `Interactions_Items.texts` exposes the locale/text pairs in a read-only table here.

---

## 5. How Annotations Drive the UI

All UI configuration lives in [`annotations.cds`](annotations.cds). There is **no XML, no JavaScript** to understand to change what the UI displays — only CDS vocabulary terms.

### Vocabulary terms used in this app

| Term | What it controls |
| --- | --- |
| `UI.HeaderInfo` | The title, subtitle, and icon shown at the top of an Object Page |
| `UI.SelectionFields` | Which fields appear in the List Report filter bar |
| `UI.LineItem` | Which columns appear in a table |
| `UI.FieldGroup` | A named group of fields displayed together in a form section |
| `UI.Facets` | The tabs/sections on an Object Page and what each one shows |
| `UI.PresentationVariant` | Default sort order and which visualization to use |
| `UI.DataPoint` | A single KPI-style value with formatting rules |
| `Common.Label` | The display label for a field |
| `Common.Text` / `Common.TextArrangement` | Show the *description* of a code field instead of (or alongside) the raw code |
| `Common.ValueList` | Drives the value-help (F4) popup for a field |
| `Common.FieldControl: #ReadOnly` | Makes a specific field non-editable in the UI |
| `UI.Hidden` | Hides a field from all UI rendering (used on the `ID` column of texts) |

### Example — adding a column

To add a `currency` column to the items table you would add one entry to `UI.LineItem` on `Interactions_Items`:

```cds
// In annotations.cds, inside the Interactions_Items UI.LineItem array:
{
    $Type: 'UI.DataField',
    Value: currency_code,
    Importance: #Low,
},
```

No manifest change, no JavaScript, no XML. Restart the CAP server and the column appears.

---

## 6. How `manifest.json` Wires Everything Together

[`webapp/manifest.json`](webapp/manifest.json) is the application descriptor — the single file the UI5 runtime reads to bootstrap the entire app. Key sections:

### `sap.app.dataSources`

```json
"mainService": {
  "uri": "/odata/v4/catalog/",
  "type": "OData",
  "settings": { "odataVersion": "4.0" }
}
```

This points the app at the CAP OData V4 service. The path `/odata/v4/catalog/` matches the `CatalogService` defined in `srv/interaction_srv.cds`.

### `sap.ui5.models`

The default model (`""`) binds the entire app to `mainService` with `operationMode: "Server"` — meaning filtering and sorting are sent as OData query parameters to the server, never downloaded client-side. With large HANA tables, this is critical for performance.

`autoExpandSelect: true` means the framework automatically computes the minimal `$select` and `$expand` for each page, requesting only the fields that are actually rendered — another performance win.

### `sap.ui5.routing`

This section maps URL patterns to Fiori Elements template components (`sap.fe.templates.ListReport`, `sap.fe.templates.ObjectPage`). Each target declares a `contextPath` which is the OData entity set the template reads its data and metadata from.

The `navigation` sub-property tells each template which entity navigation property to follow when a row is clicked, and which route to activate.

---

## 7. The OData V4 Connection

Understanding how the UI actually gets data helps when debugging or extending the app.

When the List Report loads, the browser fires an OData request like:

```http
GET /odata/v4/catalog/Interactions_Header
    ?$select=partner,country_code,country/descr
    &$expand=country($select=descr)
    &$orderby=partner asc
    &$count=true
```

CAP handles this entirely automatically — it translates the OData query into SQL against the HANA HDI container.

When the user types in the filter bar and presses Go, a new request is sent with a `$filter` clause:

```http
GET /odata/v4/catalog/Interactions_Header
    ?$filter=contains(partner,'ACM')
    &...
```

When the user navigates to an Object Page, an additional `$expand=items` is added to pull the child items in the same round-trip (`earlyRequests: true` in the manifest triggers this eagerly before the page is fully rendered).

---

## 8. Running the App Locally

### Option A — Via CAP (simplest)

```bash
# From solution/MyHANAApp/
npm ci
npm start
```

Then open: <http://localhost:4004/interaction_items/webapp/index.html>

CAP serves the UI directly alongside the OData service. No proxy configuration is needed.

### Option B — Via UI5 Tooling (with live-reload)

```bash
# From solution/MyHANAApp/
npm run watch-interaction_items
```

This starts the UI5 dev server (port 8080 by default) with live-reload enabled. The `fiori-tools-proxy` middleware in [`ui5.yaml`](ui5.yaml) forwards `/odata/v4/` requests to CAP running on port 4004, and fetches the UI5 runtime from `https://sapui5.hana.ondemand.com` so you don't need a local copy.

### Authentication

The `Interactions_Header` entity requires `authenticated-user` and `Interactions_Items` requires `Admin` (see `srv/interaction_srv.cds`). During local development CAP defaults to a mock auth mode where any user is treated as authenticated. In production the AppRouter enforces XSUAA login before any request reaches the service.

---

## 9. File-by-File Guide

```text
app/interaction_items/
│
├── annotations.cds          ← All UI metadata: columns, filters, labels, facets.
│                              This is the main file to edit when changing what the UI shows.
│
├── webapp/
│   ├── manifest.json        ← App descriptor: routing, data sources, models, dependencies.
│   │                          Edit here to add routes or change the OData endpoint.
│   │
│   ├── Component.js         ← Standard UI5 app entry point. Auto-generated; rarely edited.
│   │
│   ├── index.html           ← HTML bootstrap for standalone launch (local dev only).
│   │
│   ├── i18n/
│   │   └── i18n.properties  ← Translatable strings (app title, description).
│   │                          Add keys here for any hard-coded labels you want translatable.
│   │
│   └── test/
│       ├── flpSandbox.html          ← Simulates a Fiori Launchpad shell locally.
│       └── integration/
│           ├── FirstJourney.js      ← OPA5 integration test: navigates the app end-to-end.
│           ├── pages/
│           │   ├── Interactions_HeaderList.js       ← Page object for List Report
│           │   ├── Interactions_HeaderObjectPage.js ← Page object for Header Object Page
│           │   └── Interactions_ItemsObjectPage.js  ← Page object for Items Object Page
│           └── opaTests.qunit.html  ← Test runner HTML
│
├── package.json             ← NPM metadata for this UI module (consumed by CAP's app serving).
└── ui5.yaml                 ← UI5 Tooling config: dev server, proxy, live-reload settings.
```

### `annotations.cds` vs `manifest.json` — what goes where?

A common point of confusion:

- **`annotations.cds`** — controls *what data* is shown and how it is labelled. If you want a new column, a new filter, a different label, or a new tab: edit this file.
- **`manifest.json`** — controls *how the app is assembled*: routing between pages, which OData service to connect to, which UI5 libraries to load. If you want to add a new page or change the navigation structure: edit this file.

You will spend most of your time in `annotations.cds`. The framework does the rest.
