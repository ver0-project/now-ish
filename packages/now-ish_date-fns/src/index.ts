import type {Parser} from '@ver0/now-ish';
import {createParser} from '@ver0/now-ish';
import type {Time, Timezone} from './units.js';
import {now, nowAliases, units} from './units.js';

export type {Time, Timezone, Unit} from './units.js';
export {now, nowAliases, units} from './units.js';

export const parse: Parser<Time, Timezone> = createParser({now, units, nowAliases, timezone: 'UTC'});
