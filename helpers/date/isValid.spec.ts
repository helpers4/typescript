/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { isDate } from '../guard/isDate';
import { isValid } from './isValid';

describe('isValid — property-based', () => {
  it('isValid(v) → isDate(v)', () => {
    fc.assert(
      fc.property(fc.date(), (d) => {
        if (isValid(d)) {
          expect(isDate(d)).toBe(true);
        }
      }),
    );
  });

  it('valid dates have finite getTime()', () => {
    fc.assert(
      fc.property(fc.date(), (d) => {
        if (isValid(d)) {
          expect(Number.isFinite(d.getTime())).toBe(true);
        }
      }),
    );
  });
});

describe('isValid — contract', () => {
  it('new Date() → true', () => expect(isValid(new Date())).toBe(true));
  it('new Date(0) → true', () => expect(isValid(new Date(0))).toBe(true));
  it("new Date('2024-01-01') → true", () => expect(isValid(new Date('2024-01-01'))).toBe(true));
  it("new Date('invalid') → false", () => expect(isValid(new Date('invalid'))).toBe(false));
  it("'date string' → false", () => expect(isValid('2024-01-01')).toBe(false));
  it('null → false', () => expect(isValid(null)).toBe(false));
  it('undefined → false', () => expect(isValid(undefined)).toBe(false));
  it('Date.now() (number) → false', () => expect(isValid(Date.now())).toBe(false));
});

describe('isValid — narrowing in if/else', () => {
  it('narrows the value to Date in the then-branch', () => {
    const v: unknown = new Date('2024-01-01');
    if (isValid(v)) {
      expectTypeOf(v).toEqualTypeOf<Date>();
      expect(Number.isFinite(v.getTime())).toBe(true);
    } else {
      throw new Error('expected then-branch');
    }
    expect(isValid(new Date('not-a-date'))).toBe(false);
  });
});
