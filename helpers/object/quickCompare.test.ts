/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, it, expect } from 'vitest';
import { quickCompare } from './quickCompare';

describe('quickCompare', () => {
  it('should return true for identical objects', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 2 };
    expect(quickCompare(obj1, obj2)).toBe(true);
  });

  it('should return false for different objects', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 3 };
    expect(quickCompare(obj1, obj2)).toBe(false);
  });

  it('should return true for identical primitives', () => {
    expect(quickCompare(5, 5)).toBe(true);
    expect(quickCompare('hello', 'hello')).toBe(true);
    expect(quickCompare(true, true)).toBe(true);
  });

  it('should return false for different primitives', () => {
    expect(quickCompare(5, 6)).toBe(false);
    expect(quickCompare('hello', 'world')).toBe(false);
    expect(quickCompare(true, false)).toBe(false);
  });

  it('should handle nested objects', () => {
    const obj1 = { a: { b: { c: 1 } } };
    const obj2 = { a: { b: { c: 1 } } };
    const obj3 = { a: { b: { c: 2 } } };

    expect(quickCompare(obj1, obj2)).toBe(true);
    expect(quickCompare(obj1, obj3)).toBe(false);
  });

  it('should handle arrays', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];
    const arr3 = [1, 2, 4];

    expect(quickCompare(arr1, arr2)).toBe(true);
    expect(quickCompare(arr1, arr3)).toBe(false);
  });

  it('should handle null and undefined', () => {
    expect(quickCompare(null, null)).toBe(true);
    expect(quickCompare(undefined, undefined)).toBe(true);
    expect(quickCompare(null, undefined)).toBe(false);
  });

  it('should handle functions by reference equality', () => {
    const func1 = () => { };
    const func2 = () => { };

    expect(quickCompare(func1, func1)).toBe(true);
    expect(quickCompare(func1, func2)).toBe(false);
  });

  it('should be sensitive to property order (JSON.stringify limitation)', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { b: 2, a: 1 };
    // This might be false due to JSON.stringify property order sensitivity
    // This is a known limitation of quickCompare
    expect(quickCompare(obj1, obj2)).toBe(false);
  });

  it('should handle circular references by falling back to === comparison', () => {
    const obj1: any = { a: 1 };
    obj1.self = obj1;
    const obj2: any = { a: 1 };
    obj2.self = obj2;

    expect(quickCompare(obj1, obj1)).toBe(true); // Same reference
    expect(quickCompare(obj1, obj2)).toBe(false); // Different references
  });

  it('should handle dates', () => {
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2023-01-01');
    const date3 = new Date('2023-01-02');

    expect(quickCompare(date1, date2)).toBe(true);
    expect(quickCompare(date1, date3)).toBe(false);
  });

  it('should handle mixed types', () => {
    expect(quickCompare(1, '1')).toBe(false);
    expect(quickCompare([], {})).toBe(false);
    expect(quickCompare(null, 0)).toBe(false);
  });

  it('should handle objects with undefined values', () => {
    const obj1 = { a: 1, b: undefined };
    const obj2 = { a: 1, b: undefined };
    expect(quickCompare(obj1, obj2)).toBe(true);
  });
});
