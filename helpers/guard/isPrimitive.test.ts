/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isPrimitive } from './isPrimitive';

describe('isPrimitive', () => {
  it('should return true for strings', () => {
    expect(isPrimitive('hello')).toBe(true);
    expect(isPrimitive('')).toBe(true);
  });

  it('should return true for numbers', () => {
    expect(isPrimitive(42)).toBe(true);
    expect(isPrimitive(0)).toBe(true);
    expect(isPrimitive(NaN)).toBe(true);
    expect(isPrimitive(Infinity)).toBe(true);
  });

  it('should return true for booleans', () => {
    expect(isPrimitive(true)).toBe(true);
    expect(isPrimitive(false)).toBe(true);
  });

  it('should return true for bigints', () => {
    expect(isPrimitive(42n)).toBe(true);
  });

  it('should return true for symbols', () => {
    expect(isPrimitive(Symbol('s'))).toBe(true);
  });

  it('should return true for null and undefined', () => {
    expect(isPrimitive(null)).toBe(true);
    expect(isPrimitive(undefined)).toBe(true);
  });

  it('should return false for objects', () => {
    expect(isPrimitive({})).toBe(false);
    expect(isPrimitive([])).toBe(false);
    expect(isPrimitive(new Date())).toBe(false);
    expect(isPrimitive(new Map())).toBe(false);
    expect(isPrimitive(/regex/)).toBe(false);
  });

  it('should return false for functions', () => {
    expect(isPrimitive(() => { })).toBe(false);
    expect(isPrimitive(function () { })).toBe(false);
  });
});
