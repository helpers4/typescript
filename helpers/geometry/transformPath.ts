/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { formatPath } from './formatPath';
import { normalizePath } from './_normalizePath';
import { parsePath } from './parsePath';
import type { Matrix } from './types';

/**
 * Transforms SVG path data by a matrix. The result is written with absolute `M`, `L`, `C`, `Q`
 * and `Z` only: relative commands are made absolute, `H`/`V`/`S`/`T` are expanded, and arcs
 * become cubic curves (so any matrix works, skews included). Moving a path is the common case.
 *
 * @param d - The path data
 * @param m - The matrix, in the CSS/SVG layout
 * @param precision - Decimals kept per number. Defaults to `6`
 * @returns The transformed path data
 * @throws {SyntaxError} If `d` is not valid path data — see {@link parsePath}
 * @example
 * transformPath('M0 0 h10 v10 z', translate(5, 5)) // => 'M5 5 L15 5 L15 15 Z'
 * @since 3.1.10
 */
export function transformPath(d: string, m: Matrix, precision = 6): string {
  const moved = normalizePath(parsePath(d)).map(({ type, values }) => ({
    type,
    values: values.map((n, i) => (i % 2 === 0 ? m.a * n + m.c * values[i + 1]! + m.e : m.b * values[i - 1]! + m.d * n + m.f)),
  }));
  return formatPath(moved, precision);
}
