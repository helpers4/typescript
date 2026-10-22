/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { hslToCss } from './hslToCss';

describe('hslToCss — property-based', () => {
  it('always writes a hue in [0, 360) and percentages in [0, 100]', () => {
    fc.assert(fc.property(fc.double({ min: -1e4, max: 1e4, noNaN: true }), fc.double({ min: -50, max: 150, noNaN: true }), fc.double({ min: -50, max: 150, noNaN: true }), (h, s, l) => {
      const match = /^hsl\((\S+) (\S+)% (\S+)%\)$/.exec(hslToCss({ h, s, l }))!;
      const [hue, sat, light] = match.slice(1).map(Number) as [number, number, number];
      expect(hue).toBeGreaterThanOrEqual(0);
      expect(hue).toBeLessThan(360);
      for (const value of [sat, light]) {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(100);
      }
    }));
  });
});
