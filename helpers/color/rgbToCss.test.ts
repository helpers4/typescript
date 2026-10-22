/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { rgbToCss } from './rgbToCss';

describe('rgbToCss', () => {
  it('formats an opaque color without alpha', () => {
    expect(rgbToCss({ r: 255, g: 128, b: 0 })).toBe('rgb(255 128 0)');
    expect(rgbToCss({ r: 255, g: 128, b: 0, a: 1 })).toBe('rgb(255 128 0)');
  });

  it('adds a translucent alpha, rounded to 3 decimals', () => {
    expect(rgbToCss({ r: 0, g: 0, b: 0, a: 0.5 })).toBe('rgb(0 0 0 / 0.5)');
    expect(rgbToCss({ r: 0, g: 0, b: 0, a: 1 / 3 })).toBe('rgb(0 0 0 / 0.333)');
  });

  it('clamps and rounds out-of-range values', () => {
    expect(rgbToCss({ r: 300, g: -5, b: 12.6, a: 2 })).toBe('rgb(255 0 13)');
    expect(rgbToCss({ r: 0, g: 0, b: 0, a: -1 })).toBe('rgb(0 0 0 / 0)');
  });
});
