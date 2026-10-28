/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { rgbToCss } from './rgbToCss';
import { rgbToHex } from './rgbToHex';
import { rgbToUnit } from './rgbToUnit';
import { unitToRgb } from './unitToRgb';

describe('unitToRgb', () => {
  it('scales the channels to 0-255 and keeps alpha', () => {
    expect(unitToRgb({ r: 1, g: 0.5, b: 0, a: 0.25 })).toEqual({ r: 255, g: 127.5, b: 0, a: 0.25 });
  });

  it('defaults to opaque', () => {
    expect(unitToRgb({ r: 0, g: 0, b: 0 }).a).toBe(1);
  });

  it('feeds the CSS and hex writers', () => {
    expect(rgbToHex(unitToRgb({ r: 1, g: 0.5, b: 0, a: 0.5 }))).toBe('#ff800080');
    expect(rgbToCss(unitToRgb({ r: 1, g: 0, b: 0 }))).toBe('rgb(255 0 0)');
  });
});

describe('rgbToUnit', () => {
  it('scales the channels to 0-1 and keeps alpha', () => {
    expect(rgbToUnit({ r: 255, g: 51, b: 0, a: 0.5 })).toEqual({ r: 1, g: 0.2, b: 0, a: 0.5 });
  });

  it('defaults to opaque', () => {
    expect(rgbToUnit({ r: 0, g: 0, b: 0 }).a).toBe(1);
  });
});
