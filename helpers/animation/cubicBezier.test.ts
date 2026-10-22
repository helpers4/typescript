/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { cubicBezier } from './cubicBezier';

describe('cubicBezier', () => {
  it('matches the CSS ease curve', () => {
    const ease = cubicBezier(0.25, 0.1, 0.25, 1);
    expect(ease(0.5)).toBeCloseTo(0.8024, 4);
    expect(ease(0.25)).toBeCloseTo(0.4085, 4);
  });

  it('is the identity for a straight curve', () => {
    const linear = cubicBezier(0, 0, 1, 1);
    for (const t of [0.1, 0.33, 0.9]) expect(linear(t)).toBeCloseTo(t, 9);
  });

  it('pins and clamps the ends', () => {
    const ease = cubicBezier(0.42, 0, 0.58, 1);
    expect(ease(0)).toBe(0);
    expect(ease(1)).toBe(1);
    expect(ease(-1)).toBe(0);
    expect(ease(2)).toBe(1);
  });

  it('allows overshooting y values', () => {
    const back = cubicBezier(0.34, 1.56, 0.64, 1);
    expect(back(0.5)).toBeGreaterThan(1);
  });

  it('rejects x control points outside [0, 1]', () => {
    expect(() => cubicBezier(-0.1, 0, 1, 1)).toThrow(RangeError);
    expect(() => cubicBezier(0, 0, 1.1, 1)).toThrow(RangeError);
    expect(() => cubicBezier(Number.NaN, 0, 1, 1)).toThrow(RangeError);
  });
});
