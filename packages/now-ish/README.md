<div align="center">
<h1>@ver0/now-ish</h1>

[![NPM Version](https://img.shields.io/npm/v/%40ver0%2Fnow-ish?style=flat-square)](https://www.npmjs.com/package/@ver0/now-ish)
[![NPM Downloads](https://img.shields.io/npm/dm/%40ver0%2Fnow-ish?style=flat-square)](https://www.npmjs.com/package/@ver0/now-ish)
[![Dependents (via libraries.io), scoped npm package](https://img.shields.io/librariesio/dependents/npm/%40ver0/now-ish?style=flat-square)](https://www.npmjs.com/package/@ver0/now-ish)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/ver0-project/now-ish/ci.yml?style=flat-square)](https://github.com/ver0-project/now-ish/actions)
[![NPM Type Definitions](https://img.shields.io/npm/types/%40ver0%2Fnow-ish?style=flat-square)](https://www.npmjs.com/package/@ver0/now-ish)

<p><br/>Parse relative time expressions like <code>now-7d</code> or <code>now/w</code></p>
</div>

### Features

- ✅ Human-readable time expressions
- ✅ Custom units — define fiscal quarters, business days, or any domain-specific periods
- ✅ Localization — support `now` in any language (`jetzt`, `сейчас`, `ahora`)
- ✅ Timezone-aware operations
- ✅ Works with any date library via adapters
- ✅ Full TypeScript support

### Why this package exists?

The expression syntax is simple enough that you can expose it directly to your users. Instead of building date pickers
or dropdowns with predefined ranges, let users type `now-7d` for "last 7 days" or `now/mo` for "since start of month".
It's readable, compact, and powerful enough for complex ranges like "start of next month" (`now/mo+1mo/mo`).

The syntax is compatible with
[Grafana's relative time expressions](https://grafana.com/docs/grafana/latest/dashboards/use-dashboards/#time-units-and-relative-ranges),
so if you're building dashboards or analytics tools, your users may already be familiar with it.

The parser is fully extensible. You can define custom units like fiscal quarters (`fq`) or business days (`bd`) —
whatever makes sense for your domain. You can also localize both the `now` keyword and unit names, enabling fully
localized expressions: `jetzt-7t` in German, `сейчас-7д` in Russian. The grammar stays the same, but the vocabulary can
be adapted to your audience.

### How expressions work

Every expression starts with `now` — the current moment. From there, you can do two things:

**Offset** — move forward or backward in time by adding or subtracting a duration:

- `now-1d` → one day ago
- `now+2w` → two weeks from now
- `now-30m` → thirty minutes ago

**Round** — snap to the beginning or end of a time period using `/`:

- `now/d` → start of today (midnight)
- `now/w` → start of this week (Monday midnight)
- `now/mo` → first moment of this month

You can combine them. The expression is evaluated left to right:

- `now-7d/d` → go back 7 days, then round to start of that day
- `now/w-1w` → start of this week, then go back one more week
- `now/mo+1mo/mo` → start of this month, add one month, round to start → first moment of next month

When rounding, you choose the direction:

- **round-down** (default) → snaps to the _start_ of the period
- **round-up** → snaps to the _end_ of the period (last nanosecond/millisecond)

This makes it easy to build time ranges: round-down gives you the "from" boundary, round-up gives you the "to" boundary.

### Available Adapters

This is the **core package** — it parses expressions but doesn't know how to do actual date math. For that, you need an
adapter that works with your preferred date library:

| Adapter                                                                                                 | Returns         | Install                                            |
| ------------------------------------------------------------------------------------------------------- | --------------- | -------------------------------------------------- |
| [@ver0/now-ish_date-fns](https://github.com/ver0-project/now-ish/tree/master/packages/now-ish_date-fns) | `TZDate`        | `npm install @ver0/now-ish_date-fns @ver0/now-ish` |
| [@ver0/now-ish_temporal](https://github.com/ver0-project/now-ish/tree/master/packages/now-ish_temporal) | `ZonedDateTime` | `npm install @ver0/now-ish_temporal @ver0/now-ish` |

**Most users should install an adapter directly.** The adapter provides a ready-to-use `parse` function:

```typescript
import {parse} from '@ver0/now-ish_date-fns';

const startOfLastWeek = parse('now-1w/w');
const endOfToday = parse('now/d', 'round-up');
```

### Building a custom adapter

If you need to support a different date library, the core package exports everything you need to build your own adapter.
See the [date-fns adapter source](https://github.com/ver0-project/now-ish/tree/master/packages/now-ish_date-fns/src) for
a complete example.

```typescript
import {createParser} from '@ver0/now-ish';

const parse = createParser({
	now: (ctx) => {},
	units: new Map(),
	timezone: 'UTC',
	nowAliases: ['now'],
});
```
