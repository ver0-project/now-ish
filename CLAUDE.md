# now-ish

Grafana-style relative time expression parser.

## Packages

| Package                  | Description                           |
| ------------------------ | ------------------------------------- |
| `@ver0/now-ish`          | Core parser, types. Adapter-agnostic. |
| `@ver0/now-ish_date-fns` | date-fns adapter (TZDate)             |
| `@ver0/now-ish_temporal` | Temporal adapter (ZonedDateTime)      |

## Expression Syntax

```
now[/round][±Nunit[/round]]
```

- `now` — current timestamp (or alias)
- `/unit` — round to boundary
- `±Nunit` — offset by N units

Examples: `now`, `now-1d`, `now/w`, `now-7d/d`, `now/mo+1mo/mo`

## Commands

The root `package.json` defines only the Changesets scripts. Run package scripts through workspaces:

```bash
yarn workspaces foreach -A run test       # run all tests
yarn workspaces foreach -A run build      # build all packages
yarn workspaces foreach -A run lint       # lint all packages
yarn workspace <package-name> <script>    # run one package's script
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
