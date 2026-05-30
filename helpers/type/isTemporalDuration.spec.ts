/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, expectTypeOf, it } from 'vitest';
import { isTemporalDuration } from './isTemporalDuration';

describe('isTemporalDuration — property-based', () => {
  it('Durations from various units are detected', () => {
    const durations = [
      { years: 1 },
      { months: 6 },
      { weeks: 2 },
      { days: 30 },
      { hours: 12 },
      { minutes: 45 },
      { seconds: 90 },
      { milliseconds: 500 },
    ];
    for (const obj of durations) {
      const dur = Temporal.Duration.from(obj);
      expect(isTemporalDuration(dur)).toBe(true);
    }
  });

  it('no other Temporal type is mistaken for Duration', () => {
    const others = [
      Temporal.Now.instant(),
      Temporal.Now.zonedDateTimeISO(),
      Temporal.Now.plainDateISO(),
      Temporal.Now.plainDateTimeISO(),
      Temporal.Now.plainTimeISO(),
    ];
    for (const obj of others) {
      expect(isTemporalDuration(obj)).toBe(false);
    }
  });
});

describe('isTemporalDuration — contract', () => {
  it('Duration.from({ hours: 1 }) → true', () => {
    expect(isTemporalDuration(Temporal.Duration.from({ hours: 1 }))).toBe(true);
  });
  it('Duration.from("PT1H30M") → true', () => {
    expect(isTemporalDuration(Temporal.Duration.from('PT1H30M'))).toBe(true);
  });
  it('Instant → false', () => expect(isTemporalDuration(Temporal.Now.instant())).toBe(false));
  it('number → false', () => expect(isTemporalDuration(3600000)).toBe(false));
  it('duration-like object → false', () => expect(isTemporalDuration({ hours: 1 })).toBe(false));
  it('ISO string → false', () => expect(isTemporalDuration('PT1H')).toBe(false));
  it('null → false', () => expect(isTemporalDuration(null)).toBe(false));
  it('undefined → false', () => expect(isTemporalDuration(undefined)).toBe(false));
});

describe('isTemporalDuration — narrowing in if/else', () => {
  it('narrows the value to Temporal.Duration in the then-branch', () => {
    const v: unknown = Temporal.Duration.from({ hours: 1 });
    if (isTemporalDuration(v)) {
      expectTypeOf(v).toEqualTypeOf<Temporal.Duration>();
      expect(v.hours).toBe(1);
    } else {
      throw new Error('expected then-branch');
    }
    expect(isTemporalDuration(1000)).toBe(false);
  });
});
