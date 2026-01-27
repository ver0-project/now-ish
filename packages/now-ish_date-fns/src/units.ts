import type {ParseContext, UnitDefinition} from '@ver0/now-ish';

/**
 * date-fns adapter timezone type.
 */
export type Timezone = string;

/**
 * Time type for date-fns adapter.
 */
export type Time = Date;

/**
 * Unit definition type for date-fns adapter.
 */
export type Unit = UnitDefinition<Time, Timezone>;

/**
 * Default unit definitions for date-fns adapter.
 */
export const units: ReadonlyMap<string, Unit> = new Map([]);

/**
 * Factory to create "now" as Date.
 */
export function now(_ctx: ParseContext<Timezone>): Date {
	return new Date();
}
