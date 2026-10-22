/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { Rect } from './types';

/**
 * Whether two rectangles have an area in common, exactly when {@link rectIntersection} returns
 * a rectangle: rectangles that only touch do not, and neither does an empty (zero width or
 * height) rectangle.
 *
 * @param a - A rectangle
 * @param b - Another rectangle
 * @returns `true` if they have an area in common
 * @example
 * intersects({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5, width: 10, height: 10 })  // => true
 * intersects({ x: 0, y: 0, width: 10, height: 10 }, { x: 10, y: 0, width: 10, height: 10 }) // => false
 * @since next
 */
export function intersects(a: Rect, b: Rect): boolean {
  return (
    Math.min(a.x + a.width, b.x + b.width) > Math.max(a.x, b.x) &&
    Math.min(a.y + a.height, b.y + b.height) > Math.max(a.y, b.y)
  );
}
