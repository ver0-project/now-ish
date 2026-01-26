import {UTCDate} from '@date-fns/utc';
import {
	type Day,
	endOfDay,
	endOfHour,
	endOfMinute,
	endOfMonth,
	endOfSecond,
	endOfWeek,
	endOfYear,
	startOfDay,
	startOfHour,
	startOfMinute,
	startOfMonth,
	startOfSecond,
	startOfWeek,
	startOfYear,
} from 'date-fns';
import {duration} from './duration.js';

type DurationAdjuster = (timeMs: number) => number;
type DurationAdjusters = Record<'up' | 'down', DurationAdjuster>;

function newAdjuster(
	up: (timeMs: Date,) => Date,
	down: (timeMs: Date,) => Date,
) {
	return {
		up: (timeMs: number) => up(new UTCDate(timeMs)).getTime(),
		down: (timeMs: number) => down(new UTCDate(timeMs)).getTime(),
	};
}

const durationAdjusters: Record<string, Record<'up' | 'down', DurationAdjuster>> = {
	ms: {
		up: (timeMs: number) => timeMs,
		down: (timeMs: number) => timeMs,
	},
	s: newAdjuster(endOfSecond, startOfSecond),
	m: newAdjuster(endOfMinute, startOfMinute),
	h: newAdjuster(endOfHour, startOfHour),
	d: newAdjuster(endOfDay, startOfDay),
	w: newAdjuster((timeMs: Date) => endOfWeek(timeMs, {weekStartsOn: 1}),
		(timeMs: Date) => startOfWeek(timeMs, {weekStartsOn: 1})),
	mo: newAdjuster(endOfMonth, startOfMonth),
	y: newAdjuster(endOfYear, startOfYear),
};

function newDurationAdjusters<Durations extends string = keyof typeof duration>(
	weekStartsOn: Day = 1,
) {
	return {
		ms: {
			up: (timeMs: number) => timeMs,
			down: (timeMs: number) => timeMs,
		},
		s: newAdjuster(endOfSecond, startOfSecond),
		m: newAdjuster(endOfMinute, startOfMinute),
		h: newAdjuster(endOfHour, startOfHour),
		d: newAdjuster(endOfDay, startOfDay),
		w: newAdjuster((timeMs: Date) => endOfWeek(timeMs, {weekStartsOn}),
			(timeMs: Date) => startOfWeek(timeMs, {weekStartsOn})),
		mo: newAdjuster(endOfMonth, startOfMonth),
		y: newAdjuster(endOfYear, startOfYear),
	} as const as Record<Durations, DurationAdjusters>;
}

type TimePointParser = (input: string, roundUp?: boolean) => number;

type TimePointParserOptions<Durations extends string = string> = {
	durations: Record<Durations, number>;
	durationAdjusters: Record<Durations, DurationAdjusters>;
};

const defaultOptions: TimePointParserOptions<keyof typeof duration> = {
	durations: duration,
	durationAdjusters: newDurationAdjusters(1),
};

export function newTimePointParser<Durations extends string = keyof typeof duration>(
	options?: TimePointParserOptions<Durations>,
): TimePointParser {
	options ??= defaultOptions as TimePointParserOptions<Durations>;

	const supportedDurationUnits = Object.keys(options.durations).join('|');
	const relativeTimePointRX = new RegExp(`^now(?:/(${supportedDurationUnits}))?(?:([-+]\\d+)(${supportedDurationUnits}))?(?:/(${supportedDurationUnits}))?$`);

	// eslint-disable-next-line func-names
	return function parseRelativeTimePoint(input: string, roundUp = false): number {
		const match = relativeTimePointRX.exec(input);
		if (!match) {
			throw new Error(`Invalid relative time point: ${input}`, {cause: input});
		}

		let result = Date.now();

		const [, nowRounding, offsetDuration, durationUnit, exprRounding] = match;

		if (nowRounding !== undefined) {
			const adj = durationAdjusters[nowRounding];
			if (adj === undefined) {
				throw new Error(`Invalid rounding unit: ${nowRounding}`, {cause: nowRounding});
			}

			result = adj[roundUp ? 'up' : 'down'](result);
		}

		if (offsetDuration !== undefined && durationUnit !== undefined) {
			const mul = options.durations[durationUnit as Durations];
			if (mul === undefined) {
				throw new Error(`Invalid duration unit: ${durationUnit}`, {cause: durationUnit});
			}

			result += Number(offsetDuration) * mul;
		}

		if (exprRounding !== undefined) {
			const adj = durationAdjusters[exprRounding];
			if (adj === undefined) {
				throw new Error(`Invalid rounding unit: ${exprRounding}`, {cause: exprRounding});
			}

			result = adj[roundUp ? 'up' : 'down'](result);
		}

		return result;
	};
}

export const parseRelativeTimePoint = newTimePointParser();
