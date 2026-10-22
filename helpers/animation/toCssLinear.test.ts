/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { toCssLinear } from './toCssLinear';

describe('toCssLinear', () => {
  it('samples evenly in time', () => {
    expect(toCssLinear((t) => t * t, 5)).toBe('linear(0, 0.0625, 0.25, 0.5625, 1)');
  });

  it('uses 32 samples by default', () => {
    expect(toCssLinear((t) => t).split(',')).toHaveLength(32);
  });

  it('rounds to 4 decimals and writes no -0', () => {
    expect(toCssLinear((t) => (t === 0 ? -0.00001 : 1 / 3), 2)).toBe('linear(0, 0.3333)');
  });

  it('rejects fewer than 2 or fractional samples', () => {
    expect(() => toCssLinear((t) => t, 1)).toThrow(RangeError);
    expect(() => toCssLinear((t) => t, 2.5)).toThrow(RangeError);
  });
});
