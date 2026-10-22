/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { hsbToRgb } from './hsbToRgb';
import { rgbToHsb } from './rgbToHsb';

describe('rgbToHsb — property-based', () => {
  const byte = fc.integer({ min: 0, max: 255 });

  it('h is in [0, 360), s/b are in [0, 100]', () => {
    fc.assert(fc.property(byte, byte, byte, (r, g, b) => {
      const hsb = rgbToHsb({ r, g, b });
      expect(hsb.h).toBeGreaterThanOrEqual(0);
      expect(hsb.h).toBeLessThan(360);
      expect(hsb.s).toBeGreaterThanOrEqual(0);
      expect(hsb.s).toBeLessThanOrEqual(100);
      expect(hsb.b).toBeGreaterThanOrEqual(0);
      expect(hsb.b).toBeLessThanOrEqual(100);
    }));
  });

  it('round-trips through hsbToRgb within 1 per channel', () => {
    fc.assert(fc.property(byte, byte, byte, (r, g, b) => {
      const back = hsbToRgb(rgbToHsb({ r, g, b }));
      expect(Math.abs(back.r - r)).toBeLessThanOrEqual(1);
      expect(Math.abs(back.g - g)).toBeLessThanOrEqual(1);
      expect(Math.abs(back.b - b)).toBeLessThanOrEqual(1);
    }));
  });
});
