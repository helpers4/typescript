/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isTemporalInstant } from './isTemporalInstant';

describe('isTemporalInstant — property-based', () => {
  it('every Instant created from epoch ms is detected', () => {
    const epochs = [0, 1_000_000_000_000, -1_000_000_000_000, Date.now()];
    for (const ms of epochs) {
      const instant = Temporal.Instant.fromEpochMilliseconds(ms);
      expect(isTemporalInstant(instant)).toBe(true);
    }
  });

  it('no other Temporal type is mistaken for Instant', () => {
    const others = [
      Temporal.Now.zonedDateTimeISO(),
      Temporal.Now.plainDateISO(),
      Temporal.Now.plainDateTimeISO(),
      Temporal.Now.plainTimeISO(),
      Temporal.Duration.from({ seconds: 1 }),
    ];
    for (const obj of others) {
      expect(isTemporalInstant(obj)).toBe(false);
    }
  });
});

describe('isTemporalInstant — contract', () => {
  it('Temporal.Now.instant() → true', () => {
    expect(isTemporalInstant(Temporal.Now.instant())).toBe(true);
  });
  it('Temporal.Instant.from() → true', () => {
    expect(isTemporalInstant(Temporal.Instant.from('2025-01-19T12:00:00Z'))).toBe(true);
  });
  it('Date → false', () => expect(isTemporalInstant(new Date())).toBe(false));
  it('number → false', () => expect(isTemporalInstant(1737288000000)).toBe(false));
  it('string → false', () => expect(isTemporalInstant('2025-01-19T12:00:00Z')).toBe(false));
  it('null → false', () => expect(isTemporalInstant(null)).toBe(false));
  it('undefined → false', () => expect(isTemporalInstant(undefined)).toBe(false));
  it('plain object → false', () => expect(isTemporalInstant({})).toBe(false));
});
