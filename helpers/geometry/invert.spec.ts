/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { applyToPoint } from './applyToPoint';
import { invert } from './invert';
import { multiply } from './multiply';
import { rotate } from './rotate';
import { scale } from './scale';
import { translate } from './translate';

const coord = fc.integer({ min: -1000, max: 1000 });
const point = fc.record({ x: coord, y: coord });

const factor = fc.double({ min: 0.1, max: 10, noNaN: true });

describe('invert — property-based', () => {
  it('brings any point back where it was', () => {
    fc.assert(fc.property(coord, coord, fc.double({ min: -10, max: 10, noNaN: true }), factor, factor, point, (tx, ty, angle, sx, sy, p) => {
      const m = multiply(translate(tx, ty), rotate(angle), scale(sx, sy));
      const back = applyToPoint(invert(m)!, applyToPoint(m, p));
      expect(back.x).toBeCloseTo(p.x, 6);
      expect(back.y).toBeCloseTo(p.y, 6);
    }));
  });

  it('returns undefined whenever the determinant is 0', () => {
    fc.assert(fc.property(coord, coord, fc.integer({ min: -10, max: 10 }), coord, (a, b, k, e) => {
      expect(invert({ a, b, c: a * k, d: b * k, e, f: 0 })).toBeUndefined();
    }));
  });
});
