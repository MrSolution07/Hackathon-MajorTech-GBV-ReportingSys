# Graph Report - Hackathon-MajorTech-GBV-ReportingSys  (2026-10-26)

## Corpus Check
- 35 files · ~9,149 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 169 nodes · 426 edges · 9 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]

## God Nodes (most connected - your core abstractions)
1. `useApp()` - 66 edges
2. `T()` - 27 edges
3. `Screen()` - 26 edges
4. `Button()` - 19 edges
5. `PressableScale()` - 16 edges
6. `expo` - 14 edges
7. `Header()` - 12 edges
8. `ListRow()` - 12 edges
9. `MapArt()` - 7 edges
10. `Card()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Bookings()` --calls--> `useApp()`  [EXTRACTED]
  app/(tabs)/bookings.tsx → src/theme/Theme.tsx
- `Home()` --calls--> `useApp()`  [EXTRACTED]
  app/(tabs)/index.tsx → src/theme/Theme.tsx
- `MapScreen()` --calls--> `useApp()`  [EXTRACTED]
  app/(tabs)/map.tsx → src/theme/Theme.tsx
- `Reports()` --calls--> `useApp()`  [EXTRACTED]
  app/(tabs)/reports.tsx → src/theme/Theme.tsx
- `WalkMap()` --calls--> `useApp()`  [EXTRACTED]
  app/(tabs)/walk-map.tsx → src/theme/Theme.tsx

## Import Cycles
- None detected.

## Communities (9 total, 0 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.15
Nodes (20): CreateReport(), icons, Login(), modes, facts, genders, points, slides (+12 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (21): MatchDetails(), Matches(), Bookings(), filters, Reports(), WalkMap(), filters, Transport() (+13 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (22): backgroundColor, package, typedRoutes, expo, android, backgroundColor, experiments, ios (+14 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (23): dependencies, expo, expo-constants, expo-font, @expo-google-fonts/inter, expo-haptics, expo-image, expo-linear-gradient (+15 more)

### Community 4 - "Community 4"
Cohesion: 0.14
Nodes (17): copy, Info(), RowToggle(), Language(), Navigate(), ReportSubmitted(), RouteDetails(), SignUp() (+9 more)

### Community 5 - "Community 5"
Cohesion: 0.21
Nodes (8): RootStack(), Home(), MapScreen(), Card(), MapArt(), AppProvider(), AppState, Ctx

### Community 6 - "Community 6"
Cohesion: 0.15
Nodes (12): devDependencies, @types/react, typescript, main, name, private, scripts, android (+4 more)

### Community 7 - "Community 7"
Cohesion: 0.29
Nodes (6): compilerOptions, paths, strict, extends, include, @/*

## Knowledge Gaps
- **70 isolated node(s):** `name`, `slug`, `scheme`, `version`, `orientation` (+65 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useApp()` connect `Community 4` to `Community 0`, `Community 1`, `Community 5`?**
  _High betweenness centrality (0.164) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 3` to `Community 6`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `name`, `slug`, `scheme` to the rest of the system?**
  _70 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.14789915966386555 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.11693548387096774 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._