/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { union } from './union';

const coord = fc.integer({ min: -1000, max: 1000 });
const length = fc.integer({ min: 0, max: 1000 });
const rect = fc.record({ x: coord, y: coord, width: length, height: length });

describe('union — property-based', () => {
  it('contains every rectangle', () => {
    fc.assert(fc.property(fc.array(rect, { minLength: 1, maxLength: 10 }), (rects) => {
      const u = union(rects)!;
      for (const r of rects) {
        expect(r.x).toBeGreaterThanOrEqual(u.x);
        expect(r.y).toBeGreaterThanOrEqual(u.y);
        expect(r.x + r.width).toBeLessThanOrEqual(u.x + u.width + 1e-9);
        expect(r.y + r.height).toBeLessThanOrEqual(u.y + u.height + 1e-9);
      }
    }));
  });

  it('does not depend on the order', () => {
    fc.assert(fc.property(fc.array(rect, { maxLength: 10 }), (rects) => {
      expect(union(rects.toReversed())).toEqual(union(rects));
    }));
  });
});
