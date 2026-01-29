/**
 * Controls boundary selection: 'round-down' snaps to period start,
 * 'round-up' snaps to period end.
 */
export type RoundingDirection = 'round-up' | 'round-down';

/**
 * Runtime context for unit operations. TZ is adapter-specific
 * (e.g., string for date-fns, Temporal.TimeZoneLike for Temporal).
 */
export type ParseContext<TZ> = {
	readonly timezone: TZ;
};

/**
 * Defines time arithmetic for a single unit (day, week, month, etc.).
 * T is the time type returned by the adapter (e.g., TZDate, ZonedDateTime).
 */
export type UnitDefinition<T, TZ> = {
	readonly name: string;
	readonly add: (time: T, amount: number, ctx: ParseContext<TZ>) => T;
	readonly 'round-up': (time: T, ctx: ParseContext<TZ>) => T;
	readonly 'round-down': (time: T, ctx: ParseContext<TZ>) => T;
};

/**
 * Adapter-provided configuration for parser creation.
 * Supplies unit definitions, default timezone, and now-keyword aliases.
 */
export type ParserConfig<T, TZ> = {
	readonly now: (ctx: ParseContext<TZ>) => T;
	readonly units: ReadonlyMap<string, UnitDefinition<T, TZ>>;
	readonly timezone: TZ;
	readonly nowAliases: readonly string[];
};

/**
 * Parses expressions like 'now-7d/w' into adapter's time type T.
 */
export type Parser<T, TZ> = (input: string, direction?: RoundingDirection, options?: Partial<ParseContext<TZ>>) => T;

/**
 * 'invalid-structure': expression doesn't match grammar.
 * 'invalid-value': structure valid but contains unknown unit or alias.
 */
export type ParseErrorKind = 'invalid-structure' | 'invalid-value';

/**
 * Segment of expression grammar: now[/round][±Nunit[/round]]
 */
export type ParseErrorPosition = 'now-keyword' | 'now-rounding' | 'offset' | 'final-rounding';

/**
 * Thrown on parse failure. For 'invalid-value', position indicates
 * which segment failed validation.
 */
export class ParseError extends Error {
	override readonly name = 'ParseError';

	readonly kind: ParseErrorKind;
	readonly value: string;
	readonly position?: ParseErrorPosition | undefined;

	constructor(kind: 'invalid-structure', value: string);
	constructor(kind: 'invalid-value', value: string, position: ParseErrorPosition);
	constructor(kind: ParseErrorKind, value: string, position?: ParseErrorPosition) {
		super(kind === 'invalid-structure' ? `invalid expression: '${value}'` : `invalid ${position}: '${value}'`);
		this.kind = kind;
		this.value = value;
		this.position = position;
	}
}

// Raw tokens extracted from expression string.
type ParsedExpression = {
	now: string;
	nowRounding?: string | undefined;
	offset?: {amount: number; unit: string} | undefined;
	finalRounding?: string | undefined;
};

// Structure: now[/round][±Nunit[/round]]
// Identifiers: Unicode letters + marks (accents). No digits (reserved for amounts), no dashes (offset sign).
const STRUCTURE_RX = /^([\p{L}\p{M}]+)(?:\/([\p{L}\p{M}]+))?(?:([+-])(\d+)([\p{L}\p{M}]+)(?:\/([\p{L}\p{M}]+))?)?$/u;

/**
 * Extract tokens from expression. Validates grammar, not values.
 * @throws ParseError('invalid-structure') if pattern doesn't match
 */
export function parseStructure(input: string): ParsedExpression {
	const match = STRUCTURE_RX.exec(input);
	if (!match) {
		throw new ParseError('invalid-structure', input);
	}

	let amount = Number.parseInt(match[4] ?? '0', 10);
	if (match[3] === '-' && !Number.isNaN(amount) && amount !== 0) {
		amount *= -1;
	}

	return {
		now: match[1]!, // bang justified: regex guarantees match
		nowRounding: match[2],
		offset: match[4] ? {amount, unit: match[5]!} : undefined,
		finalRounding: match[6],
	};
}

// Tokens with unit names resolved to definitions.
type ResolvedExpression<T, TZ> = {
	nowRounding?: UnitDefinition<T, TZ> | undefined;
	offset?: {amount: number; unit: UnitDefinition<T, TZ>} | undefined;
	finalRounding?: UnitDefinition<T, TZ> | undefined;
};

// Validate tokens and resolve unit names to definitions.
function resolveExpression<T, TZ>(expr: ParsedExpression, config: ParserConfig<T, TZ>): ResolvedExpression<T, TZ> {
	if (!config.nowAliases.includes(expr.now)) {
		throw new ParseError('invalid-value', expr.now, 'now-keyword');
	}

	const result: ResolvedExpression<T, TZ> = {};

	if (expr.nowRounding) {
		result.nowRounding = config.units.get(expr.nowRounding);
		if (!result.nowRounding) {
			throw new ParseError('invalid-value', expr.nowRounding, 'now-rounding');
		}
	}

	if (expr.offset) {
		const offsetUnit = config.units.get(expr.offset.unit);
		if (!offsetUnit) {
			throw new ParseError('invalid-value', expr.offset.unit, 'offset');
		}

		result.offset = {amount: expr.offset.amount, unit: offsetUnit};

		if (expr.finalRounding) {
			result.finalRounding = config.units.get(expr.finalRounding);
			if (!result.finalRounding) {
				throw new ParseError('invalid-value', expr.finalRounding, 'final-rounding');
			}
		}
	}

	return result;
}

/**
 * Build a parser from adapter configuration.
 * @throws Error if nowAliases or units are empty
 */
export function createParser<T, TZ>(config: ParserConfig<T, TZ>): Parser<T, TZ> {
	if (config.nowAliases.length === 0) {
		throw new Error('nowAliases must not be empty');
	}

	if (config.units.size === 0) {
		throw new Error('units must not be empty');
	}

	return function (input: string, direction: RoundingDirection = 'round-down', options?: Partial<ParseContext<TZ>>): T {
		const parsed = parseStructure(input);
		const resolved = resolveExpression(parsed, config);

		const ctx: ParseContext<TZ> = {
			timezone: options?.timezone ?? config.timezone,
		};

		let result = config.now(ctx);

		if (resolved.nowRounding) {
			result = resolved.nowRounding[direction](result, ctx);
		}

		if (resolved.offset) {
			result = resolved.offset.unit.add(result, resolved.offset.amount, ctx);

			if (resolved.finalRounding) {
				result = resolved.finalRounding[direction](result, ctx);
			}
		}

		return result;
	};
}
