# Automating Changesets

## GitHub Integration

### Changeset Bot

Install [changeset-bot](https://github.com/apps/changeset-bot):
- Comments on PRs missing changesets
- Provides link to add changeset
- Non-blocking (PR can still merge)

### GitHub Action

Use [changesets/action](https://github.com/changesets/action):

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: yarn install --frozen-lockfile

      - name: Create Release PR or Publish
        uses: changesets/action@v1
        with:
          publish: yarn changeset publish
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**What it does:**
1. When changesets exist → creates/updates "Version Packages" PR
2. When PR merges → runs publish command
3. Creates GitHub releases for tags

### Action Options

```yaml
- uses: changesets/action@v1
  with:
    # Command to run for publishing
    publish: yarn changeset publish

    # Command for versioning (default: changeset version)
    version: yarn changeset version

    # Commit message for version PR
    commit: "chore: version packages"

    # PR title
    title: "chore: version packages"

    # Create GitHub releases
    createGithubReleases: true
```

## CI Checks

### Require Changesets (Blocking)

Add to CI pipeline:

```yaml
- name: Check for changesets
  run: yarn changeset status --since=origin/main
```

Exits with code 1 if no changesets since main.

**Allow bypass with empty changeset:**
```bash
yarn changeset --empty
```

### Non-Blocking Check

Use changeset-bot instead. Highlights missing changesets
without blocking merge.

## Manual Release Flow

If not using GitHub Action:

```bash
# 1. Freeze merges to main

# 2. Version packages
git checkout main
git pull
yarn changeset version
git add .
git commit -m "chore: version packages"
git push

# 3. After merge, publish
git pull
yarn changeset publish
git push --follow-tags

# 4. Unfreeze merges
```

## Changelog Generators

### @changesets/changelog-github

Adds PR links and contributor attribution:

```bash
yarn add -D @changesets/changelog-github
```

```json
{
  "changelog": [
    "@changesets/changelog-github",
    { "repo": "owner/repo" }
  ]
}
```

Requires `GITHUB_TOKEN` env var for API access.

### @changesets/changelog-git

Adds commit links:

```bash
yarn add -D @changesets/changelog-git
```

```json
{
  "changelog": "@changesets/changelog-git"
}
```

## npm Authentication

### GitHub Actions

```yaml
env:
  NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Create token at npmjs.com → Access Tokens → Automation.

### 2FA Handling

If npm account has 2FA:

```bash
yarn changeset publish --otp=123456
```

Or use Automation token type (bypasses 2FA for CI).

## Monorepo CI Matrix

For testing packages before release:

```yaml
jobs:
  test:
    strategy:
      matrix:
        package: [pkg-a, pkg-b, pkg-c]
    steps:
      - run: yarn workspace ${{ matrix.package }} test

  release:
    needs: test
    # ... release job
```
