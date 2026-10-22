/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { rgbToHsl } from './rgbToHsl';

describe('rgbToHsl', () => {
  it('converts pure red', () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50, a: 1 });
  });

  it('converts pure green', () => {
    expect(rgbToHsl({ r: 0, g: 255, b: 0 })).toEqual({ h: 120, s: 100, l: 50, a: 1 });
  });

  it('converts pure blue', () => {
    expect(rgbToHsl({ r: 0, g: 0, b: 255 })).toEqual({ h: 240, s: 100, l: 50, a: 1 });
  });

  it('converts white to lightness 100 with no hue or saturation', () => {
    expect(rgbToHsl({ r: 255, g: 255, b: 255 })).toEqual({ h: 0, s: 0, l: 100, a: 1 });
  });

  it('converts black to lightness 0 with no hue or saturation', () => {
    expect(rgbToHsl({ r: 0, g: 0, b: 0 })).toEqual({ h: 0, s: 0, l: 0, a: 1 });
  });

  it('converts a gray (achromatic) color', () => {
    expect(rgbToHsl({ r: 128, g: 128, b: 128 })).toEqual({ h: 0, s: 0, l: 50.2, a: 1 });
  });

  it('normalizes a hue that computes negative before wrapping', () => {
    // r is max and b > g here, so (gN - bN) / delta is negative — this exercises
    // the `if (h < 0) h += 360` normalization branch.
    const result = rgbToHsl({ r: 200, g: 50, b: 100 });
    expect(result.h).toBeCloseTo(340, 0);
  });

  it('preserves the alpha channel', () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0, a: 0.5 })).toEqual({ h: 0, s: 100, l: 50, a: 0.5 });
  });

  it('defaults alpha to 1 when omitted', () => {
    expect(rgbToHsl({ r: 0, g: 0, b: 0 }).a).toBe(1);
  });
});
