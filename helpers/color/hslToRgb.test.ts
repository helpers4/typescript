/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { hslToRgb } from './hslToRgb';

describe('hslToRgb', () => {
  it('converts hue 0 (red)', () => {
    expect(hslToRgb({ h: 0, s: 100, l: 50 })).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it('converts hue 60 (yellow)', () => {
    expect(hslToRgb({ h: 60, s: 100, l: 50 })).toEqual({ r: 255, g: 255, b: 0, a: 1 });
  });

  it('converts hue 120 (green)', () => {
    expect(hslToRgb({ h: 120, s: 100, l: 50 })).toEqual({ r: 0, g: 255, b: 0, a: 1 });
  });

  it('converts hue 180 (cyan)', () => {
    expect(hslToRgb({ h: 180, s: 100, l: 50 })).toEqual({ r: 0, g: 255, b: 255, a: 1 });
  });

  it('converts hue 240 (blue)', () => {
    expect(hslToRgb({ h: 240, s: 100, l: 50 })).toEqual({ r: 0, g: 0, b: 255, a: 1 });
  });

  it('converts hue 300 (magenta)', () => {
    expect(hslToRgb({ h: 300, s: 100, l: 50 })).toEqual({ r: 255, g: 0, b: 255, a: 1 });
  });

  it('converts white (l = 100)', () => {
    expect(hslToRgb({ h: 0, s: 0, l: 100 })).toEqual({ r: 255, g: 255, b: 255, a: 1 });
  });

  it('converts black (l = 0)', () => {
    expect(hslToRgb({ h: 0, s: 0, l: 0 })).toEqual({ r: 0, g: 0, b: 0, a: 1 });
  });

  it('normalizes a negative hue', () => {
    expect(hslToRgb({ h: -360, s: 100, l: 50 })).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it('normalizes a hue above 360', () => {
    expect(hslToRgb({ h: 720, s: 100, l: 50 })).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it('preserves the alpha channel', () => {
    expect(hslToRgb({ h: 0, s: 100, l: 50, a: 0.5 })).toEqual({ r: 255, g: 0, b: 0, a: 0.5 });
  });

  it('defaults alpha to 1 when omitted', () => {
    expect(hslToRgb({ h: 0, s: 0, l: 0 }).a).toBe(1);
  });
});
