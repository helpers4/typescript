/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { zigzagEncode } from './zigzagEncode';

describe('zigzagEncode', () => {
  it('maps values near zero to small unsigned values', () => {
    expect([0n, -1n, 1n, -2n, 2n].map(zigzagEncode)).toEqual([0n, 1n, 2n, 3n, 4n]);
  });

  it('covers the whole signed 64-bit range', () => {
    expect(zigzagEncode((1n << 63n) - 1n)).toBe((1n << 64n) - 2n);
    expect(zigzagEncode(-(1n << 63n))).toBe((1n << 64n) - 1n);
  });

  it('throws a RangeError outside the range', () => {
    expect(() => zigzagEncode(1n << 63n)).toThrow(RangeError);
    expect(() => zigzagEncode(-(1n << 63n) - 1n)).toThrow(RangeError);
  });
});
