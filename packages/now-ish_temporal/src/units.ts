import {Temporal} from '@js-temporal/polyfill';
import type {ParseContext, UnitDefinition} from '@ver0/now-ish';

/**
 * Temporal adapter timezone type.
 * Accepts IANA timezone strings or Temporal.TimeZone objects.
 */
export type Timezone = Temporal.TimeZoneLike;

/**
 * Time type for Temporal adapter.
 * ZonedDateTime carries both the instant and timezone context.
 */
export type Time = Temporal.ZonedDateTime;

/**
 * Unit definition type for Temporal adapter.
 */
export type Unit = UnitDefinition<Time, Timezone>;

const millisecond: Unit = {
	name: 'millisecond',
	add: (time, amount) => time.add({milliseconds: amount}),
	'round-up': (time) =>
		time.round({smallestUnit: 'millisecond', roundingMode: 'floor'}).add({milliseconds: 1}).subtract({nanoseconds: 1}),
	'round-down': (time) => time.round({smallestUnit: 'millisecond', roundingMode: 'floor'}),
};

const second: Unit = {
	name: 'second',
	add: (time, amount) => time.add({seconds: amount}),
	'round-up': (time) =>
		time.round({smallestUnit: 'second', roundingMode: 'floor'}).add({seconds: 1}).subtract({nanoseconds: 1}),
	'round-down': (time) => time.round({smallestUnit: 'second', roundingMode: 'floor'}),
};

const minute: Unit = {
	name: 'minute',
	add: (time, amount) => time.add({minutes: amount}),
	'round-up': (time) =>
		time.round({smallestUnit: 'minute', roundingMode: 'floor'}).add({minutes: 1}).subtract({nanoseconds: 1}),
	'round-down': (time) => time.round({smallestUnit: 'minute', roundingMode: 'floor'}),
};

const hour: Unit = {
	name: 'hour',
	add: (time, amount) => time.add({hours: amount}),
	'round-up': (time) =>
		time.round({smallestUnit: 'hour', roundingMode: 'floor'}).add({hours: 1}).subtract({nanoseconds: 1}),
	'round-down': (time) => time.round({smallestUnit: 'hour', roundingMode: 'floor'}),
};

const day: Unit = {
	name: 'day',
	add: (time, amount) => time.add({days: amount}),
	'round-up'(time) {
		// we don't use the built-in rounding here because it would roll over DST gaps incorrectly
		return time.startOfDay().add({days: 1}).subtract({nanoseconds: 1});
	},
	'round-down': (time) => time.startOfDay(),
};

const week: Unit = {
	name: 'week',
	add: (time, amount) => time.add({weeks: amount}),
	'round-up'(time) {
		// ISO week starts Monday (dayOfWeek=1)
		const daysFromMonday = time.dayOfWeek - 1;
		const startOfWeek = time.startOfDay().subtract({days: daysFromMonday});
		return startOfWeek.add({days: 7}).subtract({nanoseconds: 1});
	},
	'round-down'(time) {
		const daysFromMonday = time.dayOfWeek - 1;
		return time.startOfDay().subtract({days: daysFromMonday});
	},
};

const month: Unit = {
	name: 'month',
	add: (time, amount) => time.add({months: amount}),
	'round-up': (time) => time.with({day: 1}).startOfDay().add({months: 1}).subtract({nanoseconds: 1}),
	'round-down': (time) => time.with({day: 1}).startOfDay(),
};

const year: Unit = {
	name: 'year',
	add: (time, amount) => time.add({years: amount}),
	'round-up': (time) => time.with({month: 1, day: 1}).startOfDay().add({years: 1}).subtract({nanoseconds: 1}),
	'round-down': (time) => time.with({month: 1, day: 1}).startOfDay(),
};

/**
 * Default unit definitions for Temporal adapter.
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
 * Factory to create "now" as ZonedDateTime in given timezone.
 */
export function now(ctx: ParseContext<Timezone>): Temporal.ZonedDateTime {
	return Temporal.Now.zonedDateTimeISO(ctx.timezone);
}
