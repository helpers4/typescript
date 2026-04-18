/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { DateCompareOptions, compare } from './compare';

describe('compare', () => {
  const date1 = new Date('2023-01-01T12:30:45.123Z');
  const date2 = new Date('2023-01-01T12:30:45.123Z');
  const date3 = new Date('2023-01-01T12:30:45.456Z'); // Different milliseconds
  const date4 = new Date('2023-01-01T12:30:46.123Z'); // Different seconds
  const date5 = new Date('2023-01-02T12:30:45.123Z'); // Different day

  describe('milliseconds precision (default)', () => {
    it('should return true for identical dates', () => {
      expect(compare(date1, date2)).toBe(true);
    });

    it('should return false for dates with different milliseconds', () => {
      expect(compare(date1, date3)).toBe(false);
    });

    it('should return false for dates with different seconds', () => {
      expect(compare(date1, date4)).toBe(false);
    });

    it('should return true for same reference', () => {
      expect(compare(date1, date1)).toBe(true);
    });
  });

  describe('seconds precision', () => {
    const options: DateCompareOptions = { precision: 'seconds' };

    it('should return true for dates with same time ignoring milliseconds', () => {
      expect(compare(date1, date3, options)).toBe(true);
    });

    it('should return false for dates with different seconds', () => {
      expect(compare(date1, date4, options)).toBe(false);
    });

    it('should return false for dates with different days', () => {
      expect(compare(date1, date5, options)).toBe(false);
    });
  });

  describe('minutes precision', () => {
    const options: DateCompareOptions = { precision: 'minutes' };
    const date6 = new Date('2023-01-01T12:30:15.123Z'); // Different seconds
    const date7 = new Date('2023-01-01T12:31:45.123Z'); // Different minutes

    it('should return true for dates with same minute ignoring seconds', () => {
      expect(compare(date1, date6, options)).toBe(true);
    });

    it('should return false for dates with different minutes', () => {
      expect(compare(date1, date7, options)).toBe(false);
    });
  });

  describe('hours precision', () => {
    const options: DateCompareOptions = { precision: 'hours' };
    const date8 = new Date('2023-01-01T12:45:45.123Z'); // Different minutes
    const date9 = new Date('2023-01-01T13:30:45.123Z'); // Different hours

    it('should return true for dates with same hour ignoring minutes', () => {
      expect(compare(date1, date8, options)).toBe(true);
    });

    it('should return false for dates with different hours', () => {
      expect(compare(date1, date9, options)).toBe(false);
    });
  });

  describe('days precision', () => {
    const options: DateCompareOptions = { precision: 'days' };

    it('should return true for dates on same day with different times', () => {
      expect(compare(date1, date3, options)).toBe(true);
      expect(compare(date1, date4, options)).toBe(true);
    });

    it('should return false for dates on different days', () => {
      expect(compare(date1, date5, options)).toBe(false);
    });

    it('should return true for same day with vastly different times', () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const day = today.getDate();

      const morning = new Date(year, month, day, 6, 0, 0, 0);
      const evening = new Date(year, month, day, 23, 59, 59, 999);
      expect(compare(morning, evening, options)).toBe(true);
    });
  });

  describe('months precision', () => {
    const options: DateCompareOptions = { precision: 'months' };

    it('should return true for dates in the same month', () => {
      expect(compare(new Date('2023-01-01'), new Date('2023-01-31'), options)).toBe(true);
    });

    it('should return false for dates in different months', () => {
      expect(compare(new Date('2023-01-31'), new Date('2023-02-01'), options)).toBe(false);
    });

    it('should return false for same month in different years', () => {
      expect(compare(new Date('2023-06-15'), new Date('2024-06-15'), options)).toBe(false);
    });
  });

  describe('years precision', () => {
    const options: DateCompareOptions = { precision: 'years' };

    it('should return true for dates in the same year', () => {
      expect(compare(new Date('2023-01-01'), new Date('2023-12-31'), options)).toBe(true);
    });

    it('should return false for dates in different years', () => {
      expect(compare(new Date('2023-12-31'), new Date('2024-01-01'), options)).toBe(false);
    });
  });

  describe('DateLike inputs', () => {
    it('should accept timestamp inputs', () => {
      const ts = new Date('2023-01-01T12:00:00Z').getTime();
      expect(compare(ts, new Date('2023-01-01T12:00:00Z'))).toBe(true);
    });

    it('should accept string inputs', () => {
      expect(compare('2023-01-01T12:00:00Z', '2023-01-01T12:00:00Z')).toBe(true);
    });

    it('should accept mixed inputs', () => {
      const ts = new Date('2023-01-01T12:00:00Z').getTime();
      expect(compare(ts, '2023-01-01T12:00:00Z')).toBe(true);
    });

    it('should compare string and Date with days precision', () => {
      expect(compare('2025-01-19', new Date('2025-01-19T08:00:00Z'), { precision: 'days' })).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle invalid inputs', () => {
      expect(compare('invalid', 'invalid')).toBe(true); // both null → equal
      expect(compare('invalid', date1)).toBe(false);
      expect(compare(date1, 'invalid')).toBe(false);
    });

    it('should handle invalid dates', () => {
      const invalidDate1 = new Date('invalid');
      const invalidDate2 = new Date('invalid');
      const validDate = new Date('2023-01-01');

      expect(compare(invalidDate1, invalidDate2)).toBe(true);
      expect(compare(invalidDate1, validDate)).toBe(false);
      expect(compare(validDate, invalidDate1)).toBe(false);
    });

    it('should use milliseconds precision by default (not empty string)', () => {
      const a = new Date('2023-01-01T12:30:45.100Z');
      const b = new Date('2023-01-01T12:30:45.200Z');
      expect(compare(a, b)).toBe(false);
      expect(compare(a, new Date(a.getTime()))).toBe(true);
    });

    it('should correctly match days precision in switch', () => {
      const a = new Date('2023-01-01T00:00:00Z');
      const b = new Date('2023-01-01T23:59:59Z');
      expect(compare(a, b, { precision: 'days' })).toBe(true);
      const c = new Date('2023-01-02T00:00:00Z');
      expect(compare(a, c, { precision: 'days' })).toBe(false);
    });
  });
});
