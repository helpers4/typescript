/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { compare } from './compare';

const precisions = ['milliseconds', 'seconds', 'minutes', 'hours', 'days'] as const;

describe('compare — property-based', () => {
  it('is reflexive for all precisions with valid dates', () => {
    fc.assert(
      fc.property(fc.date(), (d) => {
        for (const precision of precisions) {
          expect(compare(d, d, { precision })).toBe(true);
        }
      })
    );
  });

  it('is symmetric for all precisions with valid dates', () => {
    fc.assert(
      fc.property(fc.date(), fc.date(), (a, b) => {
        for (const precision of precisions) {
          expect(compare(a, b, { precision })).toBe(compare(b, a, { precision }));
        }
      })
    );
  });

  it('days precision: same calendar day is always true regardless of time', () => {
    fc.assert(
      fc.property(fc.date(), (d) => {
        // Create another date on the same day but different time
        const same = new Date(d);
        same.setMilliseconds(0);
        same.setSeconds(0);
        same.setMinutes(0);
        same.setHours(0);
        const plusHour = new Date(same.getTime() + 3_600_000 * 2);
        // Only same day if still same date string
        if (d.toDateString() === plusHour.toDateString()) {
          expect(compare(d, plusHour, { precision: 'days' })).toBe(true);
        }
      })
    );
  });

  it('milliseconds precision: two dates with same getTime() are equal', () => {
    fc.assert(
      fc.property(fc.date(), (d) => {
        const copy = new Date(d.getTime());
        expect(compare(d, copy, { precision: 'milliseconds' })).toBe(true);
      })
    );
  });
});

describe('compare — contract', () => {
  it('same Date instance → true for all precisions', () => {
    const d = new Date('2025-06-15T10:30:45.123Z');
    for (const precision of precisions) {
      expect(compare(d, d, { precision })).toBe(true);
    }
  });

  it('1ms apart with precision=seconds → true', () => {
    const a = new Date('2025-06-15T10:30:45.000Z');
    const b = new Date('2025-06-15T10:30:45.001Z');
    expect(compare(a, b, { precision: 'seconds' })).toBe(true);
  });

  it('1ms apart with precision=milliseconds → false', () => {
    const a = new Date('2025-06-15T10:30:45.000Z');
    const b = new Date('2025-06-15T10:30:45.001Z');
    expect(compare(a, b, { precision: 'milliseconds' })).toBe(false);
  });

  it('1s apart with precision=minutes → true', () => {
    const a = new Date('2025-06-15T10:30:00.000Z');
    const b = new Date('2025-06-15T10:30:59.000Z');
    expect(compare(a, b, { precision: 'minutes' })).toBe(true);
  });

  it('1s apart with precision=seconds → false', () => {
    const a = new Date('2025-06-15T10:30:00.000Z');
    const b = new Date('2025-06-15T10:30:01.000Z');
    expect(compare(a, b, { precision: 'seconds' })).toBe(false);
  });

  it('both invalid dates → true', () => {
    const a = new Date('not-a-date');
    const b = new Date('also-not-a-date');
    expect(compare(a, b)).toBe(true);
  });

  it('invalid date vs valid date → false', () => {
    const a = new Date('not-a-date');
    const b = new Date('2025-01-01');
    expect(compare(a, b)).toBe(false);
  });

  it('different days → false for precision=days', () => {
    // Use local midnight boundary to avoid timezone-dependent behavior
    const midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    const yesterday = new Date(midnight.getTime() - 1);  // 1ms before midnight (yesterday)
    const today = new Date(midnight.getTime() + 1);      // 1ms after midnight (today)
    expect(compare(yesterday, today, { precision: 'days' })).toBe(false);
  });

  it('same hour different minutes → true for precision=hours', () => {
    const a = new Date('2025-06-15T10:00:00.000Z');
    const b = new Date('2025-06-15T10:59:59.000Z');
    expect(compare(a, b, { precision: 'hours' })).toBe(true);
  });

  it('non-Date inputs use reference equality', () => {
    const s = 'hello' as unknown as Date;
    expect(compare(s, s)).toBe(true);
    expect(compare('a' as unknown as Date, 'b' as unknown as Date)).toBe(false);
  });

  it('default precision is milliseconds', () => {
    const a = new Date('2025-06-15T10:30:45.000Z');
    const b = new Date('2025-06-15T10:30:45.001Z');
    expect(compare(a, b)).toBe(false);
    expect(compare(a, new Date(a.getTime()))).toBe(true);
  });
});
