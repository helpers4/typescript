/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { WeekDays, isBusinessDay, isWeekend } from './weekday';

const validDate = fc.date({
  min: new Date('2000-01-01'),
  max: new Date('2099-12-31'),
  noInvalidDate: true,
});

describe('isWeekend / isBusinessDay — property-based', () => {
  it('isWeekend and isBusinessDay are mutually exclusive', () => {
    fc.assert(
      fc.property(validDate, (d) => {
        expect(isWeekend(d)).not.toBe(isBusinessDay(d));
      })
    );
  });

  it('isWeekend with custom days and isBusinessDay with same days are exclusive', () => {
    fc.assert(
      fc.property(validDate, (d) => {
        const weekend = [WeekDays.Friday, WeekDays.Saturday] as const;
        expect(isWeekend(d, weekend)).not.toBe(isBusinessDay(d, weekend));
      })
    );
  });

  it('exactly 2 out of 7 days are weekends (default)', () => {
    // Generate a Monday at midnight and check the whole week
    fc.assert(
      fc.property(
        fc.date({
          min: new Date('2000-01-03'), // a Monday
          max: new Date('2099-12-31'),
          noInvalidDate: true,
        }),
        (d) => {
          // Align to Monday of the week
          const day = d.getDay();
          const monday = new Date(d);
          monday.setDate(monday.getDate() - ((day + 6) % 7));
          monday.setHours(0, 0, 0, 0);

          let weekendCount = 0;
          for (let i = 0; i < 7; i++) {
            const current = new Date(monday);
            current.setDate(current.getDate() + i);
            if (isWeekend(current)) weekendCount++;
          }
          expect(weekendCount).toBe(2);
        }
      )
    );
  });

  it('with empty weekendDays, isWeekend is always false', () => {
    fc.assert(
      fc.property(validDate, (d) => {
        expect(isWeekend(d, [])).toBe(false);
      })
    );
  });

  it('with empty weekendDays, isBusinessDay is always true', () => {
    fc.assert(
      fc.property(validDate, (d) => {
        expect(isBusinessDay(d, [])).toBe(true);
      })
    );
  });
});

describe('weekday — contract', () => {
  it('string DateLike', () => {
    expect(isWeekend('2025-01-18')).toBe(true);
    expect(isBusinessDay('2025-01-13')).toBe(true);
  });

  it('timestamp DateLike', () => {
    const sat = new Date('2025-01-18').getTime();
    expect(isWeekend(sat)).toBe(true);
  });

  it('invalid → false for both', () => {
    expect(isWeekend('nope')).toBe(false);
    expect(isBusinessDay('nope')).toBe(false);
  });
});
