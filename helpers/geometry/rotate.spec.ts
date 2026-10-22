/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { applyToPoint } from './applyToPoint';
import { rotate } from './rotate';

const coord = fc.integer({ min: -1000, max: 1000 });
const point = fc.record({ x: coord, y: coord });

describe('rotate — property-based', () => {
  it('keeps the distance to the origin', () => {
    fc.assert(fc.property(point, fc.double({ min: -10, max: 10, noNaN: true }), (p, angle) => {
      const q = applyToPoint(rotate(angle), p);
      expect(Math.hypot(q.x, q.y)).toBeCloseTo(Math.hypot(p.x, p.y), 6);
    }));
  });
});
