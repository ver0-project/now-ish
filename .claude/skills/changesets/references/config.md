# Changesets Configuration

Config file: `.changeset/config.json`

## Default Config

```json
{
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

## Options

### access

```json
"access": "public" | "restricted"
```

- `"restricted"` (default) — private packages, requires npm login
- `"public"` — public registry

Override per-package in `package.json`:
```json
{ "access": "public" }
```

Prevent publishing entirely:
```json
{ "private": true }
```

### baseBranch

```json
"baseBranch": "main"
```

Branch for git comparisons. Used by `status --since`.

### commit

```json
"commit": false | true | ["module", { options }]
```

Auto-commit changeset files:
- `false` (default) — manual commit
- `true` — use default commit messages
- `["./scripts/commit.js", {}]` — custom generator

Custom generator exports:
```js
module.exports = {
  getAddMessage(changeset, options) {},
  getVersionMessage(releasePlan, options) {}
}
```

### changelog

```json
"changelog": "@changesets/cli/changelog"
"changelog": ["@changesets/changelog-github", { "repo": "org/repo" }]
"changelog": "./my-changelog.js"
"changelog": false
```

Built-in options:
- `@changesets/cli/changelog` — basic format
- `@changesets/changelog-git` — adds commit links
- `@changesets/changelog-github` — adds PR links, contributor thanks

Custom generator exports:
```js
module.exports = {
  getReleaseLine(changeset, type, options) {},
  getDependencyReleaseLine(changesets, updated, options) {}
}
```

### ignore

```json
"ignore": ["pkg-a", "@scope/*"]
```

Skip packages from being published. Supports globs.

**Temporary use only** — for blocking releases during development.
For permanent exclusion, use `"private": true` in package.json.

Constraints:
- Cannot ignore package if same changeset includes non-ignored package
- Cannot ignore if it breaks dependency chain

### linked

```json
"linked": [["pkg-a", "pkg-b"]]
```

Packages share highest version when any is released.
Only bumps packages that have changesets.

Example: `pkg-a@1.0.0`, `pkg-b@1.0.0`
- Changeset: `pkg-a` minor → both become `1.1.0`
- Later: `pkg-a` patch only → `pkg-a@1.1.1`, `pkg-b` stays `1.1.0`

Supports globs: `["pkg-*"]`

### fixed

```json
"fixed": [["pkg-a", "pkg-b"]]
```

Packages always versioned and published together.
All packages bump even without changesets.

Example: `pkg-a@1.0.0`, `pkg-b@1.0.0`
- Changeset: `pkg-a` minor → both become `1.1.0` and publish

Supports globs: `["@myorg/*"]`

### updateInternalDependencies

```json
"updateInternalDependencies": "patch" | "minor"
```

When dependency updates, bump dependent's version range:
- `"patch"` — always update (`^1.0.0` → `^1.0.1`)
- `"minor"` — only on minor+ (`^1.0.0` stays for patches)

### privatePackages

```json
"privatePackages": {
  "version": true,
  "tag": false
}
```

Handle packages with `"private": true`:
- `version` — update version in package.json
- `tag` — create git tags

### snapshot

```json
"snapshot": {
  "useCalculatedVersion": false,
  "prereleaseTemplate": "{tag}-{datetime}"
}
```

Configure `--snapshot` behavior:
- `useCalculatedVersion` — use calculated version vs `0.0.0`
- `prereleaseTemplate` — format with `{tag}`, `{commit}`,
  `{timestamp}`, `{datetime}`

## Experimental Options

Under `___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH`:

```json
{
  "___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH": {
    "updateInternalDependents": "out-of-range" | "always",
    "onlyUpdatePeerDependentsWhenOutOfRange": false
  }
}
```
