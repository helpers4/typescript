/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Options for {@link formatProgressBar}.
 *
 * @since 3.0.1
 */
export interface ProgressBarOptions {
  /** Number of cells in the bar (each cell repeats `filledChar`/`emptyChar` once). Defaults to `20`. */
  width?: number;
  /** Character (or string) repeated for the filled portion. Defaults to `'▓'`. */
  filledChar?: string;
  /** Character (or string) repeated for the empty portion. Defaults to `'░'`. */
  emptyChar?: string;
  /** The value that represents a full (100%) bar. Defaults to `100`. */
  max?: number;
}

/**
 * Formats a value as a text progress bar, repeating `filledChar`/`emptyChar` across `width`
 * cells proportional to `value / max`.
 *
 * `value` is clamped to `[0, max]` before computing the ratio — out-of-range values (negative,
 * above `max`) produce an empty or fully-filled bar instead of throwing. Non-finite `max`
 * (`NaN`, `Infinity`) is treated as `0`, yielding an empty bar.
 *
 * @param value - The current value
 * @param options - Bar rendering options
 * @returns A string of `width` repeated filled/empty characters
 * @example
 * formatProgressBar(65)
 * // => '▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░' (13 filled of 20)
 * @example
 * formatProgressBar(3, { width: 10, max: 5, filledChar: '#', emptyChar: '-' })
 * // => '######----'
 * @since 3.0.1
 */
export function formatProgressBar(value: number, options: ProgressBarOptions = {}): string {
  const { width = 20, filledChar = '▓', emptyChar = '░', max = 100 } = options;
  const safeWidth = Math.max(0, Math.round(width));

  const ratio = Number.isFinite(max) && max > 0 ? value / max : 0;
  const clamped = Number.isFinite(ratio) ? Math.min(1, Math.max(0, ratio)) : 0;
  const filled = Math.round(clamped * safeWidth);

  return filledChar.repeat(filled) + emptyChar.repeat(safeWidth - filled);
}
