/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, it, expect } from 'vitest';
import { compare, DateCompareOptions } from './compare';

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
      // Create dates in local time to avoid timezone issues
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const day = today.getDate();

      const morning = new Date(year, month, day, 6, 0, 0, 0);
      const evening = new Date(year, month, day, 23, 59, 59, 999);
      expect(compare(morning, evening, options)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle non-Date objects', () => {
      expect(compare('not a date' as any, date1 as any)).toBe(false);
      expect(compare(date1 as any, 'not a date' as any)).toBe(false);
      expect(compare('same string' as any, 'same string' as any)).toBe(true);
    });

    it('should handle invalid dates', () => {
      const invalidDate1 = new Date('invalid');
      const invalidDate2 = new Date('invalid');
      const validDate = new Date('2023-01-01');

      expect(compare(invalidDate1, invalidDate2)).toBe(true); // Both invalid
      expect(compare(invalidDate1, validDate)).toBe(false); // One invalid
      expect(compare(validDate, invalidDate1)).toBe(false); // One invalid
    });

    it('should handle null and undefined', () => {
      expect(compare(null as any, null as any)).toBe(true);
      expect(compare(undefined as any, undefined as any)).toBe(true);
      expect(compare(null as any, date1 as any)).toBe(false);
      expect(compare(date1 as any, null as any)).toBe(false);
    });
  });
});
