/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { hsbToRgb } from './hsbToRgb';

describe('hsbToRgb', () => {
  it('converts each hue sector', () => {
    expect(hsbToRgb({ h: 0, s: 100, b: 100 })).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(hsbToRgb({ h: 60, s: 100, b: 100 })).toEqual({ r: 255, g: 255, b: 0, a: 1 });
    expect(hsbToRgb({ h: 120, s: 100, b: 100 })).toEqual({ r: 0, g: 255, b: 0, a: 1 });
    expect(hsbToRgb({ h: 180, s: 100, b: 100 })).toEqual({ r: 0, g: 255, b: 255, a: 1 });
    expect(hsbToRgb({ h: 240, s: 100, b: 100 })).toEqual({ r: 0, g: 0, b: 255, a: 1 });
    expect(hsbToRgb({ h: 300, s: 100, b: 100 })).toEqual({ r: 255, g: 0, b: 255, a: 1 });
  });

  it('wraps the hue', () => {
    expect(hsbToRgb({ h: -120, s: 100, b: 100 })).toEqual(hsbToRgb({ h: 240, s: 100, b: 100 }));
    expect(hsbToRgb({ h: 480, s: 100, b: 100 })).toEqual(hsbToRgb({ h: 120, s: 100, b: 100 }));
  });

  it('brightness 0 is black, saturation 0 is gray, alpha is kept', () => {
    expect(hsbToRgb({ h: 200, s: 80, b: 0 })).toEqual({ r: 0, g: 0, b: 0, a: 1 });
    expect(hsbToRgb({ h: 200, s: 0, b: 50, a: 0.3 })).toEqual({ r: 128, g: 128, b: 128, a: 0.3 });
  });
});
