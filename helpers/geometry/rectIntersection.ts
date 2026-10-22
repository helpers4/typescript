/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { Rect } from './types';

/**
 * The area two rectangles have in common.
 *
 * Rectangles that only touch (along an edge or at a corner) have no area in common.
 *
 * @param a - A rectangle
 * @param b - Another rectangle
 * @returns The overlapping rectangle, or `undefined` when they do not overlap
 * @example
 * rectIntersection({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5, width: 10, height: 10 })
 * // => { x: 5, y: 5, width: 5, height: 5 }
 * @since next
 */
export function rectIntersection(a: Rect, b: Rect): Rect | undefined {
  const x = Math.max(a.x, b.x);
  const y = Math.max(a.y, b.y);
  const width = Math.min(a.x + a.width, b.x + b.width) - x;
  const height = Math.min(a.y + a.height, b.y + b.height) - y;
  return width > 0 && height > 0 ? { x, y, width, height } : undefined;
}
