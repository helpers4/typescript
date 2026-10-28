/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { rgbToUnit } from './rgbToUnit';
import { unitToRgb } from './unitToRgb';

describe('unit channels — property-based', () => {
  it('rgbToUnit then unitToRgb gives the color back', () => {
    const byte = fc.integer({ min: 0, max: 255 });
    fc.assert(fc.property(byte, byte, byte, (r, g, b) => {
      const back = unitToRgb(rgbToUnit({ r, g, b }));
      expect(back.r).toBeCloseTo(r, 9);
      expect(back.g).toBeCloseTo(g, 9);
      expect(back.b).toBeCloseTo(b, 9);
    }));
  });
});
