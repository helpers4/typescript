/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Options for {@link extractNumber}.
 */
export interface ExtractNumberOptions {
  /**
   * How to interpret a `-` immediately before the matched digits.
   * - `'auto'`: treated as a minus sign unless it is glued to a preceding letter/digit
   *   (e.g. `'-111'` and `'xxx -111'` → negative, but `'xxx-111'` → separator, positive).
   * - `'strict'`: always treated as a minus sign.
   * - `'ignore'`: never treated as a minus sign (always a separator).
   * @default 'auto'
   */
  sign?: 'auto' | 'strict' | 'ignore';

  /**
   * How to interpret a trailing scientific-notation suffix (`e`/`E` + digits, e.g. `1.5e-10`).
   * - `'auto'`: treated as an exponent unless it is glued to a following letter/digit
   *   (e.g. `'1e5'` and `'1e5 mol'` → exponential, but `'1e5kg'` → mantissa only).
   * - `'strict'`: always treated as an exponent.
   * - `'ignore'`: never treated as an exponent (mantissa only).
   * @default 'auto'
   */
  exponent?: 'auto' | 'strict' | 'ignore';
}

// (?<![\p{L}\p{N}_]) prevents matching a leading-dot decimal immediately after a word
// character (e.g. the '.5' in 'text.5' is a property separator, not a decimal point).
// No `g` flag — cloned per call via `new RegExp(…, 'gu')` so each invocation has its own lastIndex.
const NUMBER_TOKEN = /(-)?(\d+(?:\.\d+)?|(?<![\p{L}\p{N}_])\.\d+)([eE][+-]?\d+)?/u;
const WORD_CHAR = /[\p{L}\p{N}_]/u;

function isWordChar(char: string | undefined): boolean {
  return char !== undefined && WORD_CHAR.test(char);
}

/**
 * Extracts the first number embedded anywhere in a string, or passes through a `number`.
 *
 * Unlike a plain `parseFloat`/`parseInt`, the number does not need to be at the start of
 * the string: digits are searched for anywhere, so leading/trailing text (units, labels, ...)
 * is ignored. A `-` before the digits and a scientific-notation suffix (`e`/`E`) are
 * disambiguated with {@link ExtractNumberOptions.sign} and {@link ExtractNumberOptions.exponent}.
 *
 * Returns `undefined` if no number can be found.
 *
 * @param value - The value to extract a number from
 * @param options - Options controlling sign and exponent disambiguation
 * @returns The extracted number, or `undefined` if none was found
 * @example
 * extractNumber('16.5px')        // => 16.5
 * extractNumber('.5rem')         // => 0.5   (leading-dot decimal)
 * extractNumber('-.5')           // => -0.5  (leading-dot with sign)
 * extractNumber('Wafer 10')      // => 10
 * extractNumber('xxx-111')       // => 111   ('-' glued to text → separator)
 * extractNumber('xxx -111')      // => -111  ('-' preceded by a space → sign)
 * extractNumber('x-.5')          // => 0.5   ('-' glued to 'x' → separator; leading-dot decimal follows)
 * extractNumber('-111')          // => -111  ('-' at the start of the string → sign)
 * extractNumber('1e5 mol')       // => 100000
 * extractNumber('1e5kg')         // => 1     ('e5' glued to text → mantissa only)
 * extractNumber('no number')     // => undefined
 * extractNumber(42)              // => 42
 * @since 2.0.4
 */
export function extractNumber(value: unknown, options: ExtractNumberOptions = {}): number | undefined {
  const { sign = 'auto', exponent = 'auto' } = options;

  if (typeof value === 'number') {
    return Number.isNaN(value) ? undefined : value;
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const re = new RegExp(NUMBER_TOKEN.source, 'gu');
  let match: RegExpExecArray | null;

  while ((match = re.exec(value)) !== null) {
    const [full, signChar, mantissa, exponentPart] = match;
    const start = match.index;

    if (signChar) {
      const before = value[start - 1];
      const keepSign = sign === 'strict' ? true : sign === 'ignore' ? false : !isWordChar(before);

      if (!keepSign) {
        // Re-scan from right after the '-' so the digits are matched as a fresh, unsigned number.
        re.lastIndex = start + 1;
        continue;
      }
    }

    const keepExponent = exponentPart
      ? exponent === 'strict'
        ? true
        : exponent === 'ignore'
          ? false
          : !isWordChar(value[start + full.length])
      : false;

    const numericText = (signChar ?? '') + mantissa + (keepExponent ? exponentPart : '');
    return Number(numericText);
  }

  return undefined;
}
