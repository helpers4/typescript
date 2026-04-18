/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isTemporalPlainTime } from './isTemporalPlainTime';

describe('isTemporalPlainTime — property-based', () => {
  it('PlainTimes from various strings are detected', () => {
    const times = ['00:00:00', '12:30:45', '23:59:59.999999999'];
    for (const str of times) {
      const pt = Temporal.PlainTime.from(str);
      expect(isTemporalPlainTime(pt)).toBe(true);
    }
  });

  it('no other Temporal type is mistaken for PlainTime', () => {
    const others = [
      Temporal.Now.instant(),
      Temporal.Now.zonedDateTimeISO(),
      Temporal.Now.plainDateISO(),
      Temporal.Now.plainDateTimeISO(),
      Temporal.Duration.from({ minutes: 30 }),
    ];
    for (const obj of others) {
      expect(isTemporalPlainTime(obj)).toBe(false);
    }
  });
});

describe('isTemporalPlainTime — contract', () => {
  it('PlainTime.from() → true', () => {
    expect(isTemporalPlainTime(Temporal.PlainTime.from('12:30'))).toBe(true);
  });
  it('Now.plainTimeISO() → true', () => {
    expect(isTemporalPlainTime(Temporal.Now.plainTimeISO())).toBe(true);
  });
  it('PlainDateTime → false', () => expect(isTemporalPlainTime(Temporal.Now.plainDateTimeISO())).toBe(false));
  it('Date → false', () => expect(isTemporalPlainTime(new Date())).toBe(false));
  it('string → false', () => expect(isTemporalPlainTime('12:30')).toBe(false));
  it('null → false', () => expect(isTemporalPlainTime(null)).toBe(false));
  it('undefined → false', () => expect(isTemporalPlainTime(undefined)).toBe(false));
});
