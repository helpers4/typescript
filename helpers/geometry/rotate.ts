/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { Matrix } from './types';

/**
 * A matrix that rotates points around the origin. With the y axis pointing down (screen, CSS,
 * SVG), a positive angle turns clockwise, like CSS `rotate()`.
 *
 * @param radians - The angle, in radians
 * @returns The rotation matrix
 * @example
 * applyToPoint(rotate(Math.PI / 2), { x: 1, y: 0 }) // => { x: 0, y: 1 } (rounded)
 * @since 3.1.5
 */
export function rotate(radians: number): Matrix {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return { a: cos, b: sin, c: -sin, d: cos, e: 0, f: 0 };
}
