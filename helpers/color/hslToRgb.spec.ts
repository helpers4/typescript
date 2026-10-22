/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { hslToRgb } from './hslToRgb';
import { rgbToHsl } from './rgbToHsl';

describe('hslToRgb — property-based', () => {
  it('always returns channels within [0, 255]', () => {
    fc.assert(
      fc.property(
        fc.float({ min: -1000, max: 1000, noNaN: true }),
        fc.float({ min: 0, max: 100, noNaN: true }),
        fc.float({ min: 0, max: 100, noNaN: true }),
        (h, s, l) => {
          const { r, g, b } = hslToRgb({ h, s, l });
          for (const channel of [r, g, b]) {
            expect(channel).toBeGreaterThanOrEqual(0);
            expect(channel).toBeLessThanOrEqual(255);
          }
        },
      ),
    );
  });

  it('round-trips through rgbToHsl within rounding tolerance', () => {
    const byte = fc.integer({ min: 0, max: 255 });
    fc.assert(
      fc.property(byte, byte, byte, (r, g, b) => {
        const hsl = rgbToHsl({ r, g, b });
        const roundTripped = hslToRgb(hsl);
        expect(Math.abs(roundTripped.r - r)).toBeLessThanOrEqual(1);
        expect(Math.abs(roundTripped.g - g)).toBeLessThanOrEqual(1);
        expect(Math.abs(roundTripped.b - b)).toBeLessThanOrEqual(1);
      }),
    );
  });
});
