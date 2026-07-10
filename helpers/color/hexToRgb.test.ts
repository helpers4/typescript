/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { hexToRgb } from './hexToRgb';

describe('hexToRgb', () => {
  it('parses a 6-digit hex color', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it('parses a 6-digit hex color without a leading #', () => {
    expect(hexToRgb('00ff00')).toEqual({ r: 0, g: 255, b: 0, a: 1 });
  });

  it('parses a 3-digit shorthand hex color', () => {
    expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it('parses an 8-digit hex color with alpha', () => {
    expect(hexToRgb('#ff000080')).toEqual({ r: 255, g: 0, b: 0, a: 0.502 });
  });

  it('parses a 4-digit shorthand hex color with alpha', () => {
    expect(hexToRgb('#f00f')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(hexToRgb('#f008')).toEqual({ r: 255, g: 0, b: 0, a: 0.533 });
  });

  it('is case-insensitive', () => {
    expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it('trims surrounding whitespace', () => {
    expect(hexToRgb('  #ff0000  ')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it('returns null for an invalid hex color', () => {
    expect(hexToRgb('not-a-color')).toBeNull();
    expect(hexToRgb('#12345')).toBeNull(); // 5 digits is not a valid length
    expect(hexToRgb('#gggggg')).toBeNull();
    expect(hexToRgb('')).toBeNull();
  });
});
