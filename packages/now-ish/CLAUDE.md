# now-ish

Core parser for Grafana-style relative time expressions. Adapter-agnostic.

## What This Package Does

- Parses expressions like `now-7d/w` into structured tokens
- Validates expression grammar and unit references
- Provides `createParser()` factory to build parsers with adapter config
- Defines types for adapters to implement

## What This Package Does NOT Do

- Does NOT perform date/time operations (no date library dependency)
- Does NOT provide unit definitions (adapters provide these)
- Does NOT export a ready-to-use `parse()` function (adapters do)

## Expression Grammar

```text
now[/round][±Nunit[/round]]
```

- `now` — keyword (or alias like `heute`, `сейчас`)
- `/unit` — round to boundary (start or end depending on direction)
- `±Nunit` — offset by N units

Examples: `now`, `now-1d`, `now/w`, `now-7d/d`, `now/mo+1mo/mo`

## Core Files

- `src/parse.ts` — parser implementation and types
- `src/index.ts` — public exports

## Commands

```bash
yarn test           # run tests
yarn build          # build to dist/
yarn lint           # lint
```
