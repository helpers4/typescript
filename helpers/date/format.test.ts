/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
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
    expect(toRFC2822('2025-02-15T12:00:00Z')).toBe(
      'Sat, 15 Feb 2025 12:00:00 +0000'
    );
    expect(toRFC2822('2025-12-25T12:00:00Z')).toBe(
      'Thu, 25 Dec 2025 12:00:00 +0000'
    );
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
});
