import {TZDate} from '@date-fns/tz';
import {describe, it, expect, vi, afterEach} from 'vitest';
import {units, now} from './units.js';

/**
 * Helper to create TZDate from ISO string in UTC.
 * Appends 'Z' to ensure the string is interpreted as UTC.
 */
function tz(iso: string): TZDate {
	// Ensure ISO string is treated as UTC by appending Z if not present
	const utcIso = iso.endsWith('Z') ? iso : `${iso}Z`;
	return new TZDate(utcIso, 'UTC');
}

/**
 * Helper to format TZDate for assertions.
 * Matches Temporal's toPlainDateTime().toString() format.
 */
function fmt(date: TZDate): string {
	const y = date.getFullYear();
	const mo = String(date.getMonth() + 1).padStart(2, '0');
	const d = String(date.getDate()).padStart(2, '0');
	const h = String(date.getHours()).padStart(2, '0');
	const m = String(date.getMinutes()).padStart(2, '0');
	const s = String(date.getSeconds()).padStart(2, '0');
	const ms = date.getMilliseconds();
	if (ms > 0) {
		// Trim trailing zeros to match Temporal format: 500 -> ".5", 123 -> ".123"
		const msStr = String(ms).padStart(3, '0').replace(/0+$/, '');
		return `${y}-${mo}-${d}T${h}:${m}:${s}.${msStr}`;
	}

	return `${y}-${mo}-${d}T${h}:${m}:${s}`;
}

type AddCase = {
	name: string;
	input: string;
	amount: number;
	expected: string;
};

type RoundCase = {
	name: string;
	input: string;
	expected: string;
};

describe('units', () => {
	it('should have all expected units', () => {
		const expected = ['ms', 's', 'm', 'h', 'd', 'w', 'mo', 'y'];
		expect([...units.keys()]).toEqual(expected);
	});

	it('should have correct names for each unit', () => {
		const nameMap: Record<string, string> = {
			ms: 'millisecond',
			s: 'second',
			m: 'minute',
			h: 'hour',
			d: 'day',
			w: 'week',
			mo: 'month',
			y: 'year',
		};

		for (const [key, expected] of Object.entries(nameMap)) {
			const unit = units.get(key);
			expect(unit?.name).toBe(expected);
		}
	});
});

describe('millisecond (ms)', () => {
	const unit = units.get('ms')!;
	const ctx = {timezone: 'UTC'};

	describe('add', () => {
		const cases: AddCase[] = [
			{name: 'add positive', input: '2024-03-15T10:30:00.500', amount: 100, expected: '2024-03-15T10:30:00.6'},
			{name: 'overflow to next second', input: '2024-03-15T10:30:00.999', amount: 1, expected: '2024-03-15T10:30:01'},
			{name: 'subtract', input: '2024-03-15T10:30:00.500', amount: -100, expected: '2024-03-15T10:30:00.4'},
			{name: 'add zero', input: '2024-03-15T10:30:00', amount: 0, expected: '2024-03-15T10:30:00'},
		];

		it.each(cases)('$name', (c: AddCase) => {
			const result = unit.add(tz(c.input), c.amount, ctx);
			expect(fmt(result)).toBe(c.expected);
		});
	});

	describe('round-down', () => {
		const cases: RoundCase[] = [
			{name: 'preserves milliseconds', input: '2024-03-15T10:30:00.500', expected: '2024-03-15T10:30:00.5'},
			{name: 'at boundary', input: '2024-03-15T10:30:00', expected: '2024-03-15T10:30:00'},
		];

		it.each(cases)('$name', (c: RoundCase) => {
			const result = unit['round-down'](tz(c.input), ctx);
			expect(fmt(result)).toBe(c.expected);
		});
	});

	describe('round-up', () => {
		const cases: RoundCase[] = [
			// Date has millisecond precision, so round-up returns same value
			{name: 'preserves milliseconds', input: '2024-03-15T10:30:00.500', expected: '2024-03-15T10:30:00.5'},
			{name: 'at boundary', input: '2024-03-15T10:30:00', expected: '2024-03-15T10:30:00'},
		];

		it.each(cases)('$name', (c: RoundCase) => {
			const result = unit['round-up'](tz(c.input), ctx);
			expect(fmt(result)).toBe(c.expected);
		});
	});
});

describe('second (s)', () => {
	const unit = units.get('s')!;
	const ctx = {timezone: 'UTC'};

	describe('add', () => {
		const cases: AddCase[] = [
			{name: 'add positive', input: '2024-03-15T10:30:00', amount: 30, expected: '2024-03-15T10:30:30'},
			{name: 'overflow to next minute', input: '2024-03-15T10:30:59', amount: 1, expected: '2024-03-15T10:31:00'},
			{name: 'subtract', input: '2024-03-15T10:30:00', amount: -30, expected: '2024-03-15T10:29:30'},
		];

		it.each(cases)('$name', (c: AddCase) => {
			const result = unit.add(tz(c.input), c.amount, ctx);
			expect(fmt(result)).toBe(c.expected);
		});
	});

	describe('round-down', () => {
		const cases: RoundCase[] = [
			{name: 'truncate milliseconds', input: '2024-03-15T10:30:45.123', expected: '2024-03-15T10:30:45'},
			{name: 'at boundary', input: '2024-03-15T10:30:45', expected: '2024-03-15T10:30:45'},
		];

		it.each(cases)('$name', (c: RoundCase) => {
			const result = unit['round-down'](tz(c.input), ctx);
			expect(fmt(result)).toBe(c.expected);
		});
	});

	describe('round-up', () => {
		const cases: RoundCase[] = [
			{name: 'mid-second', input: '2024-03-15T10:30:45.123', expected: '2024-03-15T10:30:45.999'},
			{name: 'at boundary', input: '2024-03-15T10:30:45', expected: '2024-03-15T10:30:45.999'},
		];

		it.each(cases)('$name', (c: RoundCase) => {
			const result = unit['round-up'](tz(c.input), ctx);
			expect(fmt(result)).toBe(c.expected);
		});
	});
});

describe('minute (m)', () => {
	const unit = units.get('m')!;
	const ctx = {timezone: 'UTC'};

	describe('add', () => {
		const cases: AddCase[] = [
			{name: 'add positive', input: '2024-03-15T10:30:00', amount: 15, expected: '2024-03-15T10:45:00'},
			{name: 'overflow to next hour', input: '2024-03-15T10:59:00', amount: 1, expected: '2024-03-15T11:00:00'},
			{name: 'subtract', input: '2024-03-15T10:30:00', amount: -30, expected: '2024-03-15T10:00:00'},
		];

		it.each(cases)('$name', (c: AddCase) => {
			const result = unit.add(tz(c.input), c.amount, ctx);
			expect(fmt(result)).toBe(c.expected);
		});
	});

	describe('round-down', () => {
		const cases: RoundCase[] = [
			{name: 'truncate seconds', input: '2024-03-15T10:30:45.123', expected: '2024-03-15T10:30:00'},
			{name: 'at boundary', input: '2024-03-15T10:30:00', expected: '2024-03-15T10:30:00'},
		];

		it.each(cases)('$name', (c: RoundCase) => {
			const result = unit['round-down'](tz(c.input), ctx);
			expect(fmt(result)).toBe(c.expected);
		});
	});

	describe('round-up', () => {
		const cases: RoundCase[] = [
			{name: 'mid-minute', input: '2024-03-15T10:30:45.123', expected: '2024-03-15T10:30:59.999'},
			{name: 'at boundary', input: '2024-03-15T10:30:00', expected: '2024-03-15T10:30:59.999'},
		];

		it.each(cases)('$name', (c: RoundCase) => {
			const result = unit['round-up'](tz(c.input), ctx);
			expect(fmt(result)).toBe(c.expected);
		});
	});
});

describe('hour (h)', () => {
	const unit = units.get('h')!;
	const ctx = {timezone: 'UTC'};

	describe('add', () => {
		const cases: AddCase[] = [
			{name: 'add positive', input: '2024-03-15T10:30:00', amount: 2, expected: '2024-03-15T12:30:00'},
			{name: 'overflow to next day', input: '2024-03-15T23:00:00', amount: 1, expected: '2024-03-16T00:00:00'},
			{name: 'subtract', input: '2024-03-15T10:30:00', amount: -10, expected: '2024-03-15T00:30:00'},
		];

		it.each(cases)('$name', (c: AddCase) => {
			const result = unit.add(tz(c.input), c.amount, ctx);
			expect(fmt(result)).toBe(c.expected);
		});
	});

	describe('round-down', () => {
		const cases: RoundCase[] = [
			{name: 'truncate minutes', input: '2024-03-15T10:30:45.123', expected: '2024-03-15T10:00:00'},
			{name: 'at boundary', input: '2024-03-15T10:00:00', expected: '2024-03-15T10:00:00'},
		];

		it.each(cases)('$name', (c: RoundCase) => {
			const result = unit['round-down'](tz(c.input), ctx);
			expect(fmt(result)).toBe(c.expected);
		});
	});

	describe('round-up', () => {
		const cases: RoundCase[] = [
			{name: 'mid-hour', input: '2024-03-15T10:30:45.123', expected: '2024-03-15T10:59:59.999'},
			{name: 'at boundary', input: '2024-03-15T10:00:00', expected: '2024-03-15T10:59:59.999'},
		];

		it.each(cases)('$name', (c: RoundCase) => {
			const result = unit['round-up'](tz(c.input), ctx);
			expect(fmt(result)).toBe(c.expected);
		});
	});
});

describe('day (d)', () => {
	const unit = units.get('d')!;
	const ctx = {timezone: 'UTC'};

	describe('add', () => {
		const cases: AddCase[] = [
			{name: 'add one day', input: '2024-03-15T10:30:00', amount: 1, expected: '2024-03-16T10:30:00'},
			{name: 'cross month boundary', input: '2024-03-31T10:00:00', amount: 1, expected: '2024-04-01T10:00:00'},
			{name: 'subtract into leap year Feb', input: '2024-03-15T10:30:00', amount: -15, expected: '2024-02-29T10:30:00'},
			{name: 'subtract into non-leap Feb', input: '2023-03-15T10:30:00', amount: -15, expected: '2023-02-28T10:30:00'},
		];

		it.each(cases)('$name', (c: AddCase) => {
			const result = unit.add(tz(c.input), c.amount, ctx);
			expect(fmt(result)).toBe(c.expected);
		});
	});

	describe('round-down', () => {
		const cases: RoundCase[] = [
			{name: 'mid-day', input: '2024-03-15T10:30:45.123', expected: '2024-03-15T00:00:00'},
			{name: 'at midnight', input: '2024-03-15T00:00:00', expected: '2024-03-15T00:00:00'},
			{name: 'end of day', input: '2024-03-15T23:59:59.999', expected: '2024-03-15T00:00:00'},
		];

		it.each(cases)('$name', (c: RoundCase) => {
			const result = unit['round-down'](tz(c.input), ctx);
			expect(fmt(result)).toBe(c.expected);
		});
	});

	describe('round-up', () => {
		const cases: RoundCase[] = [
			{name: 'mid-day', input: '2024-03-15T10:30:45.123', expected: '2024-03-15T23:59:59.999'},
			{name: 'at midnight', input: '2024-03-15T00:00:00', expected: '2024-03-15T23:59:59.999'},
		];

		it.each(cases)('$name', (c: RoundCase) => {
			const result = unit['round-up'](tz(c.input), ctx);
			expect(fmt(result)).toBe(c.expected);
		});
	});
});

describe('week (w)', () => {
	const unit = units.get('w')!;
	const ctx = {timezone: 'UTC'};

	describe('add', () => {
		const cases: AddCase[] = [
			{name: 'add one week', input: '2024-03-15T10:30:00', amount: 1, expected: '2024-03-22T10:30:00'},
			{name: 'subtract one week', input: '2024-03-15T10:30:00', amount: -1, expected: '2024-03-08T10:30:00'},
			{name: 'add two weeks', input: '2024-03-15T10:30:00', amount: 2, expected: '2024-03-29T10:30:00'},
		];

		it.each(cases)('$name', (c: AddCase) => {
			const result = unit.add(tz(c.input), c.amount, ctx);
			expect(fmt(result)).toBe(c.expected);
		});
	});

	describe('round-down (start of week, Monday)', () => {
		const cases: RoundCase[] = [
			{name: 'Friday to Monday', input: '2024-03-15T10:30:45.123', expected: '2024-03-11T00:00:00'},
			{name: 'Monday stays Monday', input: '2024-03-11T10:30:00', expected: '2024-03-11T00:00:00'},
			{name: 'Sunday to Monday', input: '2024-03-17T23:59:59', expected: '2024-03-11T00:00:00'},
			{name: 'Saturday to Monday', input: '2024-03-16T12:00:00', expected: '2024-03-11T00:00:00'},
			{name: 'Tuesday to Monday', input: '2024-03-12T12:00:00', expected: '2024-03-11T00:00:00'},
		];

		it.each(cases)('$name', (c: RoundCase) => {
			const result = unit['round-down'](tz(c.input), ctx);
			expect(fmt(result)).toBe(c.expected);
		});
	});

	describe('round-up (end of week, Sunday)', () => {
		const cases: RoundCase[] = [
			{name: 'Friday to Sunday end', input: '2024-03-15T10:30:45.123', expected: '2024-03-17T23:59:59.999'},
			{name: 'Monday to Sunday end', input: '2024-03-11T00:00:00', expected: '2024-03-17T23:59:59.999'},
			{name: 'Sunday stays Sunday', input: '2024-03-17T10:00:00', expected: '2024-03-17T23:59:59.999'},
		];

		it.each(cases)('$name', (c: RoundCase) => {
			const result = unit['round-up'](tz(c.input), ctx);
			expect(fmt(result)).toBe(c.expected);
		});
	});
});

describe('month (mo)', () => {
	const unit = units.get('mo')!;
	const ctx = {timezone: 'UTC'};

	describe('add', () => {
		const cases: AddCase[] = [
			{name: 'add one month', input: '2024-03-15T10:30:00', amount: 1, expected: '2024-04-15T10:30:00'},
			{name: 'clamp to end of shorter month', input: '2024-03-31T10:00:00', amount: 1, expected: '2024-04-30T10:00:00'},
			{name: 'Jan 31 to leap Feb 29', input: '2024-01-31T10:00:00', amount: 1, expected: '2024-02-29T10:00:00'},
			{name: 'Jan 31 to non-leap Feb 28', input: '2023-01-31T10:00:00', amount: 1, expected: '2023-02-28T10:00:00'},
			{name: 'subtract across year', input: '2024-03-15T10:30:00', amount: -3, expected: '2023-12-15T10:30:00'},
			{name: 'add full year', input: '2024-03-15T10:30:00', amount: 12, expected: '2025-03-15T10:30:00'},
		];

		it.each(cases)('$name', (c: AddCase) => {
			const result = unit.add(tz(c.input), c.amount, ctx);
			expect(fmt(result)).toBe(c.expected);
		});
	});

	describe('round-down (start of month)', () => {
		const cases: RoundCase[] = [
			{name: 'mid-month', input: '2024-03-15T10:30:45.123', expected: '2024-03-01T00:00:00'},
			{name: 'at first of month', input: '2024-03-01T00:00:00', expected: '2024-03-01T00:00:00'},
			{name: 'leap year Feb 29', input: '2024-02-29T23:59:59', expected: '2024-02-01T00:00:00'},
			{name: 'end of year', input: '2024-12-31T23:59:59', expected: '2024-12-01T00:00:00'},
		];

		it.each(cases)('$name', (c: RoundCase) => {
			const result = unit['round-down'](tz(c.input), ctx);
			expect(fmt(result)).toBe(c.expected);
		});
	});

	describe('round-up (end of month)', () => {
		const cases: RoundCase[] = [
			{name: 'mid-month 31 days', input: '2024-03-15T10:30:45.123', expected: '2024-03-31T23:59:59.999'},
			{name: 'leap Feb has 29 days', input: '2024-02-15T10:00:00', expected: '2024-02-29T23:59:59.999'},
			{name: 'non-leap Feb has 28 days', input: '2023-02-15T10:00:00', expected: '2023-02-28T23:59:59.999'},
			{name: '30-day month', input: '2024-04-15T10:00:00', expected: '2024-04-30T23:59:59.999'},
			{name: 'first of month', input: '2024-01-01T00:00:00', expected: '2024-01-31T23:59:59.999'},
		];

		it.each(cases)('$name', (c: RoundCase) => {
			const result = unit['round-up'](tz(c.input), ctx);
			expect(fmt(result)).toBe(c.expected);
		});
	});
});

describe('year (y)', () => {
	const unit = units.get('y')!;
	const ctx = {timezone: 'UTC'};

	describe('add', () => {
		const cases: AddCase[] = [
			{name: 'add one year', input: '2024-03-15T10:30:00', amount: 1, expected: '2025-03-15T10:30:00'},
			{
				name: 'leap to non-leap clamps Feb 29',
				input: '2024-02-29T10:00:00',
				amount: 1,
				expected: '2025-02-28T10:00:00',
			},
			{name: 'leap to leap preserves Feb 29', input: '2024-02-29T10:00:00', amount: 4, expected: '2028-02-29T10:00:00'},
			{name: 'subtract one year', input: '2024-03-15T10:30:00', amount: -1, expected: '2023-03-15T10:30:00'},
			{name: 'add ten years', input: '2024-03-15T10:30:00', amount: 10, expected: '2034-03-15T10:30:00'},
		];

		it.each(cases)('$name', (c: AddCase) => {
			const result = unit.add(tz(c.input), c.amount, ctx);
			expect(fmt(result)).toBe(c.expected);
		});
	});

	describe('round-down (start of year)', () => {
		const cases: RoundCase[] = [
			{name: 'mid-year', input: '2024-03-15T10:30:45.123', expected: '2024-01-01T00:00:00'},
			{name: 'at Jan 1', input: '2024-01-01T00:00:00', expected: '2024-01-01T00:00:00'},
			{name: 'end of year', input: '2024-12-31T23:59:59.999', expected: '2024-01-01T00:00:00'},
		];

		it.each(cases)('$name', (c: RoundCase) => {
			const result = unit['round-down'](tz(c.input), ctx);
			expect(fmt(result)).toBe(c.expected);
		});
	});

	describe('round-up (end of year)', () => {
		const cases: RoundCase[] = [
			{name: 'mid-year', input: '2024-03-15T10:30:45.123', expected: '2024-12-31T23:59:59.999'},
			{name: 'at Jan 1', input: '2024-01-01T00:00:00', expected: '2024-12-31T23:59:59.999'},
			{name: 'mid-year different year', input: '2023-06-15T12:00:00', expected: '2023-12-31T23:59:59.999'},
		];

		it.each(cases)('$name', (c: RoundCase) => {
			const result = unit['round-up'](tz(c.input), ctx);
			expect(fmt(result)).toBe(c.expected);
		});
	});
});

describe('now', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('returns TZDate in specified timezone', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2024-03-15T10:30:00Z'));

		const result = now({timezone: 'UTC'});

		expect(result.timeZone).toBe('UTC');
		expect(fmt(result)).toBe('2024-03-15T10:30:00');

		vi.useRealTimers();
	});

	it('passes timezone to TZDate', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2024-03-15T10:30:00Z'));

		const result = now({timezone: 'Europe/Moscow'});

		expect(result.timeZone).toBe('Europe/Moscow');
		// Moscow is UTC+3, so 10:30 UTC = 13:30 Moscow
		expect(fmt(result)).toBe('2024-03-15T13:30:00');

		vi.useRealTimers();
	});
});

describe('timezone handling', () => {
	const ctx = {timezone: 'America/New_York'};

	it('day operations respect timezone', () => {
		const unit = units.get('d')!;
		// Create midnight on March 15 in New York timezone using static method
		// TZDate.tz(tz, year, month, date, hours, minutes, seconds)
		// month is 0-indexed, so March = 2
		const midnight = TZDate.tz('America/New_York', 2024, 2, 15, 0, 0, 0);

		const startOfDay = unit['round-down'](midnight, ctx);
		expect(fmt(startOfDay)).toBe('2024-03-15T00:00:00');

		const endOfDay = unit['round-up'](midnight, ctx);
		expect(fmt(endOfDay)).toBe('2024-03-15T23:59:59.999');
	});

	it('week operations respect timezone', () => {
		const unit = units.get('w')!;
		// Friday noon in New York timezone
		const friday = TZDate.tz('America/New_York', 2024, 2, 15, 12, 0, 0);

		const startOfWeek = unit['round-down'](friday, ctx);
		// Monday of the same week
		expect(startOfWeek.getDate()).toBe(11);
		expect(startOfWeek.getHours()).toBe(0);

		const endOfWeek = unit['round-up'](friday, ctx);
		// Sunday end
		expect(endOfWeek.getDate()).toBe(17);
		expect(endOfWeek.getHours()).toBe(23);
	});
});
