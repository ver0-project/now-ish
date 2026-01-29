# Changesets CLI Commands

## init

```bash
yarn changeset init
```

Sets up `.changeset/` folder with config and readme. Run once per repo.

## add

```bash
yarn changeset
yarn changeset add
```

Create a new changeset. Interactive prompts for:
1. Packages to release (monorepo)
2. Bump type per package
3. Summary message

**Flags:**
- `--empty` — create empty changeset (no packages, for CI bypass)
- `--open` — open created file in editor

## version

```bash
yarn changeset version
```

Consume changesets and update packages:
- Bumps versions based on semver rules
- Updates internal dependencies
- Writes changelog entries
- Deletes consumed changeset files

**Flags:**
- `--ignore PACKAGE` — skip specific package
- `--snapshot [tag]` — create snapshot version (testing)

Run this when ready to release. Review changes before committing.

## publish

```bash
yarn changeset publish
```

Publish packages to npm:
- Checks each package version against npm registry
- Publishes packages with newer versions
- Creates git tags

**Flags:**
- `--otp=CODE` — npm one-time password for 2FA
- `--tag NAME` — npm dist-tag (default: `latest`)
- `--no-git-tag` — skip creating git tags

After publishing:
```bash
git push --follow-tags
```

## status

```bash
yarn changeset status
```

Show pending changesets and their effects.

**Flags:**
- `--verbose` — show versions and changeset links
- `--output=FILE.json` — write status to JSON file
- `--since=REF` — only changes since git ref

Exits with code 1 if no changesets exist.

## pre

```bash
yarn changeset pre enter <tag>
yarn changeset pre exit
```

Enter/exit prerelease mode. See [prereleases](prereleases.md).

## tag

```bash
yarn changeset tag
```

Create git tags for current versions without publishing.
Useful when using alternative publish tools (pnpm, etc.).

Tag format:
- Monorepo: `pkg-name@1.0.0`
- Single package: `v1.0.0`
