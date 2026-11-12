import type {Parser} from '@ver0/now-ish';
import {createParser} from '@ver0/now-ish';
import type {Time} from './units.js';
import {now, nowAliases, units} from './units.js';

export type {Time, Timezone, Unit} from './units.js';
export {now, nowAliases, units} from './units.js';

export const parse: Parser<Time, string> = createParser({now, units, nowAliases, timezone: 'UTC'});
