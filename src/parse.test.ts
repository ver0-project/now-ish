import {UTCDate} from '@date-fns/utc';
import {afterEach, beforeEach, describe, expect, test, vi} from 'vitest';
import {parseRelativeTimePoint} from './parse.js';

describe('parseRelativeTimePoint', () => {
	const now = new UTCDate('2024-12-13T17:43:10.555Z');
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(now);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	now.getDay();

	test.each<{
		args: Parameters<typeof parseRelativeTimePoint>;
		want: ReturnType<typeof parseRelativeTimePoint>;
	}>([
		{args: ['now'], want: new UTCDate('2024-12-13T17:43:10.555Z').getTime()},
		{args: ['now-1s'], want: new UTCDate('2024-12-13T17:43:09.555Z').getTime()},
		{args: ['now+5s'], want: new UTCDate('2024-12-13T17:43:15.555Z').getTime()},
		{args: ['now/w'], want: new UTCDate('2024-12-09T00:00:00Z').getTime()},
		{args: ['now/w', true], want: new UTCDate('2024-12-15T23:59:59.999Z').getTime()},
		{args: ['now-25d/mo'], want: new UTCDate('2024-11-01T00:00:00Z').getTime()},
	])('$args', ({args, want}) => {
		expect(parseRelativeTimePoint(...args)).toBe(want);
	});
});

describe('round down', () => {
	const now = new UTCDate('2024-12-13T17:43:10.555Z');
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(now);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	now.getDay();

	test.each<{
		str: string;
		want: ReturnType<typeof parseRelativeTimePoint>;
	}>([
		{str: 'now/ms', want: new UTCDate('2024-12-13T17:43:10.555Z').getTime()},
		{str: 'now/s', want: new UTCDate('2024-12-13T17:43:10Z').getTime()},
		{str: 'now/m', want: new UTCDate('2024-12-13T17:43:00Z').getTime()},
		{str: 'now/h', want: new UTCDate('2024-12-13T17:00:00Z').getTime()},
		{str: 'now/w', want: new UTCDate('2024-12-09T00:00:00Z').getTime()},
		{str: 'now/mo', want: new UTCDate('2024-12-01T00:00:00Z').getTime()},
		{str: 'now/y', want: new UTCDate('2024-01-01T00:00:00Z').getTime()},
	])('$str', ({str, want}) => {
		expect(parseRelativeTimePoint(str)).toBe(want);
	});
});

describe('round up', () => {
	const now = new UTCDate('2024-12-13T17:43:10.555Z');
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(now);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	now.getDay();

	test.each<{
		str: string;
		want: ReturnType<typeof parseRelativeTimePoint>;
	}>([
		{str: 'now/ms', want: new UTCDate('2024-12-13T17:43:10.555Z').getTime()},
		{str: 'now/s', want: new UTCDate('2024-12-13T17:43:10.999Z').getTime()},
		{str: 'now/m', want: new UTCDate('2024-12-13T17:43:59.999Z').getTime()},
		{str: 'now/h', want: new UTCDate('2024-12-13T17:59:59.999Z').getTime()},
		{str: 'now/w', want: new UTCDate('2024-12-15T23:59:59.999Z').getTime()},
		{str: 'now/mo', want: new UTCDate('2024-12-31T23:59:59.999Z').getTime()},
		{str: 'now/y', want: new UTCDate('2024-12-31T23:59:59.999Z').getTime()},
	])('round up $str', ({str, want}) => {
		expect(parseRelativeTimePoint(str, true)).toBe(want);
	});
});
