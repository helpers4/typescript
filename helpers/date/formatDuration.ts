/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Options for {@link formatDuration}.
 *
 * @since 2.0.0
 */
export interface FormatDurationOptions {
  /**
   * Smallest unit to display. Units below this are dropped.
   * Default: `'seconds'`.
   */
  readonly minUnit?: 'hours' | 'minutes' | 'seconds';
  /**
   * Whether to pad single-digit values with a leading zero.
   * Default: `false`.
   */
  readonly padded?: boolean;
}

/**
 * Formats a duration in milliseconds as a compact human-readable string.
 *
 * Produces output like `"1h 23m 45s"`. Zero-valued leading units are
 * omitted (e.g. `"23m 45s"` instead of `"0h 23m 45s"`), but trailing
 * zeros are kept up to the minimum unit (`"1h 0m 0s"` when `minUnit`
 * is `'seconds'`).
 *
 * Negative durations are prefixed with `"-"`.
 * A zero duration returns `"0s"` (or `"0m"` / `"0h"` depending on `minUnit`).
 *
 * @param ms - Duration in milliseconds
 * @param options - Optional configuration
 * @returns A compact duration string
 * @example
 * formatDuration(5025000)           // => "1h 23m 45s"
 * formatDuration(45000)             // => "45s"
 * formatDuration(3600000)           // => "1h 0m 0s"
 * formatDuration(5025000, { minUnit: 'minutes' }) // => "1h 23m"
 * formatDuration(5025000, { padded: true })       // => "01h 23m 45s"
 * formatDuration(-5025000)          // => "-1h 23m 45s"
 *
 * @see Temporal alternative: `Temporal.Duration` with `toLocaleString()`
 * @since 2.0.0
 */
export function formatDuration(
  ms: number,
  options: FormatDurationOptions = {}
): string {
  const { minUnit = 'seconds', padded = false } = options;

  const negative = ms < 0;
  let remaining = Math.abs(Math.trunc(ms));

  const hours = Math.floor(remaining / 3_600_000);
  remaining %= 3_600_000;
  const minutes = Math.floor(remaining / 60_000);
  remaining %= 60_000;
  const seconds = Math.floor(remaining / 1_000);

  const fmt = (n: number): string =>
    padded ? String(n).padStart(2, '0') : String(n);

  const parts: string[] = [];
  let started = false;

  // Hours — always show if > 0 or if it's the minUnit
  if (hours > 0 || minUnit === 'hours') {
    parts.push(`${fmt(hours)}h`);
    started = true;
  }

  // Minutes
  if (minUnit !== 'hours') {
    if (started || minutes > 0 || minUnit === 'minutes') {
      parts.push(`${fmt(minutes)}m`);
      started = true;
    }
  }

  // Seconds
  if (minUnit === 'seconds') {
    if (started || seconds >= 0) {
      parts.push(`${fmt(seconds)}s`);
    }
  }

  if (parts.length === 0) {
    parts.push(`${fmt(0)}${minUnit === 'hours' ? 'h' : minUnit === 'minutes' ? 'm' : 's'}`);
  }

  const result = parts.join(' ');
  return negative && result !== `${fmt(0)}s` && result !== `${fmt(0)}m` && result !== `${fmt(0)}h`
    ? `-${result}`
    : result;
}
