/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { cubicBezier } from './cubicBezier';

const unit = fc.double({ min: 0, max: 1, noNaN: true });
const y = fc.double({ min: -2, max: 3, noNaN: true });

describe('cubicBezier — property-based', () => {
  it('is non-decreasing when y1 and y2 are in [0, 1]', () => {
    fc.assert(fc.property(unit, unit, unit, unit, unit, unit, (x1, y1, x2, y2, t1, t2) => {
      const ease = cubicBezier(x1, y1, x2, y2);
      const [low, high] = t1 <= t2 ? [t1, t2] : [t2, t1];
      expect(ease(low)).toBeLessThanOrEqual(ease(high) + 1e-8);
    }));
  });

  it('returns a finite value for any input and valid control points', () => {
    fc.assert(fc.property(unit, y, unit, y, fc.double(), (x1, y1, x2, y2, t) => {
      expect(Number.isFinite(cubicBezier(x1, y1, x2, y2)(t))).toBe(true);
    }));
  });
});
