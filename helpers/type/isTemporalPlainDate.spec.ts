/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isTemporalPlainDate } from './isTemporalPlainDate';

describe('isTemporalPlainDate — property-based', () => {
  it('PlainDates from various strings are detected', () => {
    const dates = ['2020-01-01', '2025-06-15', '1999-12-31', '2030-02-28'];
    for (const str of dates) {
      const pd = Temporal.PlainDate.from(str);
      expect(isTemporalPlainDate(pd)).toBe(true);
    }
  });

  it('no other Temporal type is mistaken for PlainDate', () => {
    const others = [
      Temporal.Now.instant(),
      Temporal.Now.zonedDateTimeISO(),
      Temporal.Now.plainDateTimeISO(),
      Temporal.Now.plainTimeISO(),
      Temporal.Duration.from({ days: 1 }),
    ];
    for (const obj of others) {
      expect(isTemporalPlainDate(obj)).toBe(false);
    }
  });
});

describe('isTemporalPlainDate — contract', () => {
  it('PlainDate.from() → true', () => {
    expect(isTemporalPlainDate(Temporal.PlainDate.from('2025-01-19'))).toBe(true);
  });
  it('Now.plainDateISO() → true', () => {
    expect(isTemporalPlainDate(Temporal.Now.plainDateISO())).toBe(true);
  });
  it('PlainDateTime → false', () => expect(isTemporalPlainDate(Temporal.Now.plainDateTimeISO())).toBe(false));
  it('Date → false', () => expect(isTemporalPlainDate(new Date())).toBe(false));
  it('string → false', () => expect(isTemporalPlainDate('2025-01-19')).toBe(false));
  it('null → false', () => expect(isTemporalPlainDate(null)).toBe(false));
  it('undefined → false', () => expect(isTemporalPlainDate(undefined)).toBe(false));
});
