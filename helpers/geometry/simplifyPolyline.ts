/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { Point } from './types';

/**
 * Removes the points of a polyline that change its shape by less than `tolerance`, with the
 * Ramer–Douglas–Peucker algorithm: each removed point is at most `tolerance` away from the
 * simplified line. It shrinks map outlines or traced paths by orders of magnitude while keeping
 * their look.
 *
 * The first and last points are always kept. With a `tolerance` of `0`, only points exactly on a
 * straight line are removed. It is iterative, so very long polylines do not overflow the stack.
 *
 * @param points - The polyline
 * @param tolerance - The maximum distance between a removed point and the result, in the units of the points
 * @returns The kept points, in their original order
 * @throws {RangeError} If `tolerance` is negative or `NaN`
 * @example
 * simplifyPolyline([{ x: 0, y: 0 }, { x: 1, y: 0.1 }, { x: 2, y: 0 }], 0.5)
 * // => [{ x: 0, y: 0 }, { x: 2, y: 0 }]
 * @since 3.1.5
 */
export function simplifyPolyline(points: readonly Point[], tolerance: number): Point[] {
  if (!(tolerance >= 0)) throw new RangeError(`simplifyPolyline: tolerance must be >= 0, got ${tolerance}`);
  if (points.length <= 2) return [...points];

  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;
  const ranges: [number, number][] = [[0, points.length - 1]];
  while (ranges.length > 0) {
    const [first, last] = ranges.pop()!;
    let farthest = -1;
    let farthestDistance = tolerance;
    for (let i = first + 1; i < last; i++) {
      const distance = distanceToSegment(points[i]!, points[first]!, points[last]!);
      // Strictly greater: a point exactly at tolerance (or on the line when tolerance is 0) goes.
      if (distance > farthestDistance) {
        farthest = i;
        farthestDistance = distance;
      }
    }
    if (farthest !== -1) {
      keep[farthest] = 1;
      ranges.push([first, farthest], [farthest, last]);
    }
  }
  return points.filter((_, i) => keep[i] === 1);
}

function distanceToSegment(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSquared = dx * dx + dy * dy;
  // Closest point of the segment: its projection, clamped to the ends (a when a and b coincide).
  const t = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSquared));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}
