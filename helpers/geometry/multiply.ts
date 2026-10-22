/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { Matrix } from './types';

/**
 * Multiplies matrices, in the mathematical order: the last one applies first. It is the order of
 * a CSS `transform` list, so `multiply(translate(10, 0), rotate(r))` is
 * `transform: translate(10px) rotate(r)`: rotate, then translate.
 *
 * In other words, `applyToPoint(multiply(m1, m2), p)` equals
 * `applyToPoint(m1, applyToPoint(m2, p))`.
 *
 * @param matrices - The matrices, outermost first
 * @returns Their product, or the identity for none
 * @example
 * // Scale around the point (50, 50)
 * multiply(translate(50, 50), scale(2), translate(-50, -50))
 * @since 3.1.5
 */
export function multiply(...matrices: readonly Matrix[]): Matrix {
  let m: Matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
  for (const n of matrices) {
    m = {
      a: m.a * n.a + m.c * n.b,
      b: m.b * n.a + m.d * n.b,
      c: m.a * n.c + m.c * n.d,
      d: m.b * n.c + m.d * n.d,
      e: m.a * n.e + m.c * n.f + m.e,
      f: m.b * n.e + m.d * n.f + m.f,
    };
  }
  return m;
}
