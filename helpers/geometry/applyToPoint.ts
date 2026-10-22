/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { Matrix, Point } from './types';

/**
 * Transforms a point by a matrix.
 *
 * @param m - The matrix
 * @param p - The point
 * @returns The transformed point
 * @example
 * applyToPoint(translate(10, 5), { x: 1, y: 1 }) // => { x: 11, y: 6 }
 * @since next
 */
export function applyToPoint(m: Matrix, p: Point): Point {
  return { x: m.a * p.x + m.c * p.y + m.e, y: m.b * p.x + m.d * p.y + m.f };
}
