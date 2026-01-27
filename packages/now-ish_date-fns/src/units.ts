import {TZDate} from '@date-fns/tz';
import {
	addMilliseconds,
	addSeconds,
	addMinutes,
	addHours,
	addDays,
	addWeeks,
	addMonths,
	addYears,
	startOfSecond,
	startOfMinute,
	startOfHour,
	startOfDay,
	startOfISOWeek,
	startOfMonth,
	startOfYear,
	endOfSecond,
	endOfMinute,
	endOfHour,
	endOfDay,
	endOfISOWeek,
	endOfMonth,
	endOfYear,
} from 'date-fns';
import type {ParseContext, UnitDefinition} from '@ver0/now-ish';

/**
 * date-fns adapter timezone type.
 * Accepts IANA timezone strings (e.g., 'UTC', 'Europe/Moscow').
 */
export type Timezone = string;

/**
 * Time type for date-fns adapter.
 * TZDate carries timezone context for timezone-aware operations.
 */
export type Time = TZDate;

/**
 * Unit definition type for date-fns adapter.
 */
export type Unit = UnitDefinition<Time, Timezone>;

/**
 * Creates a context function for date-fns operations.
 * This ensures all date operations respect the timezone.
 */
function tzContext(ctx: ParseContext<Timezone>) {
	return {
		in(value: Date | number | string) {
			// Normalize to timestamp for TZDate constructor
			const ts = typeof value === 'number' ? value : new Date(value).getTime();
			return new TZDate(ts, ctx.timezone);
		},
	};
}

const millisecond: Unit = {
	name: 'millisecond',
	add: (time, amount, ctx) => addMilliseconds(time, amount, tzContext(ctx)),
	// Date has millisecond precision - round-up and round-down return the same value
	'round-up': (time, ctx) => new TZDate(time.getTime(), ctx.timezone),
	'round-down': (time, ctx) => new TZDate(time.getTime(), ctx.timezone),
};

const second: Unit = {
	name: 'second',
	add: (time, amount, ctx) => addSeconds(time, amount, tzContext(ctx)),
	'round-up': (time, ctx) => endOfSecond(time, tzContext(ctx)),
	'round-down': (time, ctx) => startOfSecond(time, tzContext(ctx)),
};

const minute: Unit = {
	name: 'minute',
	add: (time, amount, ctx) => addMinutes(time, amount, tzContext(ctx)),
	'round-up': (time, ctx) => endOfMinute(time, tzContext(ctx)),
	'round-down': (time, ctx) => startOfMinute(time, tzContext(ctx)),
};

const hour: Unit = {
	name: 'hour',
	add: (time, amount, ctx) => addHours(time, amount, tzContext(ctx)),
	'round-up': (time, ctx) => endOfHour(time, tzContext(ctx)),
	'round-down': (time, ctx) => startOfHour(time, tzContext(ctx)),
};

const day: Unit = {
	name: 'day',
	add: (time, amount, ctx) => addDays(time, amount, tzContext(ctx)),
	'round-up': (time, ctx) => endOfDay(time, tzContext(ctx)),
	'round-down': (time, ctx) => startOfDay(time, tzContext(ctx)),
};

const week: Unit = {
	name: 'week',
	add: (time, amount, ctx) => addWeeks(time, amount, tzContext(ctx)),
	// ISO week: Monday-Sunday
	'round-up': (time, ctx) => endOfISOWeek(time, tzContext(ctx)),
	'round-down': (time, ctx) => startOfISOWeek(time, tzContext(ctx)),
};

const month: Unit = {
	name: 'month',
	add: (time, amount, ctx) => addMonths(time, amount, tzContext(ctx)),
	'round-up': (time, ctx) => endOfMonth(time, tzContext(ctx)),
	'round-down': (time, ctx) => startOfMonth(time, tzContext(ctx)),
};

const year: Unit = {
	name: 'year',
	add: (time, amount, ctx) => addYears(time, amount, tzContext(ctx)),
	'round-up': (time, ctx) => endOfYear(time, tzContext(ctx)),
	'round-down': (time, ctx) => startOfYear(time, tzContext(ctx)),
};

/**
 * Default unit definitions for date-fns adapter.
 */
export const units: ReadonlyMap<string, Unit> = new Map([
	['ms', millisecond],
	['s', second],
	['m', minute],
	['h', hour],
	['d', day],
	['w', week],
	['mo', month],
	['y', year],
]);

/**
 * Factory to create "now" as TZDate in the given timezone.
 */
export function now(ctx: ParseContext<Timezone>): TZDate {
	return TZDate.tz(ctx.timezone);
}
