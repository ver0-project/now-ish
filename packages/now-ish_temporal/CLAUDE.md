# now-ish_temporal

Temporal API adapter for `@ver0/now-ish`. Returns ZonedDateTime.

## What This Package Does

- Exports ready-to-use `parse()` function (UTC timezone by default)
- Provides unit definitions for ms, s, m, h, d, w, mo, y
- Exports `units`, `now`, `nowAliases` for custom parser configuration

## What This Package Does NOT Do

- Does NOT export `createParser` (import from `@ver0/now-ish`)
- Does NOT re-export core types (import from `@ver0/now-ish`)

## Design Notes

- Uses `Temporal.ZonedDateTime` for timezone-aware operations
- Week starts Monday (ISO 8601)
- Day rounding uses `startOfDay()` to handle DST correctly
- Round-up returns last nanosecond of period
- `now` is the only code that selects a Temporal implementation: `globalThis.Temporal` at call time, the polyfill when
  the runtime has none. The units call only methods of the time they receive
- The exported types are the standard `Temporal` types (TypeScript `esnext` lib), not the types of the polyfill — the
  two sets of declarations are not assignable to each other

## Core Files

- `src/units.ts` — unit definitions, now factory, nowAliases
- `src/index.ts` — public exports including pre-configured `parse`

## Dependencies

- `@js-temporal/polyfill` — fallback for a runtime without `Temporal`
- `@ver0/now-ish` — core parser (peer dependency)

## Commands

```bash
yarn test           # run tests
yarn build          # build to dist/
yarn lint           # lint
```
