/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Formats a number using compact notation (e.g. `1_500_000 → "1.5M"`).
 *
 * Thin wrapper over `Intl.NumberFormat` with `notation: 'compact'`. Companion
 * of `formatSize` in the same `format*` family.
 *
 * @param value - The number to format.
 * @param locale - BCP 47 locale tag. Defaults to the runtime locale.
 * @returns A compact string representation of the number.
 * @example
 * formatCompact(1_500_000);        // '1.5M'  (en-US locale)
 * formatCompact(1_000);            // '1K'
 * formatCompact(999);              // '999'
 * formatCompact(1_500_000, 'fr'); // '1,5 M'
 * @since 2.0.0
 */
export function formatCompact(value: number, locale?: string): string {
  return new Intl.NumberFormat(locale, { notation: 'compact' }).format(value);
}
