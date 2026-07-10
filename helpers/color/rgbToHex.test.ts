/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { rgbToHex } from './rgbToHex';

describe('rgbToHex', () => {
  it('formats an opaque color as a 6-digit hex string', () => {
    expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#ff0000');
  });

  it('defaults alpha to 1 (opaque) when omitted', () => {
    expect(rgbToHex({ r: 0, g: 255, b: 0 })).toBe('#00ff00');
  });

  it('appends the alpha byte when alpha is below 1', () => {
    expect(rgbToHex({ r: 0, g: 255, b: 0, a: 0.5 })).toBe('#00ff0080');
  });

  it('omits the alpha byte when alpha is exactly 1', () => {
    expect(rgbToHex({ r: 0, g: 0, b: 255, a: 1 })).toBe('#0000ff');
  });

  it('clamps out-of-range channels', () => {
    expect(rgbToHex({ r: 300, g: -10, b: 128 })).toBe('#ff0080');
  });

  it('clamps out-of-range alpha', () => {
    expect(rgbToHex({ r: 0, g: 0, b: 0, a: 2 })).toBe('#000000');
    expect(rgbToHex({ r: 0, g: 0, b: 0, a: -1 })).toBe('#00000000');
  });

  it('rounds fractional channels', () => {
    expect(rgbToHex({ r: 127.6, g: 0, b: 0 })).toBe('#800000');
  });
});
