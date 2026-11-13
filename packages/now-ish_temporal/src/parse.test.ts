import {Temporal as TemporalPolyfill} from '@js-temporal/polyfill';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vite-plus/test';
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

describe('Temporal implementation', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('returns the objects of the runtime Temporal', () => {
		expect(parse('now-1d/d')).toBeInstanceOf(Temporal.ZonedDateTime);
	});

	it('returns the objects of the polyfill on a runtime without Temporal', () => {
		vi.stubGlobal('Temporal', undefined);

		const result = parse('now-1d/d', 'round-up', {timezone: 'Asia/Tokyo'});

		expect(result).toBeInstanceOf(TemporalPolyfill.ZonedDateTime);
		expect(result.timeZoneId).toBe('Asia/Tokyo');
		expect(result.toPlainTime().toString()).toBe('23:59:59.999999999');
	});
});
