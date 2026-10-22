/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { applyToPoint } from './applyToPoint';
import { scale } from './scale';

const coord = fc.integer({ min: -1000, max: 1000 });
const point = fc.record({ x: coord, y: coord });

describe('scale — property-based', () => {
  it('multiplies the coordinates of any point', () => {
    fc.assert(fc.property(point, coord, coord, (p, sx, sy) => {
      const q = applyToPoint(scale(sx, sy), p);
      expect(q.x).toBeCloseTo(p.x * sx);
      expect(q.y).toBeCloseTo(p.y * sy);
    }));
  });
});
