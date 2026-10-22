/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, expectTypeOf, it } from 'vitest';
import { isTemporalPlainDateTime } from './isTemporalPlainDateTime';

describe('isTemporalPlainDateTime — property-based', () => {
  it('PlainDateTimes from various strings are detected', () => {
    const inputs = ['2025-01-19T00:00', '2025-06-15T12:30:45', '1999-12-31T23:59:59'];
    for (const str of inputs) {
      const pdt = Temporal.PlainDateTime.from(str);
      expect(isTemporalPlainDateTime(pdt)).toBe(true);
    }
  });

  it('no other Temporal type is mistaken for PlainDateTime', () => {
    const others = [
      Temporal.Now.instant(),
      Temporal.Now.zonedDateTimeISO(),
      Temporal.Now.plainDateISO(),
      Temporal.Now.plainTimeISO(),
      Temporal.Duration.from({ hours: 1 }),
    ];
    for (const obj of others) {
      expect(isTemporalPlainDateTime(obj)).toBe(false);
    }
  });
});

describe('isTemporalPlainDateTime — contract', () => {
  it('PlainDateTime.from() → true', () => {
    expect(isTemporalPlainDateTime(Temporal.PlainDateTime.from('2025-01-19T12:00'))).toBe(true);
  });
  it('Now.plainDateTimeISO() → true', () => {
    expect(isTemporalPlainDateTime(Temporal.Now.plainDateTimeISO())).toBe(true);
  });
  it('PlainDate → false', () => expect(isTemporalPlainDateTime(Temporal.Now.plainDateISO())).toBe(false));
  it('Date → false', () => expect(isTemporalPlainDateTime(new Date())).toBe(false));
  it('string → false', () => expect(isTemporalPlainDateTime('2025-01-19T12:00')).toBe(false));
  it('null → false', () => expect(isTemporalPlainDateTime(null)).toBe(false));
  it('undefined → false', () => expect(isTemporalPlainDateTime(undefined)).toBe(false));
});

describe('isTemporalPlainDateTime — narrowing in if/else', () => {
  it('narrows the value to Temporal.PlainDateTime in the then-branch', () => {
    const v: unknown = Temporal.PlainDateTime.from('2024-01-01T12:00');
    if (isTemporalPlainDateTime(v)) {
      expectTypeOf(v).toEqualTypeOf<Temporal.PlainDateTime>();
      expect(v.year).toBe(2024);
    } else {
      throw new Error('expected then-branch');
    }
    expect(isTemporalPlainDateTime(new Date())).toBe(false);
  });
});
