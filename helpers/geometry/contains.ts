/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { Point, Rect } from './types';

/**
 * Whether a point or a rectangle is inside a rectangle.
 *
 * For a point (hit-testing), the left and top edges are inside and the right and bottom ones are
 * not, so a point on the edge between two adjacent rectangles hits exactly one of them. A
 * rectangle is inside when it does not stick out: it may touch any edge.
 *
 * @param r - The containing rectangle
 * @param target - A point, or a rectangle
 * @returns `true` if `target` is inside `r`
 * @example
 * contains({ x: 0, y: 0, width: 10, height: 10 }, { x: 0, y: 5 })                       // => true
 * contains({ x: 0, y: 0, width: 10, height: 10 }, { x: 10, y: 5 })                      // => false
 * contains({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5, width: 5, height: 5 })  // => true
 * @since next
 */
export function contains(r: Rect, target: Point | Rect): boolean {
  if ('width' in target) {
    return (
      target.x >= r.x && target.y >= r.y && target.x + target.width <= r.x + r.width && target.y + target.height <= r.y + r.height
    );
  }
  return target.x >= r.x && target.x < r.x + r.width && target.y >= r.y && target.y < r.y + r.height;
}
