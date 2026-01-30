<div align="center">
<h1>@ver0/now-ish_temporal</h1>

[![NPM Version](https://img.shields.io/npm/v/%40ver0%2Fnow-ish_temporal?style=flat-square)](https://www.npmjs.com/package/@ver0/now-ish_temporal)
[![NPM Downloads](https://img.shields.io/npm/dm/%40ver0%2Fnow-ish_temporal?style=flat-square)](https://www.npmjs.com/package/@ver0/now-ish_temporal)
[![Dependents (via libraries.io), scoped npm package](https://img.shields.io/librariesio/dependents/npm/%40ver0/now-ish_temporal?style=flat-square)](https://www.npmjs.com/package/@ver0/now-ish_temporal)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/ver0-project/now-ish/ci.yml?style=flat-square)](https://github.com/ver0-project/now-ish/actions)
[![NPM Type Definitions](https://img.shields.io/npm/types/%40ver0%2Fnow-ish_temporal?style=flat-square)](https://www.npmjs.com/package/@ver0/now-ish_temporal)

<p><br/>Temporal API adapter for <a href="https://github.com/ver0-project/now-ish">@ver0/now-ish</a></p>
</div>

This package connects [@ver0/now-ish](https://github.com/ver0-project/now-ish) to the Temporal API. It provides a
ready-to-use `parse` function that turns expressions like `now-7d/d` into `Temporal.ZonedDateTime` objects with
nanosecond precision.

If you prefer the modern Temporal API over date-fns, this is the adapter for you.

### Installation

```bash
npm install @ver0/now-ish_temporal @ver0/now-ish
```

> `@ver0/now-ish` is a peer dependency.

This package uses `@js-temporal/polyfill` until Temporal becomes available natively in JavaScript engines.

### How to use

The default parser uses **UTC** timezone and recognizes the `now` keyword.

```typescript
import {parse} from '@ver0/now-ish_temporal';

const sevenDaysAgo = parse('now-7d');
const startOfToday = parse('now/d');
const startOfLastWeek = parse('now-1w/w');

// Round to end of period instead of start
const endOfMonth = parse('now/mo', 'round-up');

// Override timezone per call
const tokyoMidnight = parse('now/d', 'round-down', {timezone: 'Asia/Tokyo'});
```

For the full expression syntax, see the [core package documentation](https://github.com/ver0-project/now-ish).

### Supported units

`ms` (millisecond), `s` (second), `m` (minute), `h` (hour), `d` (day), `w` (week), `mo` (month), `y` (year)

Weeks follow ISO 8601 — they start on Monday.

### Custom configuration

You can create a custom parser with a different default timezone, localized keywords, or additional units.

**Adding `now` aliases:**

```typescript
import {createParser} from '@ver0/now-ish';
import {now, units} from '@ver0/now-ish_temporal';

const parse = createParser({
	now,
	units,
	nowAliases: ['now', 'jetzt', 'сейчас'],
	timezone: 'Europe/Berlin',
});

parse('jetzt-7d'); // works
```

**Adding unit aliases:**

```typescript
import {createParser} from '@ver0/now-ish';
import {now, units} from '@ver0/now-ish_temporal';

// Add aliases for existing units
const extendedUnits = new Map(units);
extendedUnits.set('t', units.get('d')!); // German: Tag = day
extendedUnits.set('wo', units.get('w')!); // German: Woche = week

const parse = createParser({
	now,
	units: extendedUnits,
	nowAliases: ['now', 'jetzt'],
	timezone: 'UTC',
});

parse('jetzt-7t'); // 7 days ago
```

### Why Temporal?

The [TC39 Temporal proposal](https://tc39.es/proposal-temporal/docs/) addresses long-standing issues with JavaScript's
`Date` object: immutability, nanosecond precision, first-class timezone support, and unambiguous DST handling.

While Temporal is not yet natively available, the polyfill provides full functionality today.

### Related

- [@ver0/now-ish](https://github.com/ver0-project/now-ish) — Core parser, expression syntax, extensibility
- [@ver0/now-ish_date-fns](https://github.com/ver0-project/now-ish/tree/master/packages/now-ish_date-fns) — date-fns
  adapter
