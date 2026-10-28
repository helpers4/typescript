/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { formatPath } from './formatPath';
import type { Rect } from './types';

/**
 * The path of the ellipse that fills a box, as SVG path data: two half-turn arcs. A square box
 * gives a circle.
 *
 * @param box - The bounding box of the ellipse
 * @returns The path data, closed
 * @example
 * ellipsePath({ x: 0, y: 0, width: 10, height: 6 }) // => 'M0 3 A5 3 0 0 1 10 3 A5 3 0 0 1 0 3 Z'
 * @since next
 */
export function ellipsePath({ x, y, width, height }: Rect): string {
  const rx = width / 2;
  const ry = height / 2;
  const cy = y + ry;
  return formatPath([
    { type: 'M', values: [x, cy] },
    { type: 'A', values: [rx, ry, 0, 0, 1, x + width, cy] },
    { type: 'A', values: [rx, ry, 0, 0, 1, x, cy] },
    { type: 'Z', values: [] },
  ]);
}
