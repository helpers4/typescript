/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { Rect } from './types';

/**
 * The smallest rectangle that contains all the given rectangles, e.g. the bounds of a group of
 * layers.
 *
 * @param rects - The rectangles
 * @returns Their bounding rectangle, or `undefined` for none
 * @example
 * union([{ x: 0, y: 0, width: 10, height: 10 }, { x: 20, y: 5, width: 10, height: 10 }])
 * // => { x: 0, y: 0, width: 30, height: 15 }
 * @since 3.1.5
 */
export function union(rects: readonly Rect[]): Rect | undefined {
  if (rects.length === 0) return undefined;
  let left = Infinity;
  let top = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;
  for (const r of rects) {
    left = Math.min(left, r.x);
    top = Math.min(top, r.y);
    right = Math.max(right, r.x + r.width);
    bottom = Math.max(bottom, r.y + r.height);
  }
  return { x: left, y: top, width: right - left, height: bottom - top };
}
