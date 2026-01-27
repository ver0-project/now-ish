/**
 * Rounding direction for time point parsing.
 *
 * - `'round-down'` — round to start of period (e.g., startOfDay)
 * - `'round-up'` — round to end of period (e.g., endOfDay)
 */
export type RoundingDirection = 'round-up' | 'round-down';

/**
 * Context passed to unit functions during parsing.
 * Contains timezone for adapter operations.
 *
 * @typeParam TZ - Timezone type defined by adapter
 */
export type ParseContext<TZ> = {
    /**
     * Timezone identifier.
     * Format depends on adapter (e.g., IANA for Temporal).
     */
    readonly timezone: TZ;
};

/**
 * Unit definition for a time duration.
 * Generic over the time type T and timezone type TZ.
 *
 * @typeParam T - The native time type used by the adapter
 * @typeParam TZ - Timezone type defined by adapter
 */
export type UnitDefinition<T, TZ> = {
    /**
     * Short unit name (e.g., 'd', 'w', 'mo', 'y').
     */
    readonly name: string;

    /**
     * Add amount of this unit to a time value.
     *
     * @param time - The time value to modify
     * @param amount - Number of units to add (can be negative)
     * @param ctx - Parse context with timezone
     * @returns New time value with offset applied
     */
    readonly add: (time: T, amount: number, ctx: ParseContext<TZ>) => T;

    /**
     * Round time to end of this unit's period.
     *
     * @param time - The time value to round
     * @param ctx - Parse context with timezone
     * @returns Time rounded to end of period
     */
    readonly 'round-up': (time: T, ctx: ParseContext<TZ>) => T;

    /**
     * Round time to start of this unit's period.
     *
     * @param time - The time value to round
     * @param ctx - Parse context with timezone
     * @returns Time rounded to start of period
     */
    readonly 'round-down': (time: T, ctx: ParseContext<TZ>) => T;
};

/**
 * Configuration for creating a parser.
 * Generic over time type T and timezone type TZ.
 *
 * @typeParam T - The native time type used by the adapter
 * @typeParam TZ - Timezone type defined by adapter
 */
export type ParserConfig<T, TZ> = {
    /**
     * Factory function to create the "now" base time.
     * Receives context for timezone-aware creation.
     *
     * @param ctx - Parse context with timezone
     * @returns Current time in native type
     */
    readonly now: (ctx: ParseContext<TZ>) => T;

    /**
     * Map of unit name to unit definition.
     * Keys are short unit names (e.g., 'd', 'w', 'mo').
     */
    readonly units: ReadonlyMap<string, UnitDefinition<T, TZ>>;

    /**
     * Default timezone for this parser.
     * Can be overridden per-call.
     */
    readonly timezone: TZ;

    /**
     * Map of alternative shorthands to unit names.
     * Used for i18n support.
     * @example new Map([['j', 'd'], ['sem', 'w']])
     */
    readonly unitAliases?: ReadonlyMap<string, string> | undefined;

    /**
     * Alternative keywords for "now".
     * First element or 'now' is used as default.
     * @example ['now', 'jetzt', 'maintenant']
     */
    readonly nowAliases?: readonly string[] | undefined;
};

/**
 * Parser function signature.
 * Generic over time type T and timezone type TZ.
 *
 * @typeParam T - The native time type returned by the parser
 * @typeParam TZ - Timezone type defined by adapter
 */
export type Parser<T, TZ> = (
    input: string,
    direction?: RoundingDirection,
    options?: Partial<ParseContext<TZ>>,
) => T;

/**
 * Factory function signature for creating parsers.
 *
 * @typeParam T - The native time type used by the adapter
 * @typeParam TZ - Timezone type defined by adapter
 */
export type CreateParser = <T, TZ>(config: ParserConfig<T, TZ>) => Parser<T, TZ>;
