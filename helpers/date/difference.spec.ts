/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { daysDifference } from './difference';

const validDate = () => fc.date().filter((d) => !isNaN(d.getTime()));

describe('daysDifference — property-based', () => {
  it('is always non-negative', () => {
    fc.assert(
      fc.property(validDate(), validDate(), (a, b) => {
        expect(daysDifference(a, b)).toBeGreaterThanOrEqual(0);
      })
    );
  });

  it('daysDifference(d, d) === 0', () => {
    fc.assert(
      fc.property(validDate(), (d) => {
        expect(daysDifference(d, d)).toBe(0);
      })
    );
  });

  it('is symmetric', () => {
    fc.assert(
      fc.property(validDate(), validDate(), (a, b) => {
        expect(daysDifference(a, b)).toBe(daysDifference(b, a));
      })
    );
  });
});

describe('daysDifference — contract', () => {
  it('same day → 0 (within 12h of same UTC point)', () => {
    // daysDifference uses getTime() diff / ms-per-day with Math.round.
    // 23:59:59.999 apart is ~0.9999 days, which rounds to 1.
    // Use dates well within the same 12-hour window to guarantee rounding to 0.
    const a = new Date('2025-06-15T10:00:00.000Z');
    const b = new Date('2025-06-15T11:00:00.000Z');
    expect(daysDifference(a, b)).toBe(0);
  });

  it('exactly 1 day apart → 1', () => {
    const a = new Date('2025-06-15T12:00:00.000Z');
    const b = new Date('2025-06-16T12:00:00.000Z');
    expect(daysDifference(a, b)).toBe(1);
  });

  it('365 days apart → 365', () => {
    const a = new Date('2024-01-01T00:00:00.000Z');
    const b = new Date('2025-01-01T00:00:00.000Z');
    expect(daysDifference(a, b)).toBe(366); // 2024 is a leap year
  });

  it('large date range — epoch to 2025', () => {
    const epoch = new Date(0);
    const y2025 = new Date('2025-01-01T00:00:00.000Z');
    const diff = daysDifference(epoch, y2025);
    expect(diff).toBeGreaterThan(20000);
  });
});
