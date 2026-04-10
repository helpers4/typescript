/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { shallowEquals } from './shallowEquals';

describe('shallowEquals', () => {
  it('should return true for identical objects', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 2 };
    expect(shallowEquals(obj1, obj2)).toBe(true);
  });

  it('should return false for different objects', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 3 };
    expect(shallowEquals(obj1, obj2)).toBe(false);
  });

  it('should return true for identical primitives', () => {
    expect(shallowEquals(5, 5)).toBe(true);
    expect(shallowEquals('hello', 'hello')).toBe(true);
    expect(shallowEquals(true, true)).toBe(true);
  });

  it('should return false for different primitives', () => {
    expect(shallowEquals(5, 6)).toBe(false);
    expect(shallowEquals('hello', 'world')).toBe(false);
    expect(shallowEquals(true, false)).toBe(false);
  });

  it('should handle nested objects', () => {
    const obj1 = { a: { b: { c: 1 } } };
    const obj2 = { a: { b: { c: 1 } } };
    const obj3 = { a: { b: { c: 2 } } };

    expect(shallowEquals(obj1, obj2)).toBe(true);
    expect(shallowEquals(obj1, obj3)).toBe(false);
  });

  it('should handle arrays', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];
    const arr3 = [1, 2, 4];

    expect(shallowEquals(arr1, arr2)).toBe(true);
    expect(shallowEquals(arr1, arr3)).toBe(false);
  });

  it('should handle null and undefined', () => {
    expect(shallowEquals(null, null)).toBe(true);
    expect(shallowEquals(undefined, undefined)).toBe(true);
    expect(shallowEquals(null, undefined)).toBe(false);
  });

  it('should handle functions by reference equality', () => {
    const func1 = () => { };
    const func2 = () => { };

    expect(shallowEquals(func1, func1)).toBe(true);
    expect(shallowEquals(func1, func2)).toBe(false);
  });

  it('should be sensitive to property order (JSON.stringify limitation)', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { b: 2, a: 1 };
    // This might be false due to JSON.stringify property order sensitivity
    // This is a known limitation of shallowEquals
    expect(shallowEquals(obj1, obj2)).toBe(false);
  });

  it('should handle circular references by falling back to === comparison', () => {
    const obj1: any = { a: 1 };
    obj1.self = obj1;
    const obj2: any = { a: 1 };
    obj2.self = obj2;

    expect(shallowEquals(obj1, obj1)).toBe(true); // Same reference
    expect(shallowEquals(obj1, obj2)).toBe(false); // Different references
  });

  it('should handle dates', () => {
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2023-01-01');
    const date3 = new Date('2023-01-02');

    expect(shallowEquals(date1, date2)).toBe(true);
    expect(shallowEquals(date1, date3)).toBe(false);
  });

  it('should handle mixed types', () => {
    expect(shallowEquals(1, '1')).toBe(false);
    expect(shallowEquals([], {})).toBe(false);
    expect(shallowEquals(null, 0)).toBe(false);
  });

  it('should handle objects with undefined values', () => {
    const obj1 = { a: 1, b: undefined };
    const obj2 = { a: 1, b: undefined };
    expect(shallowEquals(obj1, obj2)).toBe(true);
  });

  it('should return true for same reference via early return', () => {
    const obj = { a: 1, b: { c: 2 } };
    expect(shallowEquals(obj, obj)).toBe(true);
  });

  it('should return false when only first argument is a function', () => {
    expect(shallowEquals(() => {}, 'not a function')).toBe(false);
  });

  it('should return false when only second argument is a function', () => {
    expect(shallowEquals('not a function', () => {})).toBe(false);
  });

  it('should return true for same function reference', () => {
    const fn = () => {};
    expect(shallowEquals(fn, fn)).toBe(true);
  });

  it('should return false for different function references', () => {
    expect(shallowEquals(() => {}, () => {})).toBe(false);
  });

  it('should handle circular references gracefully', () => {
    const obj1: Record<string, unknown> = { a: 1 };
    obj1.self = obj1;
    const obj2: Record<string, unknown> = { a: 1 };
    obj2.self = obj2;

    // Different circular objects should return false (fallback to ===)
    expect(shallowEquals(obj1, obj2)).toBe(false);
  });
});
