/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isSameDay, isSameMonth, isSameYear } from './is';

describe('isSameDay', () => {
  it('should return true for same day with same time', () => {
    const date1 = new Date('2023-01-01T12:30:45.123Z');
    const date2 = new Date('2023-01-01T12:30:45.123Z');
    expect(isSameDay(date1, date2)).toBe(true);
  });

  it('should return true for same day with different times', () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();

    const date1 = new Date(year, month, day, 6, 0, 0, 0);
    const date2 = new Date(year, month, day, 23, 59, 59, 999);
    expect(isSameDay(date1, date2)).toBe(true);
  });

  it('should return false for different days', () => {
    expect(isSameDay(new Date('2023-01-01T12:30:45.123Z'), new Date('2023-01-02T12:30:45.123Z'))).toBe(false);
  });

  it('should return false for different months', () => {
    expect(isSameDay(new Date('2023-01-31T12:30:45.123Z'), new Date('2023-02-01T12:30:45.123Z'))).toBe(false);
  });

  it('should return false for different years', () => {
    expect(isSameDay(new Date('2023-12-31T12:30:45.123Z'), new Date('2024-01-01T12:30:45.123Z'))).toBe(false);
  });

  it('should handle leap years correctly', () => {
    expect(isSameDay(new Date('2024-02-29T12:00:00.000Z'), new Date('2024-02-29T18:00:00.000Z'))).toBe(true);
    expect(isSameDay(new Date('2024-02-29T12:00:00.000Z'), new Date('2024-03-01T12:00:00.000Z'))).toBe(false);
  });

  it('should handle timezone differences for same UTC day', () => {
    expect(isSameDay(new Date('2023-01-01T02:00:00.000Z'), new Date('2023-01-01T22:00:00.000Z'))).toBe(true);
  });

  it('should return false for same month and day but different year', () => {
    expect(isSameDay(new Date('2023-06-15T12:00:00.000Z'), new Date('2024-06-15T12:00:00.000Z'))).toBe(false);
  });

  it('should return false for same year and day but different month', () => {
    expect(isSameDay(new Date('2023-03-15T12:00:00.000Z'), new Date('2023-04-15T12:00:00.000Z'))).toBe(false);
  });

  it('should return false for same year and month but different day', () => {
    expect(isSameDay(new Date('2023-06-15T12:00:00.000Z'), new Date('2023-06-16T12:00:00.000Z'))).toBe(false);
  });

  describe('DateLike inputs', () => {
    it('should accept string inputs', () => {
      expect(isSameDay('2025-01-19T08:00:00Z', '2025-01-19T22:00:00Z')).toBe(true);
      expect(isSameDay('2025-01-19', '2025-01-20')).toBe(false);
    });

    it('should accept timestamp inputs', () => {
      const ts = new Date('2025-01-19T12:00:00Z').getTime();
      expect(isSameDay(ts, new Date('2025-01-19T22:00:00Z'))).toBe(true);
    });

    it('should return false for invalid inputs', () => {
      expect(isSameDay('invalid', new Date())).toBe(false);
      expect(isSameDay(new Date(), 'invalid')).toBe(false);
      expect(isSameDay('invalid', 'invalid')).toBe(false);
    });
  });
});

describe('isSameMonth', () => {
  it('should return true for dates in the same month', () => {
    expect(isSameMonth(new Date('2025-01-01'), new Date('2025-01-31'))).toBe(true);
  });

  it('should return false for dates in different months', () => {
    expect(isSameMonth(new Date('2025-01-31'), new Date('2025-02-01'))).toBe(false);
  });

  it('should return false for same month in different years', () => {
    expect(isSameMonth(new Date('2024-06-15'), new Date('2025-06-15'))).toBe(false);
  });

  it('should accept string inputs', () => {
    expect(isSameMonth('2025-01-01', '2025-01-31')).toBe(true);
    expect(isSameMonth('2025-01-31', '2025-02-01')).toBe(false);
  });

  it('should accept timestamp inputs', () => {
    const ts = new Date('2025-01-15T12:00:00Z').getTime();
    expect(isSameMonth(ts, '2025-01-31')).toBe(true);
  });

  it('should return false for invalid inputs', () => {
    expect(isSameMonth('invalid', new Date())).toBe(false);
    expect(isSameMonth(new Date(), 'invalid')).toBe(false);
  });
});

describe('isSameYear', () => {
  it('should return true for dates in the same year', () => {
    expect(isSameYear(new Date('2025-01-01'), new Date('2025-12-31'))).toBe(true);
  });

  it('should return false for dates in different years', () => {
    expect(isSameYear(new Date('2024-12-31'), new Date('2025-01-01'))).toBe(false);
  });

  it('should accept string inputs', () => {
    expect(isSameYear('2025-01-01', '2025-12-31')).toBe(true);
    expect(isSameYear('2024-12-31', '2025-01-01')).toBe(false);
  });

  it('should accept timestamp inputs', () => {
    const ts = new Date('2025-06-15T12:00:00Z').getTime();
    expect(isSameYear(ts, '2025-01-01')).toBe(true);
  });

  it('should return false for invalid inputs', () => {
    expect(isSameYear('invalid', new Date())).toBe(false);
    expect(isSameYear(new Date(), 'invalid')).toBe(false);
  });
});
