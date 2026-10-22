/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isOdd } from './isOdd';

describe('isOdd — property-based', () => {
  it('n*2+1 is always odd for any integer n', () => {
    fc.assert(
      fc.property(fc.integer({ min: -1_000_000, max: 1_000_000 }), (n) => {
        expect(isOdd(n * 2 + 1)).toBe(true);
      }),
    );
  });

  it('n*2 is never odd for any integer n', () => {
    fc.assert(
      fc.property(fc.integer({ min: -1_000_000, max: 1_000_000 }), (n) => {
        expect(isOdd(n * 2)).toBe(false);
      }),
    );
  });

  it('primitives that are not number always return false', () => {
    fc.assert(
      fc.property(fc.oneof(fc.string(), fc.boolean()), (value) => {
        expect(isOdd(value)).toBe(false);
      }),
    );
  });
});

describe('isOdd — contract', () => {
  it('0 is not odd', () => expect(isOdd(0)).toBe(false));
  it('-0 is not odd', () => expect(isOdd(-0)).toBe(false));
  it('NaN → false', () => expect(isOdd(NaN)).toBe(false));
  it('Infinity → false', () => expect(isOdd(Infinity)).toBe(false));
  it('-Infinity → false', () => expect(isOdd(-Infinity)).toBe(false));
  it('1.5 → false (non-integer)', () => expect(isOdd(1.5)).toBe(false));
  it('3.0 → true (integer stored as float)', () => expect(isOdd(3.0)).toBe(true));
});
