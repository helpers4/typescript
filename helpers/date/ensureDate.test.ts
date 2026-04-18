/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { ensureDate } from './ensureDate';

describe('ensureDate', () => {
  describe('valid inputs', () => {
    it('should handle valid date strings', () => {
      const date = ensureDate('2022-01-20');
      expect(date).toBeInstanceOf(Date);
      expect(date?.getFullYear()).toBe(2022);
    });

    it('should handle ISO date strings', () => {
      const date = ensureDate('2022-01-20T10:30:00Z');
      expect(date).toBeInstanceOf(Date);
      expect(date?.toISOString()).toBe('2022-01-20T10:30:00.000Z');
    });

    it('should handle Date objects', () => {
      const validDate = new Date('2022-01-20');
      expect(ensureDate(validDate)).toBe(validDate);
    });

    it('should handle millisecond timestamps', () => {
      const msTimestamp = 1642694400000;
      const date = ensureDate(msTimestamp);
      expect(date).toBeInstanceOf(Date);
      expect(date?.getTime()).toBe(msTimestamp);
    });

    it('should handle second timestamps', () => {
      const date = ensureDate(1642694400);
      expect(date).toBeInstanceOf(Date);
      expect(date?.getTime()).toBe(1642694400000);
    });
  });

  describe('null/invalid inputs', () => {
    it('should return null for null', () => {
      expect(ensureDate(null)).toBeNull();
    });

    it('should return null for undefined', () => {
      expect(ensureDate(undefined)).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(ensureDate('')).toBeNull();
    });

    it('should return null for zero', () => {
      expect(ensureDate(0)).toBeNull();
    });

    it('should return null for invalid date string', () => {
      expect(ensureDate('invalid')).toBeNull();
    });

    it('should return null for invalid Date object', () => {
      expect(ensureDate(new Date('invalid'))).toBeNull();
    });

    it('should return null for NaN', () => {
      expect(ensureDate(NaN)).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should handle negative timestamps', () => {
      const date = ensureDate(-1000);
      expect(date).toBeInstanceOf(Date);
    });

    it('should handle large timestamps', () => {
      const largeNumber = 999999999999;
      const date = ensureDate(largeNumber);
      expect(date).toBeInstanceOf(Date);
      expect(date?.getTime()).toBe(largeNumber);
    });

    it('should handle various string formats', () => {
      const validDates = [
        '2022-01-20',
        '2022-01-20T10:30:00',
        '2022-01-20T10:30:00Z',
      ];

      for (const dateStr of validDates) {
        const date = ensureDate(dateStr);
        expect(date).toBeInstanceOf(Date);
        expect(date?.getFullYear()).toBe(2022);
      }
    });

    it('should handle unexpected input types gracefully', () => {
      expect(ensureDate({} as unknown as string)).toBeNull();
      expect(ensureDate([] as unknown as string)).toBeNull();
      expect(ensureDate(true as unknown as string)).toBeNull();
      expect(ensureDate(false as unknown as string)).toBeNull();
    });

    it('should handle objects with epochMilliseconds (Temporal-like)', () => {
      const instant = { epochMilliseconds: 1642694400000 };
      const date = ensureDate(instant);
      expect(date).toBeInstanceOf(Date);
      expect(date?.getTime()).toBe(1642694400000);
    });

    it('should return null for epochMilliseconds = NaN', () => {
      const bad = { epochMilliseconds: NaN };
      expect(ensureDate(bad)).toBeNull();
    });

    it('should handle negative epochMilliseconds', () => {
      const before = { epochMilliseconds: -86400000 };
      const date = ensureDate(before);
      expect(date).toBeInstanceOf(Date);
      expect(date?.getTime()).toBe(-86400000);
    });

    it('should handle epochMilliseconds = 0 (epoch)', () => {
      const epoch = { epochMilliseconds: 0 };
      const date = ensureDate(epoch);
      expect(date).toBeInstanceOf(Date);
      expect(date?.getTime()).toBe(0);
    });

    // Mutation-killing: each null guard must individually trigger
    it('should return null for null and NOT a Date', () => {
      const result = ensureDate(null);
      expect(result).toBeNull();
      expect(result).not.toBeInstanceOf(Date);
    });

    it('should return null for 0 and NOT epoch date', () => {
      const result = ensureDate(0);
      expect(result).toBeNull();
      expect(result).not.toEqual(new Date(0));
    });

    it('should return a valid Date for non-zero number', () => {
      const result = ensureDate(1);
      expect(result).toBeInstanceOf(Date);
      expect(result).not.toBeNull();
    });

    it('should return a valid Date for non-empty string', () => {
      const result = ensureDate('2023-01-01');
      expect(result).toBeInstanceOf(Date);
      expect(result).not.toBeNull();
    });

    it('should return same reference for valid Date object', () => {
      const d = new Date('2023-06-15');
      const result = ensureDate(d);
      expect(result).toBe(d);
    });
  });
});
