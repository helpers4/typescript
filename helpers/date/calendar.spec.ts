/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { daysInMonth, isLeapYear } from './calendar';

describe('isLeapYear — property-based', () => {
  it('leap years always have 29 days in February', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 9999 }).filter((y) => isLeapYear(y)),
        (year) => {
          expect(daysInMonth(year, 2)).toBe(29);
        }
      )
    );
  });

  it('non-leap years always have 28 days in February', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 9999 }).filter((y) => !isLeapYear(y)),
        (year) => {
          expect(daysInMonth(year, 2)).toBe(28);
        }
      )
    );
  });

  it('multiples of 400 are always leap years', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 25 }), (n) => {
        expect(isLeapYear(n * 400)).toBe(true);
      })
    );
  });

  it('multiples of 100 (not 400) are never leap years', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 99 }).filter((n) => n % 4 !== 0),
        (n) => {
          expect(isLeapYear(n * 100)).toBe(false);
        }
      )
    );
  });
});

describe('daysInMonth — property-based', () => {
  it('always returns 28 or 29 for February', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 9999 }), (year) => {
        const days = daysInMonth(year, 2);
        expect(days === 28 || days === 29).toBe(true);
      })
    );
  });

  it('always returns 28–31 for valid months', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 9999 }),
        fc.integer({ min: 1, max: 12 }),
        (year, month) => {
          const days = daysInMonth(year, month);
          expect(days).toBeGreaterThanOrEqual(28);
          expect(days).toBeLessThanOrEqual(31);
        }
      )
    );
  });

  it('Jan, Mar, May, Jul, Aug, Oct, Dec always have 31 days', () => {
    const months31 = [1, 3, 5, 7, 8, 10, 12];
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 9999 }),
        fc.constantFrom(...months31),
        (year, month) => {
          expect(daysInMonth(year, month)).toBe(31);
        }
      )
    );
  });

  it('Apr, Jun, Sep, Nov always have 30 days', () => {
    const months30 = [4, 6, 9, 11];
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 9999 }),
        fc.constantFrom(...months30),
        (year, month) => {
          expect(daysInMonth(year, month)).toBe(30);
        }
      )
    );
  });

  it('out-of-range months return NaN', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 9999 }),
        fc.oneof(
          fc.integer({ min: -100, max: 0 }),
          fc.integer({ min: 13, max: 100 })
        ),
        (year, month) => {
          expect(daysInMonth(year, month)).toBeNaN();
        }
      )
    );
  });
});
