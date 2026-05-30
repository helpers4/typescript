/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { isValidDate } from './isValidDate';
import { isDate } from './isDate';

describe('isValidDate — property-based', () => {
  it('isValidDate(v) → isDate(v)', () => {
    fc.assert(
      fc.property(fc.date(), (d) => {
        if (isValidDate(d)) {
          expect(isDate(d)).toBe(true);
        }
      }),
    );
  });

  it('valid dates have finite getTime()', () => {
    fc.assert(
      fc.property(fc.date(), (d) => {
        if (isValidDate(d)) {
          expect(Number.isFinite(d.getTime())).toBe(true);
        }
      }),
    );
  });
});

describe('isValidDate — contract', () => {
  it('new Date() → true', () => expect(isValidDate(new Date())).toBe(true));
  it('new Date(0) → true', () => expect(isValidDate(new Date(0))).toBe(true));
  it("new Date('2024-01-01') → true", () => expect(isValidDate(new Date('2024-01-01'))).toBe(true));
  it("new Date('invalid') → false", () => expect(isValidDate(new Date('invalid'))).toBe(false));
  it("'date string' → false", () => expect(isValidDate('2024-01-01')).toBe(false));
  it('null → false', () => expect(isValidDate(null)).toBe(false));
  it('undefined → false', () => expect(isValidDate(undefined)).toBe(false));
  it('Date.now() (number) → false', () => expect(isValidDate(Date.now())).toBe(false));
});

describe('isValidDate — narrowing in if/else', () => {
  it('narrows the value to Date in the then-branch', () => {
    const v: unknown = new Date('2024-01-01');
    if (isValidDate(v)) {
      expectTypeOf(v).toEqualTypeOf<Date>();
      expect(Number.isFinite(v.getTime())).toBe(true);
    } else {
      throw new Error('expected then-branch');
    }
    expect(isValidDate(new Date('not-a-date'))).toBe(false);
  });
});
