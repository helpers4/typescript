/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isTimestamp } from './isTimestamp';

describe('isTimestamp', () => {
  it('should return true for JS millisecond timestamps', () => {
    expect(isTimestamp(1609459200000)).toBe(true);
    expect(isTimestamp(Date.now())).toBe(true);
    expect(isTimestamp(0)).toBe(true);
  });

  it('should return true for Unix second timestamps', () => {
    expect(isTimestamp(1609459200)).toBe(true);
    expect(isTimestamp(0)).toBe(true);
  });

  it('should return true for negative timestamps (before epoch)', () => {
    expect(isTimestamp(-1000)).toBe(true);
    expect(isTimestamp(-1609459200000)).toBe(true);
  });

  it('should return false for values exceeding max Date range', () => {
    expect(isTimestamp(8640000000000001)).toBe(false);
    expect(isTimestamp(-8640000000000001)).toBe(false);
  });

  it('should return false for NaN and Infinity', () => {
    expect(isTimestamp(NaN)).toBe(false);
    expect(isTimestamp(Infinity)).toBe(false);
    expect(isTimestamp(-Infinity)).toBe(false);
  });

  it('should return false for non-numbers', () => {
    expect(isTimestamp('1609459200000')).toBe(false);
    expect(isTimestamp(null)).toBe(false);
    expect(isTimestamp(undefined)).toBe(false);
    expect(isTimestamp({})).toBe(false);
    expect(isTimestamp(true)).toBe(false);
  });
});
