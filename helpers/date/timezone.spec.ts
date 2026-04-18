/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  formatInTimezone,
  getTimezoneOffset,
  listTimezones,
} from './timezone';

const validDate = fc.date({
  min: new Date('2000-01-01'),
  max: new Date('2099-12-31'),
  noInvalidDate: true,
});

/** A small set of well-known timezones for property tests. */
const knownTz = fc.constantFrom(
  'UTC',
  'America/New_York',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Kolkata',
  'Australia/Sydney',
  'Pacific/Auckland'
);

// ---------------------------------------------------------------------------
// listTimezones — property-based
// ---------------------------------------------------------------------------

describe('listTimezones — property-based', () => {
  it('every returned entry is a non-empty string', () => {
    const zones = listTimezones();
    for (const tz of zones) {
      expect(typeof tz).toBe('string');
      expect(tz.length).toBeGreaterThan(0);
    }
  });

  it('every returned entry is accepted by getTimezoneOffset', () => {
    const zones = listTimezones();
    // Spot-check a random subset (checking all ~400+ would be slow)
    const sample = zones.filter((_, i) => i % 20 === 0);
    for (const tz of sample) {
      const offset = getTimezoneOffset(tz, '2025-01-19T12:00:00Z');
      expect(offset).not.toBeNull();
    }
  });
});

// ---------------------------------------------------------------------------
// getTimezoneOffset — property-based
// ---------------------------------------------------------------------------

describe('getTimezoneOffset — property-based', () => {
  it('UTC always returns 0', () => {
    fc.assert(
      fc.property(validDate, (d) => {
        expect(getTimezoneOffset('UTC', d)).toBe(0);
      })
    );
  });

  it('offset is always an integer', () => {
    fc.assert(
      fc.property(validDate, knownTz, (d, tz) => {
        const offset = getTimezoneOffset(tz, d);
        expect(offset).not.toBeNull();
        expect(Number.isInteger(offset)).toBe(true);
      })
    );
  });

  it('offset is within a reasonable range (UTC-12 to UTC+14)', () => {
    fc.assert(
      fc.property(validDate, knownTz, (d, tz) => {
        const offset = getTimezoneOffset(tz, d)!;
        expect(offset).toBeGreaterThanOrEqual(-12 * 60);
        expect(offset).toBeLessThanOrEqual(14 * 60);
      })
    );
  });
});

// ---------------------------------------------------------------------------
// formatInTimezone — property-based
// ---------------------------------------------------------------------------

describe('formatInTimezone — property-based', () => {
  it('never returns null for valid date + known timezone', () => {
    fc.assert(
      fc.property(validDate, knownTz, (d, tz) => {
        const result = formatInTimezone(d, tz);
        expect(result).not.toBeNull();
      })
    );
  });

  it('returns a non-empty string', () => {
    fc.assert(
      fc.property(validDate, knownTz, (d, tz) => {
        const result = formatInTimezone(d, tz);
        expect(result!.length).toBeGreaterThan(0);
      })
    );
  });
});

// ---------------------------------------------------------------------------
// Contract tests
// ---------------------------------------------------------------------------

describe('timezone — contract', () => {
  it('getTimezoneOffset with string DateLike', () => {
    expect(getTimezoneOffset('UTC', '2025-06-15T12:00:00Z')).toBe(0);
  });

  it('getTimezoneOffset with timestamp DateLike', () => {
    const ts = new Date('2025-01-19T12:00:00Z').getTime();
    expect(getTimezoneOffset('Asia/Tokyo', ts)).toBe(540);
  });

  it('formatInTimezone with string DateLike', () => {
    const result = formatInTimezone('2025-01-19T12:00:00Z', 'UTC');
    expect(result).not.toBeNull();
  });

  it('invalid inputs return null', () => {
    expect(getTimezoneOffset('Invalid/Zone', '2025-01-19T12:00:00Z')).toBeNull();
    expect(getTimezoneOffset('UTC', 'nope')).toBeNull();
    expect(formatInTimezone('nope', 'UTC')).toBeNull();
    expect(formatInTimezone('2025-01-19T12:00:00Z', 'Invalid/Zone')).toBeNull();
  });
});
