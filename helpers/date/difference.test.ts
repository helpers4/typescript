/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { daysDifference, difference } from './difference';

describe('daysDifference', () => {
  it('should return 0 for same date', () => {
    const date = new Date('2023-01-01T12:30:45.123Z');
    expect(daysDifference(date, date)).toBe(0);
  });

  it('should return 1 for consecutive days', () => {
    const date1 = new Date('2023-01-01T12:30:45.123Z');
    const date2 = new Date('2023-01-02T12:30:45.123Z');
    expect(daysDifference(date1, date2)).toBe(1);
    expect(daysDifference(date2, date1)).toBe(1);
  });

  it('should return correct difference for multiple days', () => {
    const date1 = new Date('2023-01-01T12:30:45.123Z');
    const date2 = new Date('2023-01-08T12:30:45.123Z');
    expect(daysDifference(date1, date2)).toBe(7);
  });

  it('should handle dates across months', () => {
    expect(daysDifference(new Date('2023-01-31T12:30:45.123Z'), new Date('2023-02-01T12:30:45.123Z'))).toBe(1);
  });

  it('should handle dates across years', () => {
    expect(daysDifference(new Date('2023-12-31T12:30:45.123Z'), new Date('2024-01-01T12:30:45.123Z'))).toBe(1);
  });

  it('should handle leap years correctly', () => {
    expect(daysDifference(new Date('2024-02-28T12:00:00.000Z'), new Date('2024-03-01T12:00:00.000Z'))).toBe(2);
  });

  it('should ignore time differences within same day', () => {
    expect(daysDifference(new Date('2023-01-01T12:00:00.000Z'), new Date('2023-01-01T15:00:00.000Z'))).toBe(0);
  });

  it('should handle large date differences', () => {
    expect(daysDifference(new Date('2020-01-01T12:00:00.000Z'), new Date('2023-01-01T12:00:00.000Z'))).toBe(1096);
  });

  it('should round to nearest day for partial day differences', () => {
    expect(daysDifference(new Date('2023-01-01T12:00:00.000Z'), new Date('2023-01-02T11:59:59.999Z'))).toBe(1);
  });
});

describe('difference', () => {
  describe('days (default)', () => {
    it('should return 0 for same date', () => {
      expect(difference('2023-01-01', '2023-01-01')).toBe(0);
    });

    it('should return difference in days', () => {
      expect(difference('2025-01-01', '2025-01-10')).toBeCloseTo(9, 0);
    });

    it('should return absolute value by default', () => {
      expect(difference('2025-01-10', '2025-01-01')).toBeCloseTo(9, 0);
    });
  });

  describe('units', () => {
    it('should return difference in milliseconds', () => {
      expect(difference('2025-01-01T00:00:00Z', '2025-01-01T00:00:01Z', { unit: 'milliseconds' })).toBe(1000);
    });

    it('should return difference in seconds', () => {
      expect(difference('2025-01-01T00:00:00Z', '2025-01-01T00:01:00Z', { unit: 'seconds' })).toBe(60);
    });

    it('should return difference in minutes', () => {
      expect(difference('2025-01-01T00:00:00Z', '2025-01-01T02:00:00Z', { unit: 'minutes' })).toBe(120);
    });

    it('should return difference in hours', () => {
      expect(difference('2025-01-01T00:00:00Z', '2025-01-01T02:30:00Z', { unit: 'hours' })).toBe(2.5);
    });
  });

  describe('absolute option', () => {
    it('should return negative value when absolute is false', () => {
      expect(difference('2025-01-10', '2025-01-01', { absolute: false })).toBeLessThan(0);
    });

    it('should return positive value when b > a and absolute is false', () => {
      expect(difference('2025-01-01', '2025-01-10', { absolute: false })).toBeGreaterThan(0);
    });
  });

  describe('DateLike inputs', () => {
    it('should accept timestamp inputs', () => {
      const ts1 = new Date('2025-01-01T00:00:00Z').getTime();
      const ts2 = new Date('2025-01-02T00:00:00Z').getTime();
      expect(difference(ts1, ts2)).toBeCloseTo(1, 0);
    });

    it('should accept mixed inputs', () => {
      const ts = new Date('2025-01-01T00:00:00Z').getTime();
      expect(difference(ts, '2025-01-02T00:00:00Z')).toBeCloseTo(1, 0);
    });
  });

  describe('edge cases', () => {
    it('should return NaN for invalid inputs', () => {
      expect(difference('invalid', '2025-01-01')).toBeNaN();
      expect(difference('2025-01-01', 'invalid')).toBeNaN();
    });
  });
});
