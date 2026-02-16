/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, it, expect } from 'vitest';
import { isSameDay } from './is';

describe('isSameDay', () => {
  it('should return true for same day with same time', () => {
    const date1 = new Date('2023-01-01T12:30:45.123Z');
    const date2 = new Date('2023-01-01T12:30:45.123Z');
    expect(isSameDay(date1, date2)).toBe(true);
  });

  it('should return true for same day with different times', () => {
    // Create dates in local time to avoid timezone issues
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();

    const date1 = new Date(year, month, day, 6, 0, 0, 0);
    const date2 = new Date(year, month, day, 23, 59, 59, 999);
    expect(isSameDay(date1, date2)).toBe(true);
  });

  it('should return false for different days', () => {
    const date1 = new Date('2023-01-01T12:30:45.123Z');
    const date2 = new Date('2023-01-02T12:30:45.123Z');
    expect(isSameDay(date1, date2)).toBe(false);
  });

  it('should return false for different months', () => {
    const date1 = new Date('2023-01-31T12:30:45.123Z');
    const date2 = new Date('2023-02-01T12:30:45.123Z');
    expect(isSameDay(date1, date2)).toBe(false);
  });

  it('should return false for different years', () => {
    const date1 = new Date('2023-12-31T12:30:45.123Z');
    const date2 = new Date('2024-01-01T12:30:45.123Z');
    expect(isSameDay(date1, date2)).toBe(false);
  });

  it('should handle leap years correctly', () => {
    const date1 = new Date('2024-02-29T12:00:00.000Z'); // Leap year
    const date2 = new Date('2024-02-29T18:00:00.000Z'); // Same leap day
    const date3 = new Date('2024-03-01T12:00:00.000Z'); // Next day

    expect(isSameDay(date1, date2)).toBe(true);
    expect(isSameDay(date1, date3)).toBe(false);
  });

  it('should handle timezone differences for same UTC day', () => {
    // Both dates represent the same UTC day but different local times
    const utcMorning = new Date('2023-01-01T02:00:00.000Z');
    const utcEvening = new Date('2023-01-01T22:00:00.000Z');
    expect(isSameDay(utcMorning, utcEvening)).toBe(true);
  });
});
