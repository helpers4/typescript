/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isTemporalZonedDateTime } from './isTemporalZonedDateTime';

describe('isTemporalZonedDateTime', () => {
  it('should return true for a Temporal.ZonedDateTime', () => {
    const zdt = Temporal.Now.zonedDateTimeISO();
    expect(isTemporalZonedDateTime(zdt)).toBe(true);
  });

  it('should return true for a ZonedDateTime from Instant', () => {
    const zdt = Temporal.Now.instant().toZonedDateTimeISO('Europe/Paris');
    expect(isTemporalZonedDateTime(zdt)).toBe(true);
  });

  it('should return false for other Temporal types', () => {
    expect(isTemporalZonedDateTime(Temporal.Now.instant())).toBe(false);
    expect(isTemporalZonedDateTime(Temporal.Now.plainDateISO())).toBe(false);
    expect(isTemporalZonedDateTime(Temporal.Duration.from({ hours: 1 }))).toBe(false);
  });

  it('should return false for non-Temporal values', () => {
    expect(isTemporalZonedDateTime(new Date())).toBe(false);
    expect(isTemporalZonedDateTime('2025-01-19T12:00:00+01:00[Europe/Paris]')).toBe(false);
    expect(isTemporalZonedDateTime(null)).toBe(false);
    expect(isTemporalZonedDateTime(undefined)).toBe(false);
    expect(isTemporalZonedDateTime({})).toBe(false);
    expect(isTemporalZonedDateTime(42)).toBe(false);
  });
});
