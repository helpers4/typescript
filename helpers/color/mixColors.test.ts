/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { mixColors } from './mixColors';

const red = { r: 255, g: 0, b: 0 };
const blue = { r: 0, g: 0, b: 255 };
const black = { r: 0, g: 0, b: 0 };
const white = { r: 255, g: 255, b: 255 };

describe('mixColors', () => {
  it('mixes 50% by default (127.5 rounds up to 128)', () => {
    expect(mixColors(black, white)).toEqual({ r: 128, g: 128, b: 128, a: 1 });
  });

  it('is a weighted per-channel average for opaque colors', () => {
    // 255 * 0.25 = 63.75 -> 64 ; 255 * 0.75 = 191.25 -> 191
    expect(mixColors(red, blue, 25)).toEqual({ r: 64, g: 0, b: 191, a: 1 });
  });

  it('0% gives the base and 100% gives the color', () => {
    expect(mixColors(red, blue, 0)).toEqual({ ...blue, a: 1 });
    expect(mixColors(red, blue, 100)).toEqual({ ...red, a: 1 });
  });

  it('clamps the percentage', () => {
    expect(mixColors(red, blue, -20)).toEqual({ ...blue, a: 1 });
    expect(mixColors(red, blue, 250)).toEqual({ ...red, a: 1 });
  });

  it('interpolates alpha in premultiplied space', () => {
    // premultiplied: color (127.5, 0, 0, 0.5), base (0, 0, 255, 1) -> (63.75, 0, 127.5, 0.75)
    // unpremultiplied: (85, 0, 170), alpha 0.75
    expect(mixColors({ ...red, a: 0.5 }, blue)).toEqual({ r: 85, g: 0, b: 170, a: 0.75 });
  });

  it('weighs a translucent base less', () => {
    // color opaque red, base blue at 0.5, 50%: premult (127.5, 0, 63.75, 0.75) -> (170, 0, 85)
    expect(mixColors(red, { ...blue, a: 0.5 })).toEqual({ r: 170, g: 0, b: 85, a: 0.75 });
  });

  it('rounds alpha to 3 decimals', () => {
    // 0.3333 * 0.5 + 1 * 0.5 = 0.66665 -> 0.667
    expect(mixColors({ ...red, a: 0.3333 }, blue).a).toBe(0.667);
  });

  it('gives transparent black when both colors are fully transparent', () => {
    expect(mixColors({ ...red, a: 0 }, { ...blue, a: 0 })).toEqual({ r: 0, g: 0, b: 0, a: 0 });
  });

  it('gives the other color when one is fully transparent and gets no weight', () => {
    expect(mixColors({ ...red, a: 0 }, blue, 0)).toEqual({ ...blue, a: 1 });
  });

  it('throws a RangeError for a NaN percent', () => {
    expect(() => mixColors({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }, Number.NaN)).toThrow(RangeError);
  });
});
