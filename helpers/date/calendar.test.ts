/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { daysInMonth, isLeapYear } from './calendar';

// ---------------------------------------------------------------------------
// isLeapYear
// ---------------------------------------------------------------------------

describe('isLeapYear', () => {
  it('returns true for a common leap year (divisible by 4)', () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2028)).toBe(true);
    expect(isLeapYear(2032)).toBe(true);
  });

  it('returns false for a common non-leap year', () => {
    expect(isLeapYear(2025)).toBe(false);
    expect(isLeapYear(2023)).toBe(false);
    expect(isLeapYear(2019)).toBe(false);
  });

  it('returns false for century years not divisible by 400', () => {
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(1800)).toBe(false);
    expect(isLeapYear(2100)).toBe(false);
  });

  it('returns true for century years divisible by 400', () => {
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(1600)).toBe(true);
    expect(isLeapYear(2400)).toBe(true);
  });

  it('handles year 0', () => {
    // Year 0 is divisible by 400 in the proleptic Gregorian calendar
    expect(isLeapYear(0)).toBe(true);
  });

  it('handles negative years', () => {
    expect(isLeapYear(-4)).toBe(true);
    expect(isLeapYear(-1)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// daysInMonth
// ---------------------------------------------------------------------------

describe('daysInMonth', () => {
  it('returns 31 for January', () => {
    expect(daysInMonth(2025, 1)).toBe(31);
  });

  it('returns 28 for February in a non-leap year', () => {
    expect(daysInMonth(2025, 2)).toBe(28);
  });

  it('returns 29 for February in a leap year', () => {
    expect(daysInMonth(2024, 2)).toBe(29);
  });

  it('returns 31 for March', () => {
    expect(daysInMonth(2025, 3)).toBe(31);
  });

  it('returns 30 for April', () => {
    expect(daysInMonth(2025, 4)).toBe(30);
  });

  it('returns 31 for May', () => {
    expect(daysInMonth(2025, 5)).toBe(31);
  });

  it('returns 30 for June', () => {
    expect(daysInMonth(2025, 6)).toBe(30);
  });

  it('returns 31 for July', () => {
    expect(daysInMonth(2025, 7)).toBe(31);
  });

  it('returns 31 for August', () => {
    expect(daysInMonth(2025, 8)).toBe(31);
  });

  it('returns 30 for September', () => {
    expect(daysInMonth(2025, 9)).toBe(30);
  });

  it('returns 31 for October', () => {
    expect(daysInMonth(2025, 10)).toBe(31);
  });

  it('returns 30 for November', () => {
    expect(daysInMonth(2025, 11)).toBe(30);
  });

  it('returns 31 for December', () => {
    expect(daysInMonth(2025, 12)).toBe(31);
  });

  it('returns NaN for month 0', () => {
    expect(daysInMonth(2025, 0)).toBeNaN();
  });

  it('returns NaN for month 13', () => {
    expect(daysInMonth(2025, 13)).toBeNaN();
  });

  it('returns NaN for non-integer month', () => {
    expect(daysInMonth(2025, 1.5)).toBeNaN();
  });

  it('returns NaN for negative month', () => {
    expect(daysInMonth(2025, -1)).toBeNaN();
  });

  it('returns 29 for Feb in century leap year', () => {
    expect(daysInMonth(2000, 2)).toBe(29);
  });

  it('returns 28 for Feb in century non-leap year', () => {
    expect(daysInMonth(1900, 2)).toBe(28);
  });
});
