/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { difference } from './difference';

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
