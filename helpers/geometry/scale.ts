/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { Matrix } from './types';

/**
 * A matrix that scales points from the origin.
 *
 * @param sx - Horizontal factor
 * @param sy - Vertical factor, `sx` by default
 * @returns The scaling matrix
 * @example
 * applyToPoint(scale(2), { x: 3, y: 4 })    // => { x: 6, y: 8 }
 * applyToPoint(scale(1, -1), { x: 3, y: 4 }) // => { x: 3, y: -4 } (vertical flip)
 * @since next
 */
export function scale(sx: number, sy: number = sx): Matrix {
  return { a: sx, b: 0, c: 0, d: sy, e: 0, f: 0 };
}
