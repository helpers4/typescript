/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { simplifyPolyline } from './simplifyPolyline';
import type { Point } from './types';

const coord = fc.integer({ min: -1000, max: 1000 });
const point = fc.record({ x: coord, y: coord });

function distanceToSegment(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const l = dx * dx + dy * dy;
  const t = l === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / l));
  return Math.hypot(p.x - a.x - t * dx, p.y - a.y - t * dy);
}

const polyline = fc.array(point, { maxLength: 40 });
const tolerance = fc.double({ min: 0, max: 50, noNaN: true });

describe('simplifyPolyline — property-based', () => {
  it('keeps a subsequence that includes the first and last points', () => {
    fc.assert(fc.property(polyline, tolerance, (points, tol) => {
      const kept = simplifyPolyline(points, tol);
      let i = 0;
      for (const p of kept) {
        while (points[i] !== p) i++;
        i++;
      }
      if (points.length > 0) {
        expect(kept[0]).toBe(points[0]);
        expect(kept.at(-1)).toBe(points.at(-1));
      }
    }));
  });

  it('every removed point is within tolerance of the segment that replaced it', () => {
    fc.assert(fc.property(polyline, tolerance, (points, tol) => {
      const kept = simplifyPolyline(points, tol);
      let k = 0;
      points.forEach((p, i) => {
        if (p === kept[k]) { k++; return; }
        const a = kept[k - 1]!;
        const b = kept[k]!;
        expect(distanceToSegment(p, a, b)).toBeLessThanOrEqual(tol + 1e-9);
        void i;
      });
    }));
  });
});
