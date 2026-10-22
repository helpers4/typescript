/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { rgbToHsl } from './rgbToHsl';

describe('rgbToHsl — property-based', () => {
  const byte = fc.integer({ min: 0, max: 255 });

  it('h is always in [0, 360), s/l are always in [0, 100]', () => {
    fc.assert(
      fc.property(byte, byte, byte, (r, g, b) => {
        const { h, s, l } = rgbToHsl({ r, g, b });
        expect(h).toBeGreaterThanOrEqual(0);
        expect(h).toBeLessThan(360);
        expect(s).toBeGreaterThanOrEqual(0);
        expect(s).toBeLessThanOrEqual(100);
        expect(l).toBeGreaterThanOrEqual(0);
        expect(l).toBeLessThanOrEqual(100);
      }),
    );
  });

  it('any gray (r === g === b) has s = 0 and l equal to the normalized channel value', () => {
    fc.assert(
      fc.property(byte, (n) => {
        const { s, l } = rgbToHsl({ r: n, g: n, b: n });
        expect(s).toBe(0);
        expect(l).toBeCloseTo((n / 255) * 100, 0);
      }),
    );
  });

  it('preserves the alpha channel unchanged', () => {
    fc.assert(
      fc.property(byte, byte, byte, fc.float({ min: 0, max: 1, noNaN: true }), (r, g, b, a) => {
        expect(rgbToHsl({ r, g, b, a }).a).toBe(a);
      }),
    );
  });
});
