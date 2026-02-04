/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isEmpty } from './isEmpty';

describe('isEmpty', () => {
  it('should treat null and undefined as empty', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
  });

  it('should handle strings', () => {
    expect(isEmpty('')).toBe(true);
    expect(isEmpty(' ')).toBe(false);
    expect(isEmpty('text')).toBe(false);
  });

  it('should handle arrays', () => {
    expect(isEmpty([])).toBe(true);
    expect(isEmpty([1])).toBe(false);
  });

  it('should handle plain objects', () => {
    expect(isEmpty({})).toBe(true);
    expect(isEmpty({ a: 1 })).toBe(false);
  });

  it('should handle objects with null prototype', () => {
    const obj = Object.create(null) as Record<string, unknown>;
    expect(isEmpty(obj)).toBe(true);
    obj.key = 'value';
    expect(isEmpty(obj)).toBe(false);
  });

  it('should handle Map and Set', () => {
    expect(isEmpty(new Map())).toBe(true);
    expect(isEmpty(new Set())).toBe(true);
    expect(isEmpty(new Map([['key', 'value']]))).toBe(false);
    expect(isEmpty(new Set([1]))).toBe(false);
  });

  it('should return false for special objects', () => {
    expect(isEmpty(new Date())).toBe(false);
    class Example {}
    expect(isEmpty(new Example())).toBe(false);
  });

  it('should return false for numbers, booleans and functions', () => {
    expect(isEmpty(0)).toBe(false);
    expect(isEmpty(false)).toBe(false);
    expect(isEmpty(() => undefined)).toBe(false);
  });
});
