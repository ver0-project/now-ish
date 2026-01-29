# Prereleases and Snapshots

## Prereleases (RC/Beta)

For release candidates before stable release.

### Enter Prerelease Mode

```bash
yarn changeset pre enter beta
```

Creates `.changeset/pre.json` tracking prerelease state.

### Version and Publish

```bash
yarn changeset version
# pkg@2.0.0-beta.0

yarn changeset publish
git push --follow-tags
```

### Subsequent Prereleases

```bash
# Add more changesets, then:
yarn changeset version
# pkg@2.0.0-beta.1

yarn changeset publish
git push --follow-tags
```

### Exit Prerelease Mode

```bash
yarn changeset pre exit
yarn changeset version
# pkg@2.0.0 (stable)

yarn changeset publish
git push --follow-tags
```

### Important Notes

- **Use dedicated branch** — don't prerelease from main
- Prerelease versions don't satisfy normal ranges
  (`^1.0.0` doesn't match `2.0.0-beta.0`)
- Dependents get bumped even for patch changes
- New packages publish to `latest` tag (npm limitation)

### Example Flow

Starting state:
```
pkg-a@1.0.0 depends on pkg-b@^2.0.0
pkg-b@2.0.0
changeset: pkg-b minor
```

After `pre enter next` + `version`:
```
pkg-a@1.0.1-next.0 depends on pkg-b@^2.0.1
pkg-b@2.1.0-next.0
```

Note: `pkg-a` bumped because `^2.0.0` won't match `2.1.0-next.0`.

## Snapshot Releases

For testing without affecting versions. Quick, disposable releases.

### Create Snapshot

```bash
yarn changeset version --snapshot
# pkg@0.0.0-20231215120000

yarn changeset version --snapshot test
# pkg@0.0.0-test-20231215120000
```

### Publish Snapshot

**Always use a tag** to avoid polluting `latest`:

```bash
yarn changeset publish --tag test
```

### Install Snapshot

```bash
yarn add pkg@0.0.0-test-20231215120000
# or by tag:
yarn add pkg@test
```

### After Snapshot

**Do not merge snapshot changes back to main.**

The version changes are for testing only. Discard the branch
or reset after testing.

### Snapshot Config

In `.changeset/config.json`:

```json
{
  "snapshot": {
    "useCalculatedVersion": true,
    "prereleaseTemplate": "{tag}-{datetime}"
  }
}
```

- `useCalculatedVersion` — use real version instead of `0.0.0`
- `prereleaseTemplate` — customize suffix
  - `{tag}` — snapshot tag name
  - `{commit}` — git commit hash
  - `{timestamp}` — unix timestamp
  - `{datetime}` — YYYYMMDDHHMMSS

### Snapshot vs Prerelease

| Aspect | Snapshot | Prerelease |
|--------|----------|------------|
| Purpose | Quick testing | Release candidate |
| Version | `0.0.0-*` | Real semver |
| Merge back | No | Yes |
| npm tag | Custom (required) | Custom |
| Iterations | Start fresh | Increment (beta.0, .1) |
