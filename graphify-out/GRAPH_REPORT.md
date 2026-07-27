# Graph Report - .  (2026-07-27)

## Corpus Check
- 5 files · ~4,966 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 124 nodes · 117 edges · 18 communities (17 shown, 1 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Approuter Routing Config
- UI5 Theme Settings
- Approuter MTA Deployment
- Order App Package Config
- App Manifest Metadata
- Approuter NPM Dependencies
- UI5 Library Config
- Device Type Handling
- OData Service Config
- Mock Server
- Order List View

## God Nodes (most connected - your core abstractions)
1. `sap.app` - 8 edges
2. `config` - 7 edges
3. `sap.ui5` - 6 edges
4. `libs` - 6 edges
5. `sap.ui` - 5 edges
6. `rootView` - 5 edges
7. `scripts` - 4 edges
8. `mainService` - 4 edges
9. `deviceTypes` - 4 edges
10. `settings` - 4 edges

## Surprising Connections (you probably didn't know these)
- `XSUAA-application-APSAppRouter (existing-service)` --semantically_similar_to--> `order-fulfillment-app-xsuaa (xsuaa application plan)`  [INFERRED] [semantically similar]
  aps-approuter/mta.yaml → aps-orderfulfillmentapp/mta.yaml
- `DEST-lite-APSAppRouter (destination service lite)` --semantically_similar_to--> `order-fulfillment-app-destination (destination lite, HTML5Runtime_enabled)`  [INFERRED] [semantically similar]
  aps-approuter/mta.yaml → aps-orderfulfillmentapp/mta.yaml
- `NodeJS-CentralAppRouter (README)` --references--> `aps-approuter MTA module (nodejs)`  [INFERRED]
  README.md → aps-approuter/mta.yaml
- `Centralized AppRouter Pattern (SAP BTP)` --conceptually_related_to--> `HTML5-app_runtime-APSAppRouter (html5-apps-repo app-runtime)`  [INFERRED]
  README.md → aps-approuter/mta.yaml
- `Centralized AppRouter Pattern (SAP BTP)` --conceptually_related_to--> `order-fulfillment-app-html5-repo-host (html5-apps-repo app-host)`  [INFERRED]
  README.md → aps-orderfulfillmentapp/mta.yaml

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **SAP BTP HTML5 app hosting pattern: app-host + app-runtime + central approuter** — aps_approuter_mta_approuter_module, aps_approuter_mta_html5_runtime_resource, aps_orderfulfillmentapp_mta_html5_host_resource [INFERRED 0.90]
- **order-fulfillment-app build-deploy-serve chain** — aps_orderfulfillmentapp_mta_app_module, aps_orderfulfillmentapp_mta_deployer_module, aps_orderfulfillmentapp_mta_html5_host_resource, aps_orderfulfillmentapp_webapp_index_html_bootstrap [INFERRED 0.85]

## Communities (18 total, 1 thin omitted)

### Community 0 - "Approuter Routing Config"
Cohesion: 0.11
Nodes (18): async, controlAggregation, controlId, routerClass, viewPath, viewType, viewId, viewLevel (+10 more)

### Community 1 - "UI5 Theme Settings"
Cohesion: 0.12
Nodes (16): compact, cozy, settings, type, i18n, async, id, type (+8 more)

### Community 2 - "Approuter MTA Deployment"
Cohesion: 0.19
Nodes (14): aps-approuter MTA module (nodejs), DEST-lite-APSAppRouter (destination service lite), HTML5-app_runtime-APSAppRouter (html5-apps-repo app-runtime), XSUAA-application-APSAppRouter (existing-service), order-fulfillment-app MTA html5 module, order-fulfillment-app-deployer MTA content deployer module, order-fulfillment-app-destination (destination lite, HTML5Runtime_enabled), order-fulfillment-app-html5-repo-host (html5-apps-repo app-host) (+6 more)

### Community 3 - "Order App Package Config"
Cohesion: 0.15
Nodes (12): description, devDependencies, @ui5/cli, name, overrides, undici, scripts, build (+4 more)

### Community 4 - "App Manifest Metadata"
Cohesion: 0.15
Nodes (12): version, sap.app, applicationVersion, description, i18n, id, title, type (+4 more)

### Community 5 - "Approuter NPM Dependencies"
Cohesion: 0.22
Nodes (8): dependencies, @sap/approuter, engines, node, name, scripts, start, @sap/approuter

### Community 6 - "UI5 Library Config"
Cohesion: 0.22
Nodes (9): libs, minUI5Version, sap.f, sap.m, sap.ui.core, sap.ui.layout, sap.uxap, dependencies (+1 more)

### Community 7 - "Device Type Handling"
Cohesion: 0.22
Nodes (9): desktop, phone, tablet, icon, sap.ui, deviceTypes, fullWidth, icons (+1 more)

### Community 8 - "OData Service Config"
Cohesion: 0.29
Nodes (7): mainService, settings, type, uri, dataSources, localUri, odataVersion

### Community 10 - "Order List View"
Cohesion: 0.50
Nodes (4): viewId, viewLevel, viewName, orderList

## Knowledge Gaps
- **64 isolated node(s):** `name`, `node`, `@sap/approuter`, `start`, `name` (+59 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `sap.ui5` connect `UI5 Theme Settings` to `Approuter Routing Config`, `App Manifest Metadata`, `UI5 Library Config`?**
  _High betweenness centrality (0.276) - this node is a cross-community bridge._
- **Why does `routing` connect `Approuter Routing Config` to `UI5 Theme Settings`?**
  _High betweenness centrality (0.166) - this node is a cross-community bridge._
- **Why does `sap.app` connect `App Manifest Metadata` to `OData Service Config`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **What connects `name`, `node`, `@sap/approuter` to the rest of the system?**
  _64 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Approuter Routing Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `UI5 Theme Settings` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._