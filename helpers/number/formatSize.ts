/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/** Size units in ascending order. */
const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

/**
 * Options for {@link formatSize}.
 * @since 3.0.8
 */
export interface FormatSizeOptions {
  /**
   * Inserted between the number and the unit.
   * @default '' (no separator, e.g. `'1.5KB'`)
   */
  unitSeparator?: string;
  /**
   * Print the base unit (`B`) as a bare integer with no decimal point, since
   * a fractional byte count is meaningless. Units at `KB` and above are
   * unaffected and always keep one decimal place.
   * @default false
   */
  integerBelowFirstUnit?: boolean;
}

/**
 * Format a byte count into a human-readable string with the appropriate unit.
 *
 * Each unit is 1024 of the previous (binary prefix). The result is formatted
 * with one decimal place, unless `integerBelowFirstUnit` is set.
 *
 * @param bytes - A non-negative integer representing a byte count.
 * @param options - Options.
 * @returns A human-readable string such as `'0.0B'`, `'1.5KB'`, `'3.2MB'`.
 * @example
 * formatSize(0)               // '0.0B'
 * formatSize(512)             // '512.0B'
 * formatSize(1024)            // '1.0KB'
 * formatSize(1536)            // '1.5KB'
 * formatSize(1_048_576)       // '1.0MB'
 * formatSize(1_073_741_824)   // '1.0GB'
 * @example
 * formatSize(1536, { unitSeparator: ' ' })                              // '1.5 KB'
 * formatSize(512, { integerBelowFirstUnit: true })                      // '512B'
 * formatSize(512, { unitSeparator: ' ', integerBelowFirstUnit: true })   // '512 B'
 * @since 2.0.0
 */
export function formatSize(bytes: number, options: FormatSizeOptions = {}): string {
  const { unitSeparator = '', integerBelowFirstUnit = false } = options;
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < UNITS.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  const formattedSize = unitIndex === 0 && integerBelowFirstUnit ? `${size}` : size.toFixed(1);
  return `${formattedSize}${unitSeparator}${UNITS[unitIndex]}`;
}
