/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { applyToRect } from './applyToRect';
import { rectToRect } from './rectToRect';

const rect = fc.record({
  x: fc.integer({ min: -100, max: 100 }),
  y: fc.integer({ min: -100, max: 100 }),
  width: fc.integer({ min: 1, max: 100 }),
  height: fc.integer({ min: 1, max: 100 }),
});

describe('rectToRect — property-based', () => {
  it('maps the first rectangle onto the second', () => {
    fc.assert(fc.property(rect, rect, (from, to) => {
      const mapped = applyToRect(rectToRect(from, to), from);
      expect(mapped.x).toBeCloseTo(to.x, 6);
      expect(mapped.y).toBeCloseTo(to.y, 6);
      expect(mapped.width).toBeCloseTo(to.width, 6);
      expect(mapped.height).toBeCloseTo(to.height, 6);
    }));
  });
});
