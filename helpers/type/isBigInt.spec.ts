/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isBigInt } from './isBigInt';

describe('isBigInt — property-based', () => {
  it('bigint values are always bigint', () => {
    fc.assert(
      fc.property(fc.bigInt(), (v) => {
        expect(isBigInt(v)).toBe(true);
      }),
    );
  });

  it('numbers are never bigint', () => {
    fc.assert(
      fc.property(fc.double({ noNaN: true }), (v) => {
        expect(isBigInt(v)).toBe(false);
      }),
    );
  });

  it('strings are never bigint', () => {
    fc.assert(
      fc.property(fc.string(), (v) => {
        expect(isBigInt(v)).toBe(false);
      }),
    );
  });
});

describe('isBigInt — contract', () => {
  it('1n → true', () => expect(isBigInt(1n)).toBe(true));
  it('BigInt(42) → true', () => expect(isBigInt(BigInt(42))).toBe(true));
  it('0n → true', () => expect(isBigInt(0n)).toBe(true));
  it('-1n → true', () => expect(isBigInt(-1n)).toBe(true));
  it('1 → false', () => expect(isBigInt(1)).toBe(false));
  it("'1n' → false", () => expect(isBigInt('1n')).toBe(false));
  it('null → false', () => expect(isBigInt(null)).toBe(false));
  it('undefined → false', () => expect(isBigInt(undefined)).toBe(false));
  it('true → false', () => expect(isBigInt(true)).toBe(false));
});
