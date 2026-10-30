# Graph Report - Hackathon-MajorTech-GBV-ReportingSys  (2026-10-31)

## Corpus Check
- 48 files · ~16,679 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 286 nodes · 547 edges · 19 communities (15 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2420e218`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]

## God Nodes (most connected - your core abstractions)
1. `useApp()` - 43 edges
2. `useSession()` - 17 edges
3. `T()` - 16 edges
4. `Screen()` - 16 edges
5. `expo` - 15 edges
6. `compilerOptions` - 15 edges
7. `PressableScale()` - 14 edges
8. `useRecords()` - 13 edges
9. `Header()` - 11 edges
10. `Glass()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `MapScreen()` --calls--> `useApp()`  [EXTRACTED]
  app/(tabs)/map.tsx → src/theme/Theme.tsx
- `Cover()` --calls--> `useApp()`  [EXTRACTED]
  app/cover.tsx → src/theme/Theme.tsx
- `CreateReport()` --calls--> `useRecords()`  [EXTRACTED]
  app/create-report.tsx → src/data/records.tsx
- `CreateReport()` --calls--> `useApp()`  [EXTRACTED]
  app/create-report.tsx → src/theme/Theme.tsx
- `Gate()` --calls--> `useSession()`  [EXTRACTED]
  app/index.tsx → src/data/session.tsx

## Import Cycles
- 1-file cycle: `metro.config.js -> metro.config.js`

## Communities (19 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.11
Nodes (43): Cover(), IncidentScreen(), statuses, Gate(), Login(), Signup(), Sos(), Alerts() (+35 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (13): firebase, app, auth, db, env, incident, now, userRef (+5 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (27): backgroundColor, foregroundImage, adaptiveIcon, backgroundColor, package, typedRoutes, expo, android (+19 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (42): dependencies, expo, expo-blur, expo-constants, expo-font, @expo-google-fonts/figtree, @expo-google-fonts/inter, @expo-google-fonts/newsreader (+34 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (25): addEntry(), attachPhoto(), createIncident(), deleteAccountData(), ensureSample(), listEntries(), listIncidents(), listNotices() (+17 more)

### Community 6 - "Community 6"
Cohesion: 0.16
Nodes (13): CreateReport(), platforms, pingReminder(), asLabels(), geminiSignals(), localSignals(), ORDER, PATTERNS (+5 more)

### Community 7 - "Community 7"
Cohesion: 0.25
Nodes (7): compilerOptions, paths, strict, exclude, extends, include, @/*

### Community 9 - "Community 9"
Cohesion: 0.12
Nodes (15): dependencies, next, react, react-dom, devDependencies, @types/node, @types/react, @types/react-dom (+7 more)

### Community 10 - "Community 10"
Cohesion: 0.31
Nodes (6): MapScreen(), SupportMap(), Line, lines, Place, places

### Community 11 - "Community 11"
Cohesion: 0.29
Nodes (6): Demo order, How the desk makes money, Problem, SafeStep, Solution, Sources, do not read aloud

### Community 12 - "Community 12"
Cohesion: 0.40
Nodes (3): display, metadata, sans

## Knowledge Gaps
- **139 isolated node(s):** `name`, `slug`, `scheme`, `version`, `orientation` (+134 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Community 3` to `Community 1`?**
  _High betweenness centrality (0.201) - this node is a cross-community bridge._
- **Why does `firebase` connect `Community 1` to `Community 3`?**
  _High betweenness centrality (0.185) - this node is a cross-community bridge._
- **Why does `expo` connect `Community 2` to `Community 1`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **What connects `name`, `slug`, `scheme` to the rest of the system?**
  _139 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.11359126984126984 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.11695906432748537 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._