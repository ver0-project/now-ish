<div align="center">
<h1>now-ish</h1>
<p><br/>Parse relative time expressions like <code>now-7d</code> or <code>now/w</code></p>
</div>

## Quick Start

Pick the adapter for your date library:

```bash
# date-fns users
npm install @ver0/now-ish_date-fns @ver0/now-ish

# Temporal API users
npm install @ver0/now-ish_temporal @ver0/now-ish
```

```typescript
import {parse} from '@ver0/now-ish_date-fns';

const sevenDaysAgo = parse('now-7d');
const startOfToday = parse('now/d');
const endOfMonth = parse('now/mo', 'round-up');
```

## Packages

| Package | Description |
|---------|-------------|
| [@ver0/now-ish](./packages/now-ish) | Core parser — expression syntax, extensibility, types |
| [@ver0/now-ish_date-fns](./packages/now-ish_date-fns) | date-fns adapter — returns `TZDate` |
| [@ver0/now-ish_temporal](./packages/now-ish_temporal) | Temporal API adapter — returns `ZonedDateTime` |

## Expression Syntax

```
now[/round][±Nunit[/round]]
```

- `now-7d` → 7 days ago
- `now/d` → start of today
- `now-7d/d` → start of day, 7 days ago
- `now/mo+1mo/mo` → start of next month

See the [core package](./packages/now-ish) for the complete syntax guide.

## License

[MIT](./LICENSE)
