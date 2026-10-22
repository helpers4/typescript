/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isoWeek } from './isoWeek';

describe('isoWeek', () => {
  it.each([
    ['2026-01-01', 2026, 1],
    ['2027-01-01', 2026, 53],
    ['2024-12-30', 2025, 1],
    ['2021-01-03', 2020, 53],
    ['2026-06-15', 2026, 25],
    ['2026-12-31', 2026, 53],
    ['2025-12-29', 2026, 1],
  ])('%s is week %i-W%i', (input, year, week) => {
    expect(isoWeek(input)).toEqual({ year, week });
  });

  it('starts weeks on Monday', () => {
    expect(isoWeek('2026-06-07')).toEqual({ year: 2026, week: 23 }); // Sunday
    expect(isoWeek('2026-06-08')).toEqual({ year: 2026, week: 24 }); // Monday
  });

  it('accepts a Date and a timestamp', () => {
    expect(isoWeek(new Date('2026-01-01T12:00:00Z'))).toEqual({ year: 2026, week: 1 });
    expect(isoWeek(Date.UTC(2026, 0, 1, 12))).toEqual({ year: 2026, week: 1 });
  });

  it('returns null for an invalid date', () => {
    expect(isoWeek('nope')).toBeNull();
    expect(isoWeek(new Date(NaN))).toBeNull();
  });
});
