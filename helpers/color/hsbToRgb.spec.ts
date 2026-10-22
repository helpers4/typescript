/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { hsbToRgb } from './hsbToRgb';

describe('hsbToRgb — property-based', () => {
  const percent = fc.double({ min: 0, max: 100, noNaN: true });

  it('channels are integers in [0, 255]', () => {
    fc.assert(fc.property(fc.double({ min: -1000, max: 1000, noNaN: true }), percent, percent, (h, s, b) => {
      const rgb = hsbToRgb({ h, s, b });
      for (const channel of [rgb.r, rgb.g, rgb.b]) {
        expect(Number.isInteger(channel)).toBe(true);
        expect(channel).toBeGreaterThanOrEqual(0);
        expect(channel).toBeLessThanOrEqual(255);
      }
    }));
  });

  it('the largest channel is the brightness', () => {
    fc.assert(fc.property(fc.double({ min: 0, max: 360, noNaN: true }), percent, percent, (h, s, b) => {
      const rgb = hsbToRgb({ h, s, b });
      expect(Math.max(rgb.r, rgb.g, rgb.b)).toBe(Math.round((b / 100) * 255));
    }));
  });
});
