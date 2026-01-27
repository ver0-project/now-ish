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
function createDateFnsContext(ctx: ParseContext<Timezone>) {
	return {
		in(value: Date | number | string) {
			const timestamp =
				typeof value === 'number' ? value : new Date(value).getTime();
			return new TZDate(timestamp, ctx.timezone);
		},
	};
}

const millisecond: Unit = {
	name: 'millisecond',
	add: (time, amount, ctx) =>
		addMilliseconds(time, amount, createDateFnsContext(ctx)),
	'round-up': (time, ctx) => new TZDate(time.getTime(), ctx.timezone),
	'round-down': (time, ctx) => new TZDate(time.getTime(), ctx.timezone),
};

const second: Unit = {
	name: 'second',
	add: (time, amount, ctx) => addSeconds(time, amount, createDateFnsContext(ctx)),
	'round-up': (time, ctx) => endOfSecond(time, createDateFnsContext(ctx)),
	'round-down': (time, ctx) => startOfSecond(time, createDateFnsContext(ctx)),
};

const minute: Unit = {
	name: 'minute',
	add: (time, amount, ctx) => addMinutes(time, amount, createDateFnsContext(ctx)),
	'round-up': (time, ctx) => endOfMinute(time, createDateFnsContext(ctx)),
	'round-down': (time, ctx) => startOfMinute(time, createDateFnsContext(ctx)),
};

const hour: Unit = {
	name: 'hour',
	add: (time, amount, ctx) => addHours(time, amount, createDateFnsContext(ctx)),
	'round-up': (time, ctx) => endOfHour(time, createDateFnsContext(ctx)),
	'round-down': (time, ctx) => startOfHour(time, createDateFnsContext(ctx)),
};

const day: Unit = {
	name: 'day',
	add: (time, amount, ctx) => addDays(time, amount, createDateFnsContext(ctx)),
	'round-up': (time, ctx) => endOfDay(time, createDateFnsContext(ctx)),
	'round-down': (time, ctx) => startOfDay(time, createDateFnsContext(ctx)),
};

const week: Unit = {
	name: 'week',
	add: (time, amount, ctx) => addWeeks(time, amount, createDateFnsContext(ctx)),
	'round-up': (time, ctx) => endOfISOWeek(time, createDateFnsContext(ctx)),
	'round-down': (time, ctx) => startOfISOWeek(time, createDateFnsContext(ctx)),
};

const month: Unit = {
	name: 'month',
	add: (time, amount, ctx) => addMonths(time, amount, createDateFnsContext(ctx)),
	'round-up': (time, ctx) => endOfMonth(time, createDateFnsContext(ctx)),
	'round-down': (time, ctx) => startOfMonth(time, createDateFnsContext(ctx)),
};

const year: Unit = {
	name: 'year',
	add: (time, amount, ctx) => addYears(time, amount, createDateFnsContext(ctx)),
	'round-up': (time, ctx) => endOfYear(time, createDateFnsContext(ctx)),
	'round-down': (time, ctx) => startOfYear(time, createDateFnsContext(ctx)),
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
