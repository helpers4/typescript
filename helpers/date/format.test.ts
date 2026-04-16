/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { toISO8601, toRFC2822, toRFC3339 } from './format';

describe('toISO8601', () => {
  it('should convert a Date object to ISO 8601 format', () => {
    const date = new Date('2025-01-19T12:30:45.123Z');
    expect(toISO8601(date)).toBe('2025-01-19T12:30:45.123Z');
  });

  it('should convert a timestamp to ISO 8601 format', () => {
    const timestamp = new Date('2025-01-19T12:00:00.000Z').getTime();
    expect(toISO8601(timestamp)).toBe('2025-01-19T12:00:00.000Z');
  });

  it('should convert a date string to ISO 8601 format', () => {
    expect(toISO8601('2025-01-19')).toBe('2025-01-19T00:00:00.000Z');
  });

  it('should return null for invalid date', () => {
    expect(toISO8601('invalid')).toBeNull();
    expect(toISO8601(NaN)).toBeNull();
  });

  it('should preserve milliseconds', () => {
    const date = new Date('2025-06-15T08:45:30.789Z');
    expect(toISO8601(date)).toBe('2025-06-15T08:45:30.789Z');
  });
});

describe('toRFC3339', () => {
  it('should convert a Date object to RFC 3339 format without milliseconds by default', () => {
    const date = new Date('2025-01-19T12:30:45.123Z');
    expect(toRFC3339(date)).toBe('2025-01-19T12:30:45Z');
  });

  it('should include milliseconds when requested', () => {
    const date = new Date('2025-01-19T12:30:45.123Z');
    expect(toRFC3339(date, true)).toBe('2025-01-19T12:30:45.123Z');
  });

  it('should convert a timestamp to RFC 3339 format', () => {
    const timestamp = new Date('2025-01-19T12:00:00.000Z').getTime();
    expect(toRFC3339(timestamp)).toBe('2025-01-19T12:00:00Z');
  });

  it('should convert a date string to RFC 3339 format', () => {
    expect(toRFC3339('2025-01-19T00:00:00.000Z')).toBe('2025-01-19T00:00:00Z');
  });

  it('should return null for invalid date', () => {
    expect(toRFC3339('invalid')).toBeNull();
    expect(toRFC3339(NaN)).toBeNull();
  });

  it('should handle dates without milliseconds', () => {
    const date = new Date('2025-01-19T12:30:45.000Z');
    expect(toRFC3339(date)).toBe('2025-01-19T12:30:45Z');
  });
});

describe('toRFC2822', () => {
  it('should convert a Date object to RFC 2822 format', () => {
    const date = new Date('2025-01-19T12:30:00Z');
    expect(toRFC2822(date)).toBe('Sun, 19 Jan 2025 12:30:00 +0000');
  });

  it('should convert a timestamp to RFC 2822 format', () => {
    const timestamp = new Date('2025-01-19T12:00:00Z').getTime();
    expect(toRFC2822(timestamp)).toBe('Sun, 19 Jan 2025 12:00:00 +0000');
  });

  it('should convert a date string to RFC 2822 format', () => {
    expect(toRFC2822('2025-01-19T00:00:00Z')).toBe(
      'Sun, 19 Jan 2025 00:00:00 +0000'
    );
  });

  it('should return null for invalid date', () => {
    expect(toRFC2822('invalid')).toBeNull();
    expect(toRFC2822(NaN)).toBeNull();
  });

  it('should handle different days of the week', () => {
    expect(toRFC2822('2025-01-20T12:00:00Z')).toBe(
      'Mon, 20 Jan 2025 12:00:00 +0000'
    );
    expect(toRFC2822('2025-01-21T12:00:00Z')).toBe(
      'Tue, 21 Jan 2025 12:00:00 +0000'
    );
    expect(toRFC2822('2025-01-22T12:00:00Z')).toBe(
      'Wed, 22 Jan 2025 12:00:00 +0000'
    );
    expect(toRFC2822('2025-01-23T12:00:00Z')).toBe(
      'Thu, 23 Jan 2025 12:00:00 +0000'
    );
    expect(toRFC2822('2025-01-24T12:00:00Z')).toBe(
      'Fri, 24 Jan 2025 12:00:00 +0000'
    );
    expect(toRFC2822('2025-01-25T12:00:00Z')).toBe(
      'Sat, 25 Jan 2025 12:00:00 +0000'
    );
  });

  it('should handle different months', () => {
    // Test all 12 months to kill month string mutations
    const monthExpected = [
      ['2025-01-15', 'Jan'],
      ['2025-02-15', 'Feb'],
      ['2025-03-15', 'Mar'],
      ['2025-04-15', 'Apr'],
      ['2025-05-15', 'May'],
      ['2025-06-15', 'Jun'],
      ['2025-07-15', 'Jul'],
      ['2025-08-15', 'Aug'],
      ['2025-09-15', 'Sep'],
      ['2025-10-15', 'Oct'],
      ['2025-11-15', 'Nov'],
      ['2025-12-15', 'Dec'],
    ] as const;

    for (const [dateStr, monthAbbr] of monthExpected) {
      const result = toRFC2822(`${dateStr}T12:00:00Z`);
      expect(result).toContain(monthAbbr);
    }
  });

  it('should pad single digit days', () => {
    expect(toRFC2822('2025-01-05T12:00:00Z')).toBe(
      'Sun, 05 Jan 2025 12:00:00 +0000'
    );
  });

  it('should pad single digit hours, minutes, seconds', () => {
    expect(toRFC2822('2025-01-19T01:02:03Z')).toBe(
      'Sun, 19 Jan 2025 01:02:03 +0000'
    );
  });

  // --- Mutation-killing tests ---

  // L47: Regex /\.\d{3}Z$/ -> /\.\d{3}Z/ (removes $ anchor)
  // Without $, the regex could match .000Z in the middle of a string
  it('should only remove milliseconds at end of ISO string', () => {
    const date = new Date('2025-01-19T12:30:45.000Z');
    const result = toRFC3339(date);
    expect(result).toBe('2025-01-19T12:30:45Z');
    // Verify proper stripping pattern
    expect(result).not.toContain('.000');
  });

  it('should handle RFC3339 millisecond removal correctly', () => {
    const date = new Date('2025-06-15T08:45:30.789Z');
    const withMs = toRFC3339(date, true);
    const withoutMs = toRFC3339(date, false);
    expect(withMs).toBe('2025-06-15T08:45:30.789Z');
    expect(withoutMs).toBe('2025-06-15T08:45:30Z');
  });
});
