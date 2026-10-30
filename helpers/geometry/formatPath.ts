/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { PathCommand } from './types';

/**
 * Writes path commands back as SVG path data: letters and numbers separated by single spaces,
 * numbers rounded to `precision` decimals with the trailing zeros dropped (`-0` is written `0`).
 *
 * @param commands - The commands, as {@link parsePath} returns them
 * @param precision - Decimals kept per number. Defaults to `6`
 * @returns The path data
 * @example
 * formatPath([{ type: 'M', values: [0, 0.5] }, { type: 'L', values: [10, 1 / 3] }]) // => 'M0 0.5 L10 0.333333'
 * @since 3.1.10
 */
export function formatPath(commands: readonly PathCommand[], precision = 6): string {
  const write = (n: number): string => String(Number(n.toFixed(precision)) + 0);
  return commands.map(({ type, values }) => [type, ...values.map(write)].join(' ').replace(/^(\S) /, '$1')).join(' ');
}
