/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isTemporalZonedDateTime } from './isTemporalZonedDateTime';

describe('isTemporalZonedDateTime — property-based', () => {
  it('ZonedDateTimes from various timezones are detected', () => {
    const timezones = ['UTC', 'Europe/Paris', 'America/New_York', 'Asia/Tokyo'];
    for (const tz of timezones) {
      const zdt = Temporal.Now.instant().toZonedDateTimeISO(tz);
      expect(isTemporalZonedDateTime(zdt)).toBe(true);
    }
  });

  it('no other Temporal type is mistaken for ZonedDateTime', () => {
    const others = [
      Temporal.Now.instant(),
      Temporal.Now.plainDateISO(),
      Temporal.Now.plainDateTimeISO(),
      Temporal.Now.plainTimeISO(),
      Temporal.Duration.from({ days: 1 }),
    ];
    for (const obj of others) {
      expect(isTemporalZonedDateTime(obj)).toBe(false);
    }
  });
});

describe('isTemporalZonedDateTime — contract', () => {
  it('Temporal.Now.zonedDateTimeISO() → true', () => {
    expect(isTemporalZonedDateTime(Temporal.Now.zonedDateTimeISO())).toBe(true);
  });
  it('Instant.toZonedDateTimeISO() → true', () => {
    const zdt = Temporal.Now.instant().toZonedDateTimeISO('UTC');
    expect(isTemporalZonedDateTime(zdt)).toBe(true);
  });
  it('Instant → false', () => expect(isTemporalZonedDateTime(Temporal.Now.instant())).toBe(false));
  it('Date → false', () => expect(isTemporalZonedDateTime(new Date())).toBe(false));
  it('null → false', () => expect(isTemporalZonedDateTime(null)).toBe(false));
  it('undefined → false', () => expect(isTemporalZonedDateTime(undefined)).toBe(false));
  it('plain object → false', () => expect(isTemporalZonedDateTime({})).toBe(false));
});
