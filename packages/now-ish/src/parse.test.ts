import type {Time, Timezone} from '@ver0/now-ish_date-fns';
import {now, nowAliases, units} from '@ver0/now-ish_date-fns';
import {afterEach, beforeEach, describe, expect, test, vi} from 'vitest';
import type {Parser, RoundingDirection} from './parse.js';
import {createParser, ParseError, parseStructure} from './parse.js';

type ParseCase = {expr: string; dir: RoundingDirection; expected: string};

function fmt(d: Time): string {
	return d
		.toISOString()
		.replace(/(\+00:00|Z)$/, '')
		.replace(/\.000$/, '');
}

describe('ParseError', () => {
	test('invalid-structure', () => {
		const err = new ParseError('invalid-structure', 'foo bar');
		expect(err.kind).toBe('invalid-structure');
		expect(err.value).toBe('foo bar');
		expect(err.position).toBeUndefined();
		expect(err.message).toBe("invalid expression: 'foo bar'");
	});

	test('invalid-value', () => {
		const err = new ParseError('invalid-value', 'q', 'now-rounding');
		expect(err.kind).toBe('invalid-value');
		expect(err.value).toBe('q');
		expect(err.position).toBe('now-rounding');
		expect(err.message).toBe("invalid now-rounding: 'q'");
	});

	test('extends Error', () => {
		const err = new ParseError('invalid-structure', 'x');
		expect(err).toBeInstanceOf(Error);
		expect(err.name).toBe('ParseError');
	});
});

describe('parseStructure', () => {
	const cases = [
		{input: 'now', expected: {now: 'now'}},
		{input: 'now/d', expected: {now: 'now', nowRounding: 'd'}},
		{input: 'now-1d', expected: {now: 'now', offset: {amount: -1, unit: 'd'}}},
		{input: 'now+5h', expected: {now: 'now', offset: {amount: 5, unit: 'h'}}},
		{
			input: 'now/w-1d/mo',
			expected: {now: 'now', nowRounding: 'w', offset: {amount: -1, unit: 'd'}, finalRounding: 'mo'},
		},
		{input: 'сейчас', expected: {now: 'сейчас'}},
		{input: 'now-1día', expected: {now: 'now', offset: {amount: -1, unit: 'día'}}},
		{
			input: 'jetzt/Woche-2Tage/Monat',
			expected: {now: 'jetzt', nowRounding: 'Woche', offset: {amount: -2, unit: 'Tage'}, finalRounding: 'Monat'},
		},
	];

	test.each(cases)('$input', ({input, expected}) => {
		expect(parseStructure(input)).toEqual(expected);
	});

	test.each(['', 'foo bar', '/d', 'now/d/mo'])('throws on %s', (input) => {
		expect(() => parseStructure(input)).toThrow(ParseError);
	});
});

describe('createParser', () => {
	test('throws if nowAliases is empty', () => {
		expect(() => createParser({now, units, timezone: 'UTC', nowAliases: []})).toThrow('nowAliases must not be empty');
	});

	test('throws if units is empty', () => {
		expect(() => createParser({now, units: new Map(), timezone: 'UTC', nowAliases: ['now']})).toThrow(
			'units must not be empty',
		);
	});
});

describe('parser behavior', () => {
	let parse: Parser<Time, Timezone>;

	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2024-03-15T10:30:45.123Z')); // Friday
		parse = createParser({now, units, nowAliases, timezone: 'UTC'});
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	const cases: ParseCase[] = [
		{expr: 'now', dir: 'round-down', expected: '2024-03-15T10:30:45.123'},
		{expr: 'now/d', dir: 'round-down', expected: '2024-03-15T00:00:00'},
		{expr: 'now/d', dir: 'round-up', expected: '2024-03-15T23:59:59.999'},
		{expr: 'now/h', dir: 'round-up', expected: '2024-03-15T10:59:59.999'},
		{expr: 'now/w', dir: 'round-down', expected: '2024-03-11T00:00:00'},
		{expr: 'now/w', dir: 'round-up', expected: '2024-03-17T23:59:59.999'},
		{expr: 'now/mo', dir: 'round-down', expected: '2024-03-01T00:00:00'},
		{expr: 'now/mo', dir: 'round-up', expected: '2024-03-31T23:59:59.999'},
		{expr: 'now/y', dir: 'round-down', expected: '2024-01-01T00:00:00'},
		{expr: 'now-1d', dir: 'round-down', expected: '2024-03-14T10:30:45.123'},
		{expr: 'now+1d', dir: 'round-down', expected: '2024-03-16T10:30:45.123'},
		{expr: 'now-7d', dir: 'round-down', expected: '2024-03-08T10:30:45.123'},
		{expr: 'now+5h', dir: 'round-down', expected: '2024-03-15T15:30:45.123'},
		{expr: 'now-30m', dir: 'round-down', expected: '2024-03-15T10:00:45.123'},
		{expr: 'now-1mo', dir: 'round-down', expected: '2024-02-15T10:30:45.123'},
		{expr: 'now+1y', dir: 'round-down', expected: '2025-03-15T10:30:45.123'},
		{expr: 'now/d-1d', dir: 'round-down', expected: '2024-03-14T00:00:00'},
		{expr: 'now/d+1d', dir: 'round-down', expected: '2024-03-16T00:00:00'},
		{expr: 'now-7d/d', dir: 'round-down', expected: '2024-03-08T00:00:00'},
		{expr: 'now-7d/d', dir: 'round-up', expected: '2024-03-08T23:59:59.999'},
		{expr: 'now-1mo/mo', dir: 'round-down', expected: '2024-02-01T00:00:00'},
		{expr: 'now-25d/mo', dir: 'round-down', expected: '2024-02-01T00:00:00'},
		{expr: 'now+1mo/y', dir: 'round-down', expected: '2024-01-01T00:00:00'},
		{expr: 'now-7d/w', dir: 'round-up', expected: '2024-03-10T23:59:59.999'},
		{expr: 'now/w-1d/d', dir: 'round-down', expected: '2024-03-10T00:00:00'},
		{expr: 'now/mo+1mo/mo', dir: 'round-down', expected: '2024-04-01T00:00:00'},
	];

	test.each(cases)('$expr ($dir) → $expected', ({expr, dir, expected}) => {
		expect(fmt(parse(expr, dir))).toBe(expected);
	});

	test.each([
		{expr: 'heute', message: "invalid now-keyword: 'heute'"},
		{expr: 'now/x', message: "invalid now-rounding: 'x'"},
		{expr: 'now-1x', message: "invalid offset: 'x'"},
		{expr: 'now-1d/x', message: "invalid final-rounding: 'x'"},
	])('$expr throws $message', ({expr, message}) => {
		expect(() => parse(expr)).toThrow(ParseError);
		expect(() => parse(expr)).toThrow(message);
	});

	test('custom now aliases', () => {
		const customParse = createParser({now, units, timezone: 'UTC', nowAliases: ['now', 'heute', 'сейчас']});
		expect(fmt(customParse('heute'))).toBe('2024-03-15T10:30:45.123');
		expect(fmt(customParse('сейчас'))).toBe('2024-03-15T10:30:45.123');
	});
});
