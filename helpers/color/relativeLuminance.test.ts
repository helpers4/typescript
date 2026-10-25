/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { relativeLuminance } from './relativeLuminance';

describe('relativeLuminance', () => {
  it('is 0 for black and 1 for white', () => {
    expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBe(0);
    expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 10);
  });

  it('weighs the primaries with the WCAG coefficients', () => {
    expect(relativeLuminance({ r: 255, g: 0, b: 0 })).toBeCloseTo(0.2126, 10);
    expect(relativeLuminance({ r: 0, g: 255, b: 0 })).toBeCloseTo(0.7152, 10);
    expect(relativeLuminance({ r: 0, g: 0, b: 255 })).toBeCloseTo(0.0722, 10);
  });

  it('linearises a mid gray with the gamma curve', () => {
    expect(relativeLuminance({ r: 128, g: 128, b: 128 })).toBeCloseTo(0.2158605, 6);
  });

  it('uses the linear segment at and below the 0.04045 threshold', () => {
    expect(relativeLuminance({ r: 10, g: 10, b: 10 })).toBeCloseTo(0.0030353, 7);
  });

  it('uses the power segment above the threshold', () => {
    expect(relativeLuminance({ r: 11, g: 11, b: 11 })).toBeCloseTo(0.0033465, 7);
  });

  it('ignores alpha', () => {
    expect(relativeLuminance({ r: 255, g: 0, b: 0, a: 0.1 })).toBe(relativeLuminance({ r: 255, g: 0, b: 0 }));
  });
});
