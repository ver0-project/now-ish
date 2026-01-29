import {createParser} from '@ver0/now-ish';
import {now, nowAliases, units} from './units.js';

export type {Time, Timezone, Unit} from './units.js';
export {now, nowAliases, units} from './units.js';

export const parse = createParser({now, units, nowAliases, timezone: 'UTC'});
