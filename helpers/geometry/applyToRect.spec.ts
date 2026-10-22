/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { applyToPoint } from './applyToPoint';
import { applyToRect } from './applyToRect';
import { rotate } from './rotate';

const coord = fc.integer({ min: -1000, max: 1000 });
const length = fc.integer({ min: 0, max: 1000 });
const rect = fc.record({ x: coord, y: coord, width: length, height: length });

describe('applyToRect — property-based', () => {
  it('contains the transformed corners and has a non-negative size', () => {
    fc.assert(fc.property(rect, fc.double({ min: -10, max: 10, noNaN: true }), (r, angle) => {
      const m = rotate(angle);
      const box = applyToRect(m, r);
      expect(box.width).toBeGreaterThanOrEqual(0);
      expect(box.height).toBeGreaterThanOrEqual(0);
      for (const corner of [{ x: r.x, y: r.y }, { x: r.x + r.width, y: r.y + r.height }]) {
        const q = applyToPoint(m, corner);
        expect(q.x).toBeGreaterThanOrEqual(box.x - 1e-9);
        expect(q.x).toBeLessThanOrEqual(box.x + box.width + 1e-9);
        expect(q.y).toBeGreaterThanOrEqual(box.y - 1e-9);
        expect(q.y).toBeLessThanOrEqual(box.y + box.height + 1e-9);
      }
    }));
  });
});
