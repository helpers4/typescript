/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { zigzagDecode } from './zigzagDecode';

describe('zigzagDecode', () => {
  it('maps back to signed values', () => {
    expect([0n, 1n, 2n, 3n, 4n].map(zigzagDecode)).toEqual([0n, -1n, 1n, -2n, 2n]);
  });

  it('covers the whole unsigned 64-bit range', () => {
    expect(zigzagDecode((1n << 64n) - 1n)).toBe(-(1n << 63n));
    expect(zigzagDecode((1n << 64n) - 2n)).toBe((1n << 63n) - 1n);
  });

  it('throws a RangeError outside the range', () => {
    expect(() => zigzagDecode(-1n)).toThrow(RangeError);
    expect(() => zigzagDecode(1n << 64n)).toThrow(RangeError);
  });
});
