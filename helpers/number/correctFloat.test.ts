/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { correctFloat } from './correctFloat';

describe('correctFloat', () => {
  it('corrects classic 0.1 + 0.2 drift', () => {
    expect(correctFloat(0.1 + 0.2)).toBe(0.3);
  });

  it('corrects subtraction drift', () => {
    expect(correctFloat(1.1 - 0.3)).toBe(0.8);
  });

  it('corrects multiplication drift', () => {
    expect(correctFloat(0.1 * 3)).toBe(0.3);
  });

  it('leaves already-exact values unchanged', () => {
    expect(correctFloat(0.5)).toBe(0.5);
    expect(correctFloat(1.25)).toBe(1.25);
    expect(correctFloat(100)).toBe(100);
  });

  it('handles zero', () => {
    expect(correctFloat(0)).toBe(0);
    expect(Object.is(correctFloat(-0), -0)).toBe(true);
  });

  it('handles negative values', () => {
    expect(correctFloat(-0.1 - 0.2)).toBe(-0.3);
  });

  it('respects custom precision', () => {
    expect(correctFloat(1.23456789, 4)).toBe(1.235);
    expect(correctFloat(1.23456789, 6)).toBe(1.23457);
  });

  it('handles large integers', () => {
    expect(correctFloat(1_000_000)).toBe(1_000_000);
  });

  it('silently truncates decimal digits for |value| >= 1e13 at default precision', () => {
    // 1e13 consumes all 14 significant digits with its integer part;
    // the fractional .1 is rounded away — documented, intentional behavior.
    expect(correctFloat(1e13 + 0.1)).toBe(1e13);
  });

  it('throws RangeError for NaN value', () => {
    expect(() => correctFloat(NaN)).toThrow(RangeError);
    expect(() => correctFloat(NaN)).toThrow('finite number');
  });

  it('throws RangeError for Infinity value', () => {
    expect(() => correctFloat(Infinity)).toThrow(RangeError);
    expect(() => correctFloat(-Infinity)).toThrow(RangeError);
    expect(() => correctFloat(Infinity)).toThrow('finite number');
  });

  it('throws RangeError for NaN or Infinity precision', () => {
    expect(() => correctFloat(0.3, NaN)).toThrow(RangeError);
    expect(() => correctFloat(0.3, NaN)).toThrow('an integer between 1 and 100');
    expect(() => correctFloat(0.3, Infinity)).toThrow(RangeError);
  });

  it('throws RangeError for non-integer precision', () => {
    expect(() => correctFloat(0.3, 3.7)).toThrow(RangeError);
    expect(() => correctFloat(0.3, 3.7)).toThrow('an integer between 1 and 100');
  });

  it('precision 1 returns one significant digit', () => {
    expect(correctFloat(1.9, 1)).toBe(2);
    // 0.15 is stored as ~0.1499... in IEEE-754, so rounding to 1 sig digit gives 0.1
    expect(correctFloat(0.15, 1)).toBe(0.1);
    expect(correctFloat(0.25, 1)).toBe(0.3);
  });
});
