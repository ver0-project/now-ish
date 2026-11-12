# now-ish

Grafana-style relative time expression parser.

## Packages

| Package | Description |
|---------|-------------|
| `@ver0/now-ish` | Core parser, types. Adapter-agnostic. |
| `@ver0/now-ish_date-fns` | date-fns adapter (TZDate) |
| `@ver0/now-ish_temporal` | Temporal adapter (ZonedDateTime) |

## Expression Syntax

```
now[/round][±Nunit[/round]]
```

- `now` — current timestamp (or alias)
- `/unit` — round to boundary
- `±Nunit` — offset by N units

Examples: `now`, `now-1d`, `now/w`, `now-7d/d`, `now/mo+1mo/mo`

## Commands

```bash
yarn test           # run all tests
yarn build          # build all packages
yarn lint           # lint all packages
```

## Versioning

Uses [Changesets](https://github.com/changesets/changesets) for versioning.

Workflow:
1. Make changes
2. Run `yarn changeset` to describe changes and bump type
3. Commit the changeset file with your changes

Releases are automated. `.github/workflows/release.yml` runs after CI succeeds on `master`: `changesets/action` opens
the version pull request while changesets are pending and publishes once that pull request merges. Do not run
`yarn version` or `yarn release` locally.

## Notes

- Uses Yarn. Do not use npm.
- Structural or significant changes must be documented in the
  respective package's `CLAUDE.md`.
