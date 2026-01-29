---
name: changesets
description: >-
  Manage package versioning and changelogs with Changesets. Use when: making
  code changes that need versioning, preparing releases, adding changeset
  files, running version/publish commands, configuring .changeset/config.json,
  working with monorepo package releases, or discussing semver bump types.
---

# Changesets

Manage semantic versioning and changelogs for packages.

## Quick Reference

| Task | Command |
|------|---------|
| Add changeset | `yarn changeset` |
| Version packages | `yarn changeset version` |
| Publish packages | `yarn changeset publish` |
| Check status | `yarn changeset status` |

## When to Add a Changeset

Add a changeset when changes affect:
- Public API (exports, function signatures)
- Behavior users depend on
- Bug fixes users will notice
- New features

**Skip changesets for:**
- Internal refactoring with no API/behavior change
- Test-only changes
- Documentation updates
- CI/build config changes

## Creating Changesets

### File Format

Changesets are markdown files with YAML frontmatter in `.changeset/`:

```markdown
---
"package-name": patch
---

Brief description of the change.
```

### Bump Types (semver)

- **major** — breaking changes (API removal, behavior change)
- **minor** — new features (backward compatible)
- **patch** — bug fixes, internal improvements

### Writing Good Summaries

Include:
1. WHAT changed
2. WHY it changed
3. HOW consumers should update (if needed)

```markdown
---
"@nowish/core": minor
---

Add `roundUp` parameter to `parseRelativeTimePoint()`.

Allows rounding to end of period instead of start.
No changes needed for existing code — defaults to
previous behavior.
```

### Monorepo: Multiple Packages

```markdown
---
"@myorg/cli": minor
"@myorg/core": patch
---

Add new `--verbose` flag to CLI.

Core package gets internal logging improvements
to support the new flag.
```

## Release Workflow

### 1. Development Phase
Contributors add changesets with their PRs.

### 2. Version Phase
```bash
yarn changeset version
```
- Consumes all changesets
- Updates package versions
- Writes changelog entries
- Review changes before committing

### 3. Publish Phase
```bash
yarn changeset publish
git push --follow-tags
```

## References

| Topic | When to Read |
|-------|--------------|
| [Commands](references/commands.md) | CLI usage details |
| [Config](references/config.md) | Setting up `.changeset/config.json` |
| [Monorepo](references/monorepo.md) | Linked/fixed packages, dependencies |
| [Prereleases](references/prereleases.md) | RC, beta, snapshot releases |
| [Automation](references/automation.md) | CI/CD integration |
