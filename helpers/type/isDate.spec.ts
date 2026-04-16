/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isDate } from './isDate';

describe('isDate — property-based', () => {
  it('Date instances always pass (even invalid)', () => {
    fc.assert(
      fc.property(fc.date(), (d) => {
        expect(isDate(d)).toBe(true);
      }),
    );
  });

  it('primitives are never dates', () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.integer(), fc.string(), fc.boolean(), fc.constant(null), fc.constant(undefined)),
        (v) => {
          expect(isDate(v)).toBe(false);
        },
      ),
    );
  });

  it('isDate does not imply valid date — new Date("invalid") passes', () => {
    expect(isDate(new Date('invalid'))).toBe(true);
  });
});

describe('isDate — contract', () => {
  it('new Date() → true', () => expect(isDate(new Date())).toBe(true));
  it('new Date(0) → true', () => expect(isDate(new Date(0))).toBe(true));
  it("new Date('invalid') → true (no validity check)", () => expect(isDate(new Date('invalid'))).toBe(true));
  it("'2024-01-01' → false", () => expect(isDate('2024-01-01')).toBe(false));
  it('Date.now() → false (number)', () => expect(isDate(Date.now())).toBe(false));
  it('null → false', () => expect(isDate(null)).toBe(false));
  it('undefined → false', () => expect(isDate(undefined)).toBe(false));
  it('{} → false', () => expect(isDate({})).toBe(false));
});
