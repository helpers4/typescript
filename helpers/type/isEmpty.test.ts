/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
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

  // --- Mutation-killing tests ---

  // L46: ConditionalExpression -> false (isSpecialObject check skipped)
  // If false, special objects would fall through to Object.keys check
  it('should return false for special objects (not check keys)', () => {
    // Date has no own enumerable keys by default
    // If isSpecialObject check is false, isEmpty(new Date()) would check Object.keys
    // which returns [] -> isEmpty would return true, which is wrong
    expect(isEmpty(new Date())).toBe(false);
    expect(isEmpty(/regex/)).toBe(false);
    expect(isEmpty(new Error('test'))).toBe(false);
  });

  // L45: ConditionalExpression -> true (typeof value === 'object' always true)
  // If true, non-objects like numbers would enter the object branch
  it('should return false for numbers (not enter object branch)', () => {
    expect(isEmpty(42)).toBe(false);
    expect(isEmpty(0)).toBe(false);
    expect(isEmpty(-1)).toBe(false);
  });

  // L46: BlockStatement {} (removes return false for special objects)
  // Special objects would fall through to prototype check
  it('should return false for special objects regardless of prototype', () => {
    const promise = Promise.resolve();
    expect(isEmpty(promise)).toBe(false);
    expect(isEmpty(new Map())).toBe(true); // Map/Set are handled earlier
    expect(isEmpty(new Set())).toBe(true); // Map/Set are handled earlier
  });
});
