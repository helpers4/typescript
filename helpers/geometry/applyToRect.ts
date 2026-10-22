/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { applyToPoint } from './applyToPoint';
import type { Matrix, Rect } from './types';

/**
 * Transforms a rectangle by a matrix and returns its bounding box: the smallest axis-aligned
 * rectangle that contains it. After a rotation or a skew, the box is larger than the rectangle.
 *
 * @param m - The matrix
 * @param r - The rectangle
 * @returns The bounding box of the transformed rectangle
 * @example
 * applyToRect(scale(2), { x: 1, y: 1, width: 2, height: 3 }) // => { x: 2, y: 2, width: 4, height: 6 }
 * @since next
 */
export function applyToRect(m: Matrix, r: Rect): Rect {
  const corners = [
    applyToPoint(m, { x: r.x, y: r.y }),
    applyToPoint(m, { x: r.x + r.width, y: r.y }),
    applyToPoint(m, { x: r.x, y: r.y + r.height }),
    applyToPoint(m, { x: r.x + r.width, y: r.y + r.height }),
  ];
  const xs = corners.map((p) => p.x);
  const ys = corners.map((p) => p.y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, width: Math.max(...xs) - x, height: Math.max(...ys) - y };
}
