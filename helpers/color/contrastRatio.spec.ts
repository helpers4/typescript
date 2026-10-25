/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { contrastRatio } from './contrastRatio';

const byte = fc.integer({ min: 0, max: 255 });
const color = fc.record({ r: byte, g: byte, b: byte });
const black = { r: 0, g: 0, b: 0 };
const white = { r: 255, g: 255, b: 255 };

describe('contrastRatio — property-based', () => {
  it('stays between 1 and 21', () => {
    fc.assert(
      fc.property(color, color, (a, b) => {
        const ratio = contrastRatio(a, b);
        expect(ratio).toBeGreaterThanOrEqual(1);
        expect(ratio).toBeLessThanOrEqual(21 + 1e-9);
      }),
    );
  });

  it('is 1 between a color and itself', () => {
    fc.assert(fc.property(color, (c) => {
      expect(contrastRatio(c, c)).toBe(1);
    }));
  });

  it('is symmetric', () => {
    fc.assert(fc.property(color, color, (a, b) => {
      expect(contrastRatio(a, b)).toBe(contrastRatio(b, a));
    }));
  });

  it('black on white is the maximum', () => {
    expect(contrastRatio(black, white)).toBeCloseTo(21, 10);
    fc.assert(fc.property(color, color, (a, b) => {
      expect(contrastRatio(a, b)).toBeLessThanOrEqual(contrastRatio(black, white) + 1e-9);
    }));
  });
});
