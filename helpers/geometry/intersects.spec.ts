/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { intersects } from './intersects';

const coord = fc.integer({ min: -1000, max: 1000 });
const length = fc.integer({ min: 0, max: 1000 });
const rect = fc.record({ x: coord, y: coord, width: length, height: length });

describe('intersects — property-based', () => {
  it('is symmetric', () => {
    fc.assert(fc.property(rect, rect, (a, b) => {
      expect(intersects(a, b)).toBe(intersects(b, a));
    }));
  });

  it('a rectangle with an area intersects itself', () => {
    fc.assert(fc.property(rect.filter((r) => r.width > 0 && r.height > 0), (r) => {
      expect(intersects(r, r)).toBe(true);
    }));
  });
});
