/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { endOf, startOf } from './startOf';

describe('startOf', () => {
  describe('day', () => {
    it('should set to start of day', () => {
      const result = startOf('2025-06-15T14:30:45.123Z', 'day');
      expect(result?.getHours()).toBe(0);
      expect(result?.getMinutes()).toBe(0);
      expect(result?.getSeconds()).toBe(0);
      expect(result?.getMilliseconds()).toBe(0);
    });

    it('should preserve date', () => {
      const result = startOf('2025-06-15T14:30:45Z', 'day');
      expect(result?.getDate()).toBe(15);
      expect(result?.getMonth()).toBe(5); // June
    });
  });

  describe('month', () => {
    it('should set to first day and start of day', () => {
      const result = startOf('2025-06-15T14:30:45Z', 'month');
      expect(result?.getDate()).toBe(1);
      expect(result?.getHours()).toBe(0);
      expect(result?.getMinutes()).toBe(0);
      expect(result?.getSeconds()).toBe(0);
      expect(result?.getMilliseconds()).toBe(0);
    });

    it('should preserve month and year', () => {
      const result = startOf('2025-06-15T14:30:45Z', 'month');
      expect(result?.getMonth()).toBe(5); // June
      expect(result?.getFullYear()).toBe(2025);
    });
  });

  describe('year', () => {
    it('should set to January 1st, start of day', () => {
      const result = startOf('2025-06-15T14:30:45Z', 'year');
      expect(result?.getMonth()).toBe(0); // January
      expect(result?.getDate()).toBe(1);
      expect(result?.getHours()).toBe(0);
      expect(result?.getMinutes()).toBe(0);
      expect(result?.getSeconds()).toBe(0);
      expect(result?.getMilliseconds()).toBe(0);
    });

    it('should preserve year', () => {
      const result = startOf('2025-06-15T14:30:45Z', 'year');
      expect(result?.getFullYear()).toBe(2025);
    });
  });

  it('should accept DateLike inputs', () => {
    expect(startOf(1737244800000, 'day')).toBeInstanceOf(Date);
    expect(startOf(new Date('2025-06-15'), 'month')).toBeInstanceOf(Date);
  });

  it('should return null for invalid input', () => {
    expect(startOf('invalid', 'day')).toBeNull();
    expect(startOf(0, 'month')).toBeNull();
  });

  it('should not mutate the original Date', () => {
    const d = new Date('2025-06-15T14:30:45Z');
    startOf(d, 'day');
    expect(d.getHours()).toBe(14);
  });
});

describe('endOf', () => {
  describe('day', () => {
    it('should set to end of day', () => {
      const result = endOf('2025-06-15T14:30:45Z', 'day');
      expect(result?.getHours()).toBe(23);
      expect(result?.getMinutes()).toBe(59);
      expect(result?.getSeconds()).toBe(59);
      expect(result?.getMilliseconds()).toBe(999);
    });

    it('should preserve date', () => {
      const result = endOf('2025-06-15T14:30:45Z', 'day');
      expect(result?.getDate()).toBe(15);
    });
  });

  describe('month', () => {
    it('should set to last day of month, end of day', () => {
      const result = endOf('2025-06-15T14:30:45Z', 'month');
      expect(result?.getDate()).toBe(30); // June has 30 days
      expect(result?.getHours()).toBe(23);
      expect(result?.getMinutes()).toBe(59);
      expect(result?.getSeconds()).toBe(59);
      expect(result?.getMilliseconds()).toBe(999);
    });

    it('should handle February in leap year', () => {
      const result = endOf('2024-02-15T00:00:00Z', 'month');
      expect(result?.getDate()).toBe(29);
    });

    it('should handle February in non-leap year', () => {
      const result = endOf('2025-02-15T00:00:00Z', 'month');
      expect(result?.getDate()).toBe(28);
    });

    it('should handle months with 31 days', () => {
      const result = endOf('2025-01-10T00:00:00Z', 'month');
      expect(result?.getDate()).toBe(31);
    });
  });

  describe('year', () => {
    it('should set to December 31st, end of day', () => {
      const result = endOf('2025-06-15T14:30:45Z', 'year');
      expect(result?.getMonth()).toBe(11); // December
      expect(result?.getDate()).toBe(31);
      expect(result?.getHours()).toBe(23);
      expect(result?.getMinutes()).toBe(59);
      expect(result?.getSeconds()).toBe(59);
      expect(result?.getMilliseconds()).toBe(999);
    });
  });

  it('should accept DateLike inputs', () => {
    expect(endOf(1737244800000, 'day')).toBeInstanceOf(Date);
    expect(endOf(new Date('2025-06-15'), 'month')).toBeInstanceOf(Date);
  });

  it('should return null for invalid input', () => {
    expect(endOf('invalid', 'day')).toBeNull();
    expect(endOf(0, 'month')).toBeNull();
  });

  it('should not mutate the original Date', () => {
    const d = new Date('2025-06-15T14:30:45Z');
    endOf(d, 'day');
    expect(d.getHours()).toBe(14);
  });
});
