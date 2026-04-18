/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import {
  formatInTimezone,
  getTimezoneOffset,
  listTimezones,
} from './timezone';

// ---------------------------------------------------------------------------
// listTimezones
// ---------------------------------------------------------------------------

describe('listTimezones', () => {
  it('returns an array of strings', () => {
    const result = listTimezones();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    for (const tz of result) {
      expect(typeof tz).toBe('string');
    }
  });

  it('includes well-known IANA identifiers', () => {
    const result = listTimezones();
    expect(result).toContain('America/New_York');
    expect(result).toContain('Europe/Paris');
    expect(result).toContain('Asia/Tokyo');
  });

  it('returns sorted values', () => {
    const result = listTimezones();
    const sorted = [...result].sort();
    expect(result).toEqual(sorted);
  });
});

// ---------------------------------------------------------------------------
// getTimezoneOffset
// ---------------------------------------------------------------------------

describe('getTimezoneOffset', () => {
  it('returns -300 for New York in winter (EST)', () => {
    // Jan 19 is EST (UTC-5)
    const result = getTimezoneOffset('America/New_York', '2025-01-19T12:00:00Z');
    expect(result).toBe(-300);
  });

  it('returns -240 for New York in summer (EDT)', () => {
    // Jul 19 is EDT (UTC-4)
    const result = getTimezoneOffset('America/New_York', '2025-07-19T12:00:00Z');
    expect(result).toBe(-240);
  });

  it('returns 60 for Paris in winter (CET)', () => {
    const result = getTimezoneOffset('Europe/Paris', '2025-01-19T12:00:00Z');
    expect(result).toBe(60);
  });

  it('returns 120 for Paris in summer (CEST)', () => {
    const result = getTimezoneOffset('Europe/Paris', '2025-07-19T12:00:00Z');
    expect(result).toBe(120);
  });

  it('returns 0 for UTC', () => {
    const result = getTimezoneOffset('UTC', '2025-01-19T12:00:00Z');
    expect(result).toBe(0);
  });

  it('returns 540 for Asia/Tokyo (no DST)', () => {
    const result = getTimezoneOffset('Asia/Tokyo', '2025-01-19T12:00:00Z');
    expect(result).toBe(540);
  });

  it('returns 330 for Asia/Kolkata (half-hour offset)', () => {
    const result = getTimezoneOffset('Asia/Kolkata', '2025-01-19T12:00:00Z');
    expect(result).toBe(330);
  });

  it('returns 345 for Asia/Kathmandu (45-min offset)', () => {
    const result = getTimezoneOffset('Asia/Kathmandu', '2025-01-19T12:00:00Z');
    expect(result).toBe(345);
  });

  it('accepts DateLike inputs (Date object)', () => {
    const result = getTimezoneOffset('UTC', new Date('2025-01-19T12:00:00Z'));
    expect(result).toBe(0);
  });

  it('accepts DateLike inputs (timestamp)', () => {
    const ts = new Date('2025-01-19T12:00:00Z').getTime();
    const result = getTimezoneOffset('Asia/Tokyo', ts);
    expect(result).toBe(540);
  });

  it('returns null for invalid timezone', () => {
    expect(getTimezoneOffset('Invalid/Zone', '2025-01-19T12:00:00Z')).toBeNull();
  });

  it('returns null for invalid date', () => {
    expect(getTimezoneOffset('UTC', 'invalid')).toBeNull();
  });

  it('defaults to now when no date is provided', () => {
    const result = getTimezoneOffset('UTC');
    expect(result).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// formatInTimezone
// ---------------------------------------------------------------------------

describe('formatInTimezone', () => {
  it('formats a date in Asia/Tokyo (default en-US)', () => {
    const result = formatInTimezone('2025-01-19T12:00:00Z', 'Asia/Tokyo');
    expect(result).not.toBeNull();
    // Default en-US format includes date; verify it contains the date parts
    expect(result).toContain('1');
    expect(result).toContain('19');
    expect(result).toContain('2025');
  });

  it('formats a date with time in Asia/Tokyo', () => {
    const result = formatInTimezone('2025-01-19T12:00:00Z', 'Asia/Tokyo', {
      formatOptions: { hour: 'numeric', minute: '2-digit', hour12: true },
    });
    expect(result).not.toBeNull();
    // Tokyo is UTC+9, so 12:00 UTC → 21:00 JST → "9:00 PM" in en-US
    expect(result).toContain('9');
    expect(result).toContain('PM');
  });

  it('formats a date in Europe/Paris with French locale', () => {
    const result = formatInTimezone('2025-01-19T12:00:00Z', 'Europe/Paris', {
      locale: 'fr-FR',
      formatOptions: { dateStyle: 'long', timeStyle: 'short' },
    });
    expect(result).not.toBeNull();
    expect(result).toContain('janvier');
    expect(result).toContain('13');
  });

  it('formats a date in UTC', () => {
    const result = formatInTimezone('2025-06-15T18:30:00Z', 'UTC', {
      formatOptions: { hour: '2-digit', minute: '2-digit', hour12: false },
    });
    expect(result).not.toBeNull();
    expect(result).toContain('18');
    expect(result).toContain('30');
  });

  it('accepts DateLike inputs (Date object)', () => {
    const result = formatInTimezone(new Date('2025-01-19T12:00:00Z'), 'UTC');
    expect(result).not.toBeNull();
  });

  it('accepts DateLike inputs (timestamp)', () => {
    const ts = new Date('2025-01-19T12:00:00Z').getTime();
    const result = formatInTimezone(ts, 'UTC');
    expect(result).not.toBeNull();
  });

  it('returns null for invalid date', () => {
    expect(formatInTimezone('invalid', 'UTC')).toBeNull();
  });

  it('returns null for invalid timezone', () => {
    expect(formatInTimezone('2025-01-19T12:00:00Z', 'Invalid/Zone')).toBeNull();
  });

  it('uses custom formatOptions', () => {
    const result = formatInTimezone('2025-01-19T12:00:00Z', 'America/New_York', {
      formatOptions: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    });
    expect(result).not.toBeNull();
    expect(result).toContain('January');
    expect(result).toContain('Sunday');
  });
});
