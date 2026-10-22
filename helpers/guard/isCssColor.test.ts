/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isCssColor } from './isCssColor';

describe('isCssColor', () => {
  it('rejects non-string values', () => {
    expect(isCssColor(42)).toBe(false);
    expect(isCssColor(null)).toBe(false);
    expect(isCssColor(undefined)).toBe(false);
    expect(isCssColor({})).toBe(false);
  });

  it('rejects empty or whitespace-only strings', () => {
    expect(isCssColor('')).toBe(false);
    expect(isCssColor('   ')).toBe(false);
  });

  it('accepts valid hex colors', () => {
    expect(isCssColor('#fff')).toBe(true);
    expect(isCssColor('#ffff')).toBe(true);
    expect(isCssColor('#ffffff')).toBe(true);
    expect(isCssColor('#ffffffff')).toBe(true);
    expect(isCssColor('#FF00aa')).toBe(true);
  });

  it('rejects malformed hex colors', () => {
    expect(isCssColor('#ff')).toBe(false);
    expect(isCssColor('#fffff')).toBe(false);
    expect(isCssColor('#gggggg')).toBe(false);
  });

  it('rejects a hex-like value missing its leading #', () => {
    // Digits alone aren't a valid named color either, so this stays rejected —
    // unlike 'fff', which is indistinguishable from a bare named-color token
    // (see the documented limitation on the named-color branch).
    expect(isCssColor('123')).toBe(false);
  });

  it('accepts functional color notations', () => {
    expect(isCssColor('rgb(255, 0, 0)')).toBe(true);
    expect(isCssColor('rgba(0,0,0,0.5)')).toBe(true);
    expect(isCssColor('hsl(120, 50%, 50%)')).toBe(true);
    expect(isCssColor('hsla(120 50% 50% / 0.5)')).toBe(true);
  });

  it('rejects malformed functional color notations', () => {
    expect(isCssColor('rgb(255, 0, 0')).toBe(false);
    expect(isCssColor('cmyk(0, 0, 0, 1)')).toBe(false);
    expect(isCssColor('rgb(calc(1 + 1), 0, 0)')).toBe(false);
  });

  it('accepts single-word named colors, case-insensitively', () => {
    expect(isCssColor('red')).toBe(true);
    expect(isCssColor('RebeccaPurple')).toBe(true);
  });

  it('trims surrounding whitespace before validating', () => {
    expect(isCssColor('  red  ')).toBe(true);
  });

  it('rejects values that could inject additional CSS declarations', () => {
    expect(isCssColor('red; background: url(evil)')).toBe(false);
    expect(isCssColor('red}body{color:blue')).toBe(false);
    expect(isCssColor('red\\')).toBe(false);
    expect(isCssColor('light blue')).toBe(false);
  });
});
