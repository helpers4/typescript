/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isoWeek } from './isoWeek';

const dates = fc.date({ min: new Date('1971-01-01'), max: new Date('2099-12-31'), noInvalidDate: true });

describe('isoWeek — property-based', () => {
  it('week is always between 1 and 53', () => {
    fc.assert(fc.property(dates, (d) => {
      const { week } = isoWeek(d)!;
      expect(week).toBeGreaterThanOrEqual(1);
      expect(week).toBeLessThanOrEqual(53);
    }));
  });

  it('seven days later is the next week, or week 1 of the next year', () => {
    fc.assert(fc.property(dates, (d) => {
      const a = isoWeek(d)!;
      const b = isoWeek(new Date(d.getTime() + 7 * 86_400_000))!;
      if (b.year === a.year) expect(b.week).toBe(a.week + 1);
      else expect(b.week).toBe(1);
    }));
  });

  it('all the days of one Monday-to-Sunday share the same week', () => {
    fc.assert(fc.property(dates, (d) => {
      const monday = new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * 86_400_000);
      const expected = isoWeek(monday)!;
      for (let i = 1; i < 7; i++) {
        expect(isoWeek(new Date(monday.getTime() + i * 86_400_000))).toEqual(expected);
      }
    }));
  });
});

describe('isoWeek — contract', () => {
  it('returns null for null-ish and empty input', () => {
    expect(isoWeek('')).toBeNull();
    expect(isoWeek(0)).toBeNull();
    expect(isoWeek(NaN)).toBeNull();
  });
});
