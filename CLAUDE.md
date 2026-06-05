# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run Commands

- `npm run serve` — dev server with hot reload
- `npm run build` — production build
- `npm run lint` — ESLint check

No test framework is configured (no jest/vitest/cypress).

## Project Overview

NG Space Company is an incremental/idle space game (Vue 3 + Vuex 4 + Bootstrap 5). The original game was by Sparticle999; this is an authorized VueJS remake.

## Architecture

### Game Engine — `src/store.js` (~2200 lines)

The entire game state and logic lives in a single Vuex store. This is the most important file in the project.

**Flat `data` dict pattern**: All game entities (resources, producers, technologies, stars, achievements, storage buildings, ships, wonders, factions, boosts) are stored as entries in `state.data` keyed by string ID (e.g. `state.data['metalT1']`, `state.data['star301']`, `state.data['achMetalT1']`). This is the central pattern — there is no class hierarchy, just plain objects with varying property sets.

**Entity property conventions** (not all entities have all properties):
- `unlocked`, `count`, `active` — basic state
- `baseCosts` / `costs` — cost arrays (costs is computed from baseCosts via `computeCosts` mutation)
- `costType` — `'EXPONENTIAL'` (1.1^count), `'DYSON'` (1.02^count), `'DOUBLE'` (2^count * storagePrice), `'FIXED'` (constant)
- `outputs` / `inputs` — producer resource flow (each entry has `id` and `count`)
- `storage` — storage building target `{id, type, count}` (type: `'FIXED'` adds N per building, `'DOUBLE'` doubles baseStorage per building)
- `baseStorage` / `storage` — resource capacity (computed by `computeStorage` mutation)
- `stats` — star/ship combat stats `{power, defense, speed}`
- `faction`, `opinion`, `spy` — star diplomacy
- `brackets` — achievement milestone thresholds
- `notifs` — which sidebar pane IDs get a notification dot when this entity changes

**Helper index arrays** on state: `resources`, `producers`, `stars`, `ships`, `achievements`, `machineT1`–`machineT6`, `resAchievements`, `prodAchievements`. These reference `state.data` entries by ID and are populated during the `initialize` action. They drive iteration in production/achievement loops.

**Math helpers** at file top: `pascal(n)` for achievement XP, `fibonacci(n)` for rank thresholds, `threat(stats)` for star difficulty levels.

### Game Loop — `src/App.vue` (~2083 lines)

Two `setInterval` timers drive the game:
- **fastUpdate** (100ms): `computeProdValues → produceResources(delta) → updateTimers → checkBoosts` + auto-EMC
- **slowUpdate** (1s): `updateAchievements` + auto-save + leaderboard sync

The delta for production is calculated as `(currentTime - lastUpdateTime) / 1000`, allowing offline progress.

`initialize` action (in store) creates all ~200+ `state.data` entries inline with literal objects. `load` action restores from localStorage.

### Key Actions

| Action | What it does |
|--------|-------------|
| `build({id, count/upto})` | Pay costs, increment count/active, trigger `onBuild` special effects |
| `destroy({id, count})` | Remove buildings (requires `techDestruction`) |
| `convert(id)` | EMC resource conversion (source → destination at configured rate) |
| `spy(id)` | Roll against spy chance to increment star.spy (reveals star stats) |
| `invade(id)` | Combat roll; success = own star + dysonT3.max+1 + antimatter.storage+100K; ships may be destroyed |
| `absorb(id)` | Peaceful star acquisition (requires faction opinion ≥ 60) |
| `rebirth()` | Collect darkmatter from wonders/spheres/researches/rank/swarms, reset most data, preserve faction upgrades |
| `onBuild(id)` | Post-build special effects (upgradeTier2 doubles T2 output, upgradeStorage1 sets count=7, etc.) |

### UI — `src/App.vue` template section

App.vue is a monolithic file containing the entire game UI: sidebar nav + all ~40 tab panes declared inline. Each pane uses `Pane`, `Buildable`, `Resource`, `Star`, `Emc`, `Fleet`, `Card`, `Costs` components.

**Component roles**:
- `Buildable.vue` — universal building/tech/ship/star-exploration card; handles locked/unlocked/maxed states, multibuy, destruction, nanoswarm resource switching
- `Resource.vue` — resource overview panel (production/consumption/balance, storage timer, manual gain button)
- `Star.vue` — star system card (explore/spy/invade/absorb buttons, faction resources, stat display)
- `Emc.vue` — EMC conversion card (source → destination, auto-EMC toggle)
- `Costs.vue` — shared cost display with timer estimates and build calculator

### Backend — `backend/`

Django REST API at `ngspacecompany.exileng.com` handles only user auth and leaderboard ranks. The game runs entirely client-side; backend is not needed for local development.

### Persistence

Save data stored in `localStorage` as JSON key `'ngsave'`. Export/import uses LZ-String base64 compression. Auto-save fires every 30s by default.

## Important Patterns

- **`state.data` is the single source of truth**. Any new game entity must be added as an entry there during `initialize`, and referenced in the appropriate index array.
- **Cost computation is reactive**: `computeCosts` mutation recalculates from `baseCosts` using `costType` formula every time a building is constructed or destroyed. Never modify `costs` directly.
- **Production computation runs every 100ms**: `computeProdValues` iterates all producers checking input availability, then sums per-resource net production. Resources with `toggle != 'on'` or insufficient inputs cause producers to halt (and set `problem` on output resources).
- **`onBuild` special effects are hardcoded per ID**: When adding a new upgrade, check `onBuild` to see if you need a new special-effect branch there.
- **Rebirth exclusion list**: The `rebirth` action has a hardcoded `exludedList` of IDs that persist across rebirth. When adding new permanent upgrades, add their IDs to this list and to the corresponding `rebirthFaction` dispatch.