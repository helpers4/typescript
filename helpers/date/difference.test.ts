/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, it, expect } from 'vitest';
import { daysDifference } from './difference';

describe('daysDifference', () => {
  it('should return 0 for same date', () => {
    const date = new Date('2023-01-01T12:30:45.123Z');
    expect(daysDifference(date, date)).toBe(0);
  });

  it('should return 1 for consecutive days', () => {
    const date1 = new Date('2023-01-01T12:30:45.123Z');
    const date2 = new Date('2023-01-02T12:30:45.123Z');
    expect(daysDifference(date1, date2)).toBe(1);
    expect(daysDifference(date2, date1)).toBe(1); // Order shouldn't matter
  });

  it('should return correct difference for multiple days', () => {
    const date1 = new Date('2023-01-01T12:30:45.123Z');
    const date2 = new Date('2023-01-08T12:30:45.123Z');
    expect(daysDifference(date1, date2)).toBe(7);
  });

  it('should handle dates across months', () => {
    const date1 = new Date('2023-01-31T12:30:45.123Z');
    const date2 = new Date('2023-02-01T12:30:45.123Z');
    expect(daysDifference(date1, date2)).toBe(1);
  });

  it('should handle dates across years', () => {
    const date1 = new Date('2023-12-31T12:30:45.123Z');
    const date2 = new Date('2024-01-01T12:30:45.123Z');
    expect(daysDifference(date1, date2)).toBe(1);
  });

  it('should handle leap years correctly', () => {
    const date1 = new Date('2024-02-28T12:00:00.000Z'); // Day before leap day
    const date2 = new Date('2024-03-01T12:00:00.000Z'); // Day after leap day
    expect(daysDifference(date1, date2)).toBe(2); // Feb 28 -> Feb 29 -> Mar 1
  });

  it('should ignore time differences within same day', () => {
    const morning = new Date('2023-01-01T12:00:00.000Z');
    const evening = new Date('2023-01-01T15:00:00.000Z'); // 3 hours later, same day
    expect(daysDifference(morning, evening)).toBe(0);
  });

  it('should handle large date differences', () => {
    const date1 = new Date('2020-01-01T12:00:00.000Z');
    const date2 = new Date('2023-01-01T12:00:00.000Z');
    // 2020 (leap year) + 2021 + 2022 = 366 + 365 + 365 = 1096 days
    expect(daysDifference(date1, date2)).toBe(1096);
  });

  it('should round to nearest day for partial day differences', () => {
    const date1 = new Date('2023-01-01T12:00:00.000Z');
    const date2 = new Date('2023-01-02T11:59:59.999Z'); // Almost 24 hours later
    expect(daysDifference(date1, date2)).toBe(1); // Should round to 1 day
  });
});
