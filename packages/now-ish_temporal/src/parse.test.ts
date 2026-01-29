import {Temporal} from '@js-temporal/polyfill';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {parse} from './index.js';

describe('parse', () => {
	beforeEach(() => {
		const fixedTime = Temporal.ZonedDateTime.from('2024-03-15T10:30:45.123[UTC]');
		vi.spyOn(Temporal.Now, 'zonedDateTimeISO').mockReturnValue(fixedTime);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('parses expression with offset and rounding', () => {
		const result = parse('now-7d/d');

		expect(result.year).toBe(2024);
		expect(result.month).toBe(3);
		expect(result.day).toBe(8);
		expect(result.hour).toBe(0);
	});

	it('respects rounding direction', () => {
		const down = parse('now/d', 'round-down');
		const up = parse('now/d', 'round-up');

		expect(down.hour).toBe(0);
		expect(up.hour).toBe(23);
	});
});
