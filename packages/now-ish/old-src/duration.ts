type Duration =	'ms' |	's' |	'm' |	'h' |	'd' |	'w' |	'mo' |	'y';

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const duration = {} as Record<Duration, number>;

duration.ms = 1;
duration.s = 1000 * duration.ms;
duration.m = 60 * duration.s;
duration.h = 60 * duration.m;
duration.d = 24 * duration.h;
duration.w = 7 * duration.d;
duration.mo = 30 * duration.d;
duration.y = 365 * duration.d;
