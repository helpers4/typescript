/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isPlainObject } from './isPlainObject';

describe('isPlainObject', () => {
  it('should return true for plain objects', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1 })).toBe(true);
    expect(isPlainObject(new Object())).toBe(true);
  });

  it('should return true for Object.create(null)', () => {
    expect(isPlainObject(Object.create(null))).toBe(true);
  });

  it('should return false for null', () => {
    expect(isPlainObject(null)).toBe(false);
  });

  it('should return false for arrays', () => {
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject([1, 2])).toBe(false);
  });

  it('should return false for class instances', () => {
    class Foo { }
    expect(isPlainObject(new Foo())).toBe(false);
  });

  it('should return false for built-in objects', () => {
    expect(isPlainObject(new Date())).toBe(false);
    expect(isPlainObject(new Map())).toBe(false);
    expect(isPlainObject(new Set())).toBe(false);
    expect(isPlainObject(/regex/)).toBe(false);
  });

  it('should return false for primitives', () => {
    expect(isPlainObject(42)).toBe(false);
    expect(isPlainObject('string')).toBe(false);
    expect(isPlainObject(true)).toBe(false);
    expect(isPlainObject(undefined)).toBe(false);
  });
});
