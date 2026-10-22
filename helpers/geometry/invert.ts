/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { Matrix } from './types';

/**
 * The matrix that undoes `m`, e.g. to turn a pointer position on screen back into the
 * coordinates of a transformed layer.
 *
 * A matrix that flattens the plane onto a line or a point (determinant `0`, like `scale(0)`)
 * cannot be undone. There is no tolerance: a nearly flat matrix is inverted, with very large
 * values, as long as they stay finite.
 *
 * @param m - The matrix to invert
 * @returns The inverse, or `undefined` when `m` cannot be inverted
 * @example
 * invert(translate(10, 5)) // => translate(-10, -5)
 * invert(scale(0))         // => undefined
 * @since 3.1.5
 */
export function invert(m: Matrix): Matrix | undefined {
  const det = m.a * m.d - m.b * m.c;
  // `+ 0` turns the -0 of a negated 0 into 0, so invert(translate(x, y)) equals translate(-x, -y).
  const inverse: Matrix = {
    a: m.d / det + 0,
    b: -m.b / det + 0,
    c: -m.c / det + 0,
    d: m.a / det + 0,
    e: (m.c * m.f - m.d * m.e) / det + 0,
    f: (m.b * m.e - m.a * m.f) / det + 0,
  };
  return Object.values(inverse).every(Number.isFinite) ? inverse : undefined;
}
