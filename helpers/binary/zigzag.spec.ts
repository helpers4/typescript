/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { zigzagDecode } from './zigzagDecode';
import { zigzagEncode } from './zigzagEncode';

describe('zigzag — property-based', () => {
  it('decode inverts encode over the signed 64-bit range', () => {
    fc.assert(fc.property(fc.bigInt({ min: -(1n << 63n), max: (1n << 63n) - 1n }), (n) => zigzagDecode(zigzagEncode(n)) === n));
  });

  it('encode inverts decode over the unsigned 64-bit range', () => {
    fc.assert(fc.property(fc.bigInt({ min: 0n, max: (1n << 64n) - 1n }), (n) => zigzagEncode(zigzagDecode(n)) === n));
  });

  it('keeps small magnitudes small', () => {
    fc.assert(
      fc.property(fc.integer({ min: -1000, max: 1000 }), (n) => {
        expect(zigzagEncode(BigInt(n))).toBeLessThanOrEqual(BigInt(2 * Math.abs(n)));
      }),
    );
  });
});
