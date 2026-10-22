/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { eachDay, eachMonth } from './sequence';

const validDate = fc.date({
  min: new Date('2024-01-01'),
  max: new Date('2025-12-31'),
  noInvalidDate: true,
});

/** Returns an ordered pair [earlier, later]. */
function ordered(a: Date, b: Date): [Date, Date] {
  return a.getTime() <= b.getTime() ? [a, b] : [b, a];
}

// ---------------------------------------------------------------------------
// eachDay — property-based
// ---------------------------------------------------------------------------

describe('eachDay — property-based', () => {
  it('length equals (end - start) in days + 1', () => {
    fc.assert(
      fc.property(validDate, validDate, (a, b) => {
        const [s, e] = ordered(a, b);
        const result = eachDay(s, e);
        // eachDay normalizes to midnight, so compute expected from midnight-aligned dates
        const sDay = new Date(s);
        sDay.setHours(0, 0, 0, 0);
        const eDay = new Date(e);
        eDay.setHours(0, 0, 0, 0);
        const expectedDays =
          Math.round((eDay.getTime() - sDay.getTime()) / 86_400_000) + 1;
        expect(result.length).toBe(expectedDays);
      })
    );
  });

  it('all dates are in ascending order', () => {
    fc.assert(
      fc.property(validDate, validDate, (a, b) => {
        const [s, e] = ordered(a, b);
        const result = eachDay(s, e);
        for (let i = 1; i < result.length; i++) {
          expect(result[i].getTime()).toBeGreaterThan(result[i - 1].getTime());
        }
      })
    );
  });

  it('all dates have time 00:00:00.000', () => {
    fc.assert(
      fc.property(validDate, validDate, (a, b) => {
        const [s, e] = ordered(a, b);
        const result = eachDay(s, e);
        for (const d of result) {
          expect(d.getHours()).toBe(0);
          expect(d.getMinutes()).toBe(0);
          expect(d.getSeconds()).toBe(0);
          expect(d.getMilliseconds()).toBe(0);
        }
      })
    );
  });

  it('consecutive dates differ by exactly 1 calendar day', () => {
    fc.assert(
      fc.property(validDate, validDate, (a, b) => {
        const [s, e] = ordered(a, b);
        const result = eachDay(s, e);
        for (let i = 1; i < result.length; i++) {
          const prev = result[i - 1];
          const curr = result[i];
          const expected = new Date(prev);
          expected.setDate(expected.getDate() + 1);
          expect(curr.getFullYear()).toBe(expected.getFullYear());
          expect(curr.getMonth()).toBe(expected.getMonth());
          expect(curr.getDate()).toBe(expected.getDate());
        }
      })
    );
  });
});

// ---------------------------------------------------------------------------
// eachMonth — property-based
// ---------------------------------------------------------------------------

describe('eachMonth — property-based', () => {
  it('all dates are the 1st of their month', () => {
    fc.assert(
      fc.property(validDate, validDate, (a, b) => {
        const [s, e] = ordered(a, b);
        const result = eachMonth(s, e);
        for (const d of result) {
          expect(d.getDate()).toBe(1);
        }
      })
    );
  });

  it('all dates are in ascending order', () => {
    fc.assert(
      fc.property(validDate, validDate, (a, b) => {
        const [s, e] = ordered(a, b);
        const result = eachMonth(s, e);
        for (let i = 1; i < result.length; i++) {
          expect(result[i].getTime()).toBeGreaterThan(result[i - 1].getTime());
        }
      })
    );
  });

  it('length equals the number of months in the range', () => {
    fc.assert(
      fc.property(validDate, validDate, (a, b) => {
        const [s, e] = ordered(a, b);
        const result = eachMonth(s, e);
        const expectedMonths =
          (e.getFullYear() - s.getFullYear()) * 12 +
          (e.getMonth() - s.getMonth()) +
          1;
        expect(result.length).toBe(expectedMonths);
      })
    );
  });

  it('first element matches the month of start, last matches end', () => {
    fc.assert(
      fc.property(validDate, validDate, (a, b) => {
        const [s, e] = ordered(a, b);
        const result = eachMonth(s, e);
        expect(result[0].getFullYear()).toBe(s.getFullYear());
        expect(result[0].getMonth()).toBe(s.getMonth());
        expect(result[result.length - 1].getFullYear()).toBe(e.getFullYear());
        expect(result[result.length - 1].getMonth()).toBe(e.getMonth());
      })
    );
  });
});

// ---------------------------------------------------------------------------
// Contract tests
// ---------------------------------------------------------------------------

describe('sequence — contract', () => {
  it('eachDay with string DateLike', () => {
    const result = eachDay('2025-06-01', '2025-06-03');
    expect(result).toHaveLength(3);
  });

  it('eachMonth with timestamp DateLike', () => {
    const start = new Date('2025-01-15').getTime();
    const result = eachMonth(start, '2025-03-20');
    expect(result).toHaveLength(3);
  });

  it('invalid inputs return empty arrays', () => {
    expect(eachDay('nope', '2025-01-03')).toHaveLength(0);
    expect(eachMonth('2025-01-01', 'nope')).toHaveLength(0);
  });
});
