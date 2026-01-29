# Changesets in Monorepos

## How Dependencies Are Bumped

When a package is released, dependents within the monorepo may need updates.

**Example:**
```
pkg-a@1.1.1
pkg-b@1.1.0 depends on pkg-a@^1.1.0
```

If `pkg-a` gets a `major` bump to `2.0.0`:
- `pkg-b`'s dependency `^1.1.0` no longer matches
- Changesets auto-adds `pkg-b` as `patch` bump
- Result: `pkg-b@1.1.1` depends on `pkg-a@^2.0.0`

Control this with `updateInternalDependencies` config.

## Linked Packages

Packages share semver range when released together.

```json
{ "linked": [["pkg-a", "pkg-b"]] }
```

**Behavior:**
- Only packages with changesets get released
- Released packages get highest version in the group
- Highest bump type from any changeset applies

**Example:** Both at `1.0.0`

| Changeset | Result |
|-----------|--------|
| `pkg-a` minor | `pkg-a@1.1.0`, `pkg-b` unchanged |
| `pkg-a` minor, `pkg-b` patch | Both `1.1.0` |
| `pkg-b` major | `pkg-b@2.0.0`, `pkg-a` unchanged |
| Both patch after above | Both `2.0.1` |

**With dependencies:** If `pkg-a` depends on `pkg-b`:
- `pkg-b` major → both get major (dependency cascade)
- `pkg-a` major → only `pkg-a` bumps

**Globs supported:**
```json
{ "linked": [["@myorg/*"]] }
```

## Fixed Packages

Packages always version and publish together.

```json
{ "fixed": [["pkg-a", "pkg-b"]] }
```

**Behavior:**
- All packages in group always release together
- All get same version
- Highest bump from any changeset applies to all

**Example:** Both at `1.0.0`

| Changeset | Result |
|-----------|--------|
| `pkg-a` minor | Both `1.1.0` |
| `pkg-a` patch | Both `1.0.1` |
| `pkg-a` minor, `pkg-b` major | Both `2.0.0` |

**Use cases:**
- Tightly coupled packages (core + plugins)
- Packages that must stay in sync

**Globs supported:**
```json
{ "fixed": [["@myorg/core-*"]] }
```

## Linked vs Fixed

| Aspect | Linked | Fixed |
|--------|--------|-------|
| All packages release | No, only changed | Yes, always |
| Version sync | When both release | Always |
| Independent releases | Yes | No |

## Multiple Groups

```json
{
  "linked": [
    ["@myorg/ui-*"],
    ["@myorg/utils-*"]
  ],
  "fixed": [
    ["@myorg/core", "@myorg/core-types"]
  ]
}
```

Groups are independent. A package can only be in one group.

## Changeset for Multiple Packages

Single changeset can affect multiple packages:

```markdown
---
"@myorg/cli": minor
"@myorg/core": patch
"@myorg/utils": patch
---

Add verbose logging flag.

CLI gets new --verbose flag.
Core and utils get internal logging support.
```

Multiple changesets can also target same package — they combine
using highest bump type.
