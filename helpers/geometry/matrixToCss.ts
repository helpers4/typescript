/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { Matrix } from './types';

/**
 * Writes a matrix as a CSS `transform` or SVG `transform` value.
 *
 * Entries are written as JavaScript prints them, without rounding; non-finite entries give a
 * value CSS rejects.
 *
 * @param m - The matrix
 * @returns `matrix(a, b, c, d, e, f)`
 * @example
 * element.style.transform = matrixToCss(fitContain(frame, viewport));
 * matrixToCss({ a: 2, b: 0, c: 0, d: 2, e: 10, f: -5 }) // => 'matrix(2, 0, 0, 2, 10, -5)'
 * @since 3.1.5
 */
export function matrixToCss(m: Matrix): string {
  // `+ 0` writes 0 instead of -0.
  return `matrix(${[m.a, m.b, m.c, m.d, m.e, m.f].map((v) => v + 0).join(', ')})`;
}
