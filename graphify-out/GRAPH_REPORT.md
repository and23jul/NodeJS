# Graph Report - C:\Users\J1037655\Documents\Visual Studio\BTP\NodeJS  (2026-07-27)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 110 nodes · 100 edges · 18 communities (17 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4b39fa09`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- targets
- aps-orderfulfillmentapp/package.json
- sap.app
- approuter/package.json
- sap.ui5
- libs
- sap.ui
- config
- mainService
- settings
- mockServer.js

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
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (18 total, 1 thin omitted)

### Community 0 - "targets"
Cohesion: 0.13
Nodes (15): viewId, viewLevel, viewName, viewId, viewLevel, viewName, viewId, viewLevel (+7 more)

### Community 1 - "aps-orderfulfillmentapp/package.json"
Cohesion: 0.15
Nodes (12): description, devDependencies, @ui5/cli, name, overrides, undici, scripts, build (+4 more)

### Community 2 - "sap.app"
Cohesion: 0.15
Nodes (12): version, sap.app, applicationVersion, description, i18n, id, title, type (+4 more)

### Community 3 - "approuter/package.json"
Cohesion: 0.22
Nodes (8): dependencies, @sap/approuter, engines, node, name, scripts, start, @sap/approuter

### Community 4 - "sap.ui5"
Cohesion: 0.22
Nodes (9): compact, cozy, async, id, type, viewName, sap.ui5, contentDensities (+1 more)

### Community 5 - "libs"
Cohesion: 0.22
Nodes (9): libs, minUI5Version, sap.f, sap.m, sap.ui.core, sap.ui.layout, sap.uxap, dependencies (+1 more)

### Community 6 - "sap.ui"
Cohesion: 0.22
Nodes (9): desktop, phone, tablet, icon, sap.ui, deviceTypes, fullWidth, icons (+1 more)

### Community 7 - "config"
Cohesion: 0.29
Nodes (7): async, controlAggregation, controlId, routerClass, viewPath, viewType, config

### Community 8 - "mainService"
Cohesion: 0.29
Nodes (7): mainService, settings, type, uri, dataSources, localUri, odataVersion

### Community 9 - "settings"
Cohesion: 0.29
Nodes (7): settings, type, i18n, models, bundleName, fallbackLocale, supportedLocales

## Knowledge Gaps
- **63 isolated node(s):** `name`, `node`, `@sap/approuter`, `start`, `name` (+58 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `sap.ui5` connect `sap.ui5` to `targets`, `settings`, `sap.app`, `libs`?**
  _High betweenness centrality (0.351) - this node is a cross-community bridge._
- **Why does `routing` connect `targets` to `sap.ui5`, `config`?**
  _High betweenness centrality (0.212) - this node is a cross-community bridge._
- **Why does `sap.app` connect `sap.app` to `mainService`?**
  _High betweenness centrality (0.157) - this node is a cross-community bridge._
- **What connects `name`, `node`, `@sap/approuter` to the rest of the system?**
  _63 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `targets` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._