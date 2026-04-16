/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { roundTo } from './roundTo';

describe('roundTo — property-based', () => {
  it('result has at most `decimals` decimal places', () => {
    fc.assert(
      fc.property(
        fc.float({ noNaN: true, noDefaultInfinity: true, min: -1e6, max: 1e6 }),
        fc.integer({ min: 0, max: 6 }),
        (value, decimals) => {
          const result = roundTo(value, decimals);
          // Check by converting to string and counting decimal places
          const str = result.toString();
          const dotIndex = str.indexOf('.');
          if (dotIndex === -1) {
            // Integer, 0 decimal places is fine
            expect(true).toBe(true);
          } else {
            const actualDecimals = str.length - dotIndex - 1;
            expect(actualDecimals).toBeLessThanOrEqual(decimals);
          }
        }
      )
    );
  });

  it('roundTo(integer, n) === integer for any n >= 0', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -10000, max: 10000 }),
        fc.integer({ min: 0, max: 10 }),
        (value, decimals) => {
          expect(roundTo(value, decimals)).toBe(value);
        }
      )
    );
  });
});

describe('roundTo — contract', () => {
  it('decimals=0 → returns integer', () => {
    expect(roundTo(3.7, 0)).toBe(4);
    expect(roundTo(3.2, 0)).toBe(3);
  });

  it('rounds to specified decimal places', () => {
    expect(roundTo(3.14159, 2)).toBe(3.14);
    expect(roundTo(3.14159, 4)).toBe(3.1416);
  });

  it('roundTo(1.005, 2): floating-point trap — actual behavior is 1 due to binary float representation', () => {
    // 1.005 cannot be represented exactly in binary floating point.
    // Math.round(1.005 * 100) = Math.round(100.49999...) = 100, not 101.
    // This is documented intentional behavior of Math.round.
    const result = roundTo(1.005, 2);
    // Document: result is 1 (not 1.01 as one might expect)
    expect(result).toBe(1);
  });

  it('negative decimals: multiplier becomes fraction, rounds to nearest 10^|n|', () => {
    // roundTo(1234, -2) = Math.round(1234 * 0.01) / 0.01 = Math.round(12.34) / 0.01 = 12 / 0.01 = 1200
    expect(roundTo(1234, -2)).toBe(1200);
    expect(roundTo(1250, -2)).toBe(1300);
  });

  it('negative value rounds correctly', () => {
    expect(roundTo(-3.456, 2)).toBe(-3.46);
  });

  it('0 → 0 for any decimals', () => {
    expect(roundTo(0, 0)).toBe(0);
    expect(roundTo(0, 5)).toBe(0);
  });
});
