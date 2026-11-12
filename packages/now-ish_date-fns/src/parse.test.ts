import {afterEach, beforeEach, describe, expect, it, vi} from 'vite-plus/test';
import {parse} from './index.js';

describe('parse', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2024-03-15T10:30:45.123Z'));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('parses expression with offset and rounding', () => {
		const result = parse('now-7d/d');

		expect(result.getUTCFullYear()).toBe(2024);
		expect(result.getUTCMonth()).toBe(2);
		expect(result.getUTCDate()).toBe(8);
		expect(result.getUTCHours()).toBe(0);
	});

	it('respects rounding direction', () => {
		const down = parse('now/d', 'round-down');
		const up = parse('now/d', 'round-up');

		expect(down.getUTCHours()).toBe(0);
		expect(up.getUTCHours()).toBe(23);
	});

	it('throws a RangeError for an unknown timezone', () => {
		expect(() => parse('now', 'round-down', {timezone: 'Mars/Olympus'})).toThrow(RangeError);
	});

	it.each(['now+400000y', 'now-400000y'])('throws a RangeError when %s leaves the range of a Date', (expression) => {
		expect(() => parse(expression)).toThrow(RangeError);
	});
});
