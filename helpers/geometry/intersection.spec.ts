/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { intersects } from './intersects';
import { intersection } from './intersection';

const coord = fc.integer({ min: -1000, max: 1000 });
const length = fc.integer({ min: 0, max: 1000 });
const rect = fc.record({ x: coord, y: coord, width: length, height: length });

describe('intersection — property-based', () => {
  it('is symmetric and agrees with intersects', () => {
    fc.assert(fc.property(rect, rect, (a, b) => {
      expect(intersection(a, b)).toEqual(intersection(b, a));
      expect(intersection(a, b) !== undefined).toBe(intersects(a, b));
    }));
  });

  it('lies inside both rectangles', () => {
    fc.assert(fc.property(rect, rect, (a, b) => {
      const i = intersection(a, b);
      if (!i) return;
      for (const r of [a, b]) {
        expect(i.x).toBeGreaterThanOrEqual(r.x);
        expect(i.x + i.width).toBeLessThanOrEqual(r.x + r.width + 1e-9);
      }
    }));
  });
});
