/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Corrects floating-point arithmetic errors by rounding to a given number
 * of significant digits. Useful after calculations that accumulate binary
 * floating-point drift (e.g. `0.1 + 0.2 === 0.30000000000000004`).
 *
 * The default precision of 14 significant digits eliminates typical
 * rounding noise for values in the range used by most applications.
 * Note: for values whose integer part already consumes 14 or more digits
 * (i.e. |value| ≥ 1e13), toPrecision(14) has no room left for decimal
 * digits and will silently truncate them. Increase `precision` if you
 * need to correct drift in very large numbers.
 *
 * Note: IEEE-754 doubles carry at most ~17 significant decimal digits.
 * Precision values above 17 pad with digits that reflect the underlying
 * binary representation rather than correcting drift.
 *
 * @param value - The floating-point value to correct
 * @param precision - Integer number of significant digits between 1 and 100
 *   (default: 14). Values above 17 are valid but expose binary noise beyond
 *   IEEE-754's meaningful range.
 * @returns The corrected value
 * @example
 * correctFloat(0.1 + 0.2) // => 0.3
 * correctFloat(1.1 - 0.3) // => 0.8
 * correctFloat(0.1 * 3)   // => 0.3
 *
 * // Custom precision: keep 4 significant digits
 * correctFloat(1.23456789, 4) // => 1.235
 * correctFloat(1.23456789, 6) // => 1.23457
 * @since 2.0.2
 */
export function correctFloat(value: number, precision: number = 14): number {
  if (!Number.isFinite(value)) {
    throw new RangeError(`correctFloat: value must be a finite number, got ${value}`);
  }
  if (!Number.isInteger(precision) || precision < 1 || precision > 100) {
    throw new RangeError(`correctFloat: precision must be an integer between 1 and 100, got ${precision}`);
  }
  const result = parseFloat(value.toPrecision(precision));
  // toPrecision(-0) produces "0.000…" (no minus sign per spec) — restore the sign bit.
  return Object.is(value, -0) ? -0 : result;
}
