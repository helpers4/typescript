/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isSameDay } from './is';

const validDate = () => fc.date().filter((d) => !isNaN(d.getTime()));

describe('isSameDay — property-based', () => {
  it('is reflexive: isSameDay(d, d) === true', () => {
    fc.assert(
      fc.property(validDate(), (d) => {
        expect(isSameDay(d, d)).toBe(true);
      })
    );
  });

  it('is symmetric', () => {
    fc.assert(
      fc.property(validDate(), validDate(), (a, b) => {
        expect(isSameDay(a, b)).toBe(isSameDay(b, a));
      })
    );
  });

  it('same timestamp → true', () => {
    fc.assert(
      fc.property(validDate(), (d) => {
        const copy = new Date(d.getTime());
        expect(isSameDay(d, copy)).toBe(true);
      })
    );
  });
});

describe('isSameDay — contract', () => {
  it('same day different times → true', () => {
    const a = new Date('2025-06-15T00:00:00.000');
    const b = new Date('2025-06-15T23:59:59.999');
    expect(isSameDay(a, b)).toBe(true);
  });

  it('different days → false', () => {
    const a = new Date('2025-06-15T12:00:00.000');
    const b = new Date('2025-06-16T12:00:00.000');
    expect(isSameDay(a, b)).toBe(false);
  });

  it('1ms before midnight vs 1ms after midnight → false (local)', () => {
    // Build midnight boundary in local time
    const midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    const before = new Date(midnight.getTime() - 1);  // 23:59:59.999 yesterday
    const after = new Date(midnight.getTime() + 1);   // 00:00:00.001 today
    expect(isSameDay(before, after)).toBe(false);
  });

  it('different months → false', () => {
    const a = new Date('2025-01-31T12:00:00.000');
    const b = new Date('2025-02-01T12:00:00.000');
    expect(isSameDay(a, b)).toBe(false);
  });

  it('different years → false', () => {
    const a = new Date('2024-12-31T12:00:00.000');
    const b = new Date('2025-01-01T12:00:00.000');
    expect(isSameDay(a, b)).toBe(false);
  });
});
