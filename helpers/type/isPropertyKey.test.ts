/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isPropertyKey } from './isPropertyKey';

describe('isPropertyKey', () => {
  it('should return true for strings', () => {
    expect(isPropertyKey('')).toBe(true);
    expect(isPropertyKey('name')).toBe(true);
    expect(isPropertyKey('0')).toBe(true);
  });

  it('should return true for numbers', () => {
    expect(isPropertyKey(0)).toBe(true);
    expect(isPropertyKey(42)).toBe(true);
    expect(isPropertyKey(-1)).toBe(true);
    expect(isPropertyKey(NaN)).toBe(true);
    expect(isPropertyKey(Infinity)).toBe(true);
  });

  it('should return true for symbols', () => {
    expect(isPropertyKey(Symbol('id'))).toBe(true);
    expect(isPropertyKey(Symbol.iterator)).toBe(true);
    expect(isPropertyKey(Symbol.for('key'))).toBe(true);
  });

  it('should return false for null and undefined', () => {
    expect(isPropertyKey(null)).toBe(false);
    expect(isPropertyKey(undefined)).toBe(false);
  });

  it('should return false for booleans', () => {
    expect(isPropertyKey(true)).toBe(false);
    expect(isPropertyKey(false)).toBe(false);
  });

  it('should return false for objects and arrays', () => {
    expect(isPropertyKey({})).toBe(false);
    expect(isPropertyKey([])).toBe(false);
    expect(isPropertyKey(() => {})).toBe(false);
  });

  it('should return false for bigint', () => {
    expect(isPropertyKey(BigInt(1))).toBe(false);
  });
});
