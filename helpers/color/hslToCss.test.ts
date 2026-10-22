/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { hslToCss } from './hslToCss';

describe('hslToCss', () => {
  it('formats an opaque color without alpha', () => {
    expect(hslToCss({ h: 210, s: 100, l: 50 })).toBe('hsl(210 100% 50%)');
    expect(hslToCss({ h: 0, s: 0, l: 0, a: 1 })).toBe('hsl(0 0% 0%)');
  });

  it('adds a translucent alpha, rounded to 3 decimals', () => {
    expect(hslToCss({ h: 10, s: 20, l: 30, a: 1 / 3 })).toBe('hsl(10 20% 30% / 0.333)');
  });

  it('wraps the hue and clamps the rest', () => {
    expect(hslToCss({ h: -30, s: 120, l: -5, a: -1 })).toBe('hsl(330 100% 0% / 0)');
    expect(hslToCss({ h: 720, s: 50, l: 50, a: 2 })).toBe('hsl(0 50% 50%)');
    expect(hslToCss({ h: 359.97, s: 12.345, l: 50, })).toBe('hsl(0 12.3% 50%)');
  });
});
