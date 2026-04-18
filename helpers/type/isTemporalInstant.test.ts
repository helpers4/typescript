/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isTemporalInstant } from './isTemporalInstant';

describe('isTemporalInstant', () => {
  it('should return true for a Temporal.Instant', () => {
    const instant = Temporal.Now.instant();
    expect(isTemporalInstant(instant)).toBe(true);
  });

  it('should return true for Temporal.Instant.from()', () => {
    const instant = Temporal.Instant.from('2025-01-19T12:00:00Z');
    expect(isTemporalInstant(instant)).toBe(true);
  });

  it('should return false for other Temporal types', () => {
    expect(isTemporalInstant(Temporal.Now.zonedDateTimeISO())).toBe(false);
    expect(isTemporalInstant(Temporal.Now.plainDateISO())).toBe(false);
    expect(isTemporalInstant(Temporal.Duration.from({ hours: 1 }))).toBe(false);
  });

  it('should return false for non-Temporal values', () => {
    expect(isTemporalInstant(new Date())).toBe(false);
    expect(isTemporalInstant(Date.now())).toBe(false);
    expect(isTemporalInstant('2025-01-19T12:00:00Z')).toBe(false);
    expect(isTemporalInstant(null)).toBe(false);
    expect(isTemporalInstant(undefined)).toBe(false);
    expect(isTemporalInstant({})).toBe(false);
    expect(isTemporalInstant(42)).toBe(false);
  });
});
