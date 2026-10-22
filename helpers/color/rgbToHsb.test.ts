/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { rgbToHsb } from './rgbToHsb';

describe('rgbToHsb', () => {
  it('converts the primaries', () => {
    expect(rgbToHsb({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, b: 100, a: 1 });
    expect(rgbToHsb({ r: 0, g: 255, b: 0 })).toEqual({ h: 120, s: 100, b: 100, a: 1 });
    expect(rgbToHsb({ r: 0, g: 0, b: 255 })).toEqual({ h: 240, s: 100, b: 100, a: 1 });
  });

  it('wraps negative hues (magenta side of red)', () => {
    expect(rgbToHsb({ r: 255, g: 0, b: 128 }).h).toBe(329.9);
  });

  it('black and grays have no saturation', () => {
    expect(rgbToHsb({ r: 0, g: 0, b: 0 })).toEqual({ h: 0, s: 0, b: 0, a: 1 });
    expect(rgbToHsb({ r: 128, g: 128, b: 128 })).toEqual({ h: 0, s: 0, b: 50.2, a: 1 });
  });

  it('keeps alpha', () => {
    expect(rgbToHsb({ r: 255, g: 255, b: 255, a: 0.4 })).toEqual({ h: 0, s: 0, b: 100, a: 0.4 });
  });
});
