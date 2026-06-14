/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isEven } from './isEven';

describe('isEven — property-based', () => {
  it('n*2 is always even for any integer n', () => {
    fc.assert(
      fc.property(fc.integer({ min: -1_000_000, max: 1_000_000 }), (n) => {
        expect(isEven(n * 2)).toBe(true);
      }),
    );
  });

  it('n*2+1 is never even for any integer n', () => {
    fc.assert(
      fc.property(fc.integer({ min: -1_000_000, max: 1_000_000 }), (n) => {
        expect(isEven(n * 2 + 1)).toBe(false);
      }),
    );
  });

  it('primitives that are not number always return false', () => {
    fc.assert(
      fc.property(fc.oneof(fc.string(), fc.boolean()), (value) => {
        expect(isEven(value)).toBe(false);
      }),
    );
  });
});

describe('isEven — contract', () => {
  it('0 is even', () => expect(isEven(0)).toBe(true));
  it('-0 is even', () => expect(isEven(-0)).toBe(true));
  it('NaN → false', () => expect(isEven(NaN)).toBe(false));
  it('Infinity → false', () => expect(isEven(Infinity)).toBe(false));
  it('-Infinity → false', () => expect(isEven(-Infinity)).toBe(false));
  it('1.5 → false (non-integer)', () => expect(isEven(1.5)).toBe(false));
  it('2.0 → true (integer stored as float)', () => expect(isEven(2.0)).toBe(true));
});
