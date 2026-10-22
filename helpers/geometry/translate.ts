/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { Matrix } from './types';

/**
 * A matrix that moves points by `(tx, ty)`.
 *
 * @param tx - Horizontal offset
 * @param ty - Vertical offset
 * @returns The translation matrix
 * @example
 * applyToPoint(translate(10, 5), { x: 1, y: 1 }) // => { x: 11, y: 6 }
 * @since 3.1.5
 */
export function translate(tx: number, ty: number): Matrix {
  return { a: 1, b: 0, c: 0, d: 1, e: tx, f: ty };
}
