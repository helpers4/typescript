/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { Point, Rect } from './types';

/**
 * Whether a point is inside a rectangle, for hit-testing.
 *
 * The left and top edges are inside, the right and bottom ones are not, so a point on the edge
 * between two adjacent rectangles hits exactly one of them.
 *
 * @param r - The rectangle
 * @param p - The point
 * @returns `true` if `p` is inside `r`
 * @example
 * containsPoint({ x: 0, y: 0, width: 10, height: 10 }, { x: 0, y: 5 })  // => true
 * containsPoint({ x: 0, y: 0, width: 10, height: 10 }, { x: 10, y: 5 }) // => false
 * @since next
 */
export function containsPoint(r: Rect, p: Point): boolean {
  return p.x >= r.x && p.x < r.x + r.width && p.y >= r.y && p.y < r.y + r.height;
}
