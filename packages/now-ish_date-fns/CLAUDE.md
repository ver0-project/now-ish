# now-ish_date-fns

date-fns adapter for `@ver0/now-ish`. Returns TZDate.

## What This Package Does

- Exports ready-to-use `parse()` function (UTC timezone by default)
- Provides unit definitions for ms, s, m, h, d, w, mo, y
- Exports `units`, `now`, `nowAliases` for custom parser configuration

## What This Package Does NOT Do

- Does NOT export `createParser` (import from `@ver0/now-ish`)
- Does NOT re-export core types (import from `@ver0/now-ish`)

## Design Notes

- Uses `TZDate` from `@date-fns/tz` for timezone-aware operations
- Week starts Monday (ISO 8601)
- All rounding operations use date-fns functions with timezone context
- Second, minute, and hour rounding keeps the UTC offset of the input in the context timezone when the rounded
  wall-clock time exists at that offset — the result stays in the same pass of an hour that a clock change repeats. Day
  and larger units do not: a day starts at the first pass of midnight

## Core Files

- `src/units.ts` — unit definitions, now factory, nowAliases
- `src/index.ts` — public exports including pre-configured `parse`

## Dependencies

- `date-fns` — date manipulation
- `@date-fns/tz` — timezone-aware TZDate
- `@ver0/now-ish` — core parser (peer dependency)

## Commands

```bash
yarn test           # run tests
yarn build          # build to dist/
yarn lint           # lint
```
