/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, it, expect } from 'vitest';
import { deepCompare, DeepCompareResult } from './deepCompare';

describe('deepCompare', () => {
  it('should return true for identical objects', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 2 };
    expect(deepCompare(obj1, obj2)).toBe(true);
  });

  it('should return true for same reference', () => {
    const obj = { a: 1, b: 2 };
    expect(deepCompare(obj, obj)).toBe(true);
  });

  it('should return differences for different values', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 3 };
    const result = deepCompare(obj1, obj2) as DeepCompareResult;
    expect(result).toEqual({ b: false });
  });

  it('should detect properties only in first object', () => {
    const obj1 = { a: 1, b: 2, c: 3 };
    const obj2 = { a: 1, b: 2 };
    const result = deepCompare(obj1, obj2) as DeepCompareResult;
    expect(result).toEqual({ c: "onlyA" });
  });

  it('should detect properties only in second object', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 2, c: 3 };
    const result = deepCompare(obj1, obj2) as DeepCompareResult;
    expect(result).toEqual({ c: "onlyB" });
  });

  it('should handle nested objects recursively', () => {
    const obj1 = {
      a: 1,
      nested: { x: 1, y: 2 }
    };
    const obj2 = {
      a: 1,
      nested: { x: 1, y: 3 }
    };
    const result = deepCompare(obj1, obj2) as DeepCompareResult;
    expect(result).toEqual({
      nested: { y: false }
    });
  });

  it('should handle arrays by returning false for differences', () => {
    const obj1 = { arr: [1, 2, 3] };
    const obj2 = { arr: [1, 2, 4] };
    const result = deepCompare(obj1, obj2) as DeepCompareResult;
    expect(result).toEqual({ arr: false });
  });

  it('should return true for identical arrays', () => {
    const obj1 = { arr: [1, 2, 3] };
    const obj2 = { arr: [1, 2, 3] };
    expect(deepCompare(obj1, obj2)).toBe(true);
  });

  it('should handle complex nested structures', () => {
    const obj1 = {
      a: 1,
      nested: {
        arr: [1, 2, 3],
        deep: {
          value: 'test'
        }
      },
      onlyInA: true
    };
    const obj2 = {
      a: 1,
      nested: {
        arr: [1, 2, 4],
        deep: {
          value: 'test',
          extra: 'new'
        }
      },
      onlyInB: false
    };

    const result = deepCompare(obj1, obj2) as DeepCompareResult;
    expect(result).toEqual({
      nested: {
        arr: false,
        deep: {
          extra: "onlyB"
        }
      },
      onlyInA: "onlyA",
      onlyInB: "onlyB"
    });
  });

  it('should handle null and undefined', () => {
    expect(deepCompare(null, null)).toBe(true);
    expect(deepCompare(undefined, undefined)).toBe(true);
    expect(deepCompare(null, undefined)).toBe(false);
    expect(deepCompare({ a: null }, { a: undefined })).toEqual({ a: false });
  });

  it('should handle different object types', () => {
    expect(deepCompare({}, [])).toBe(false);
    expect(deepCompare(null, {})).toBe(false);
  });

  it('should handle undefined and null parameters', () => {
    expect(deepCompare(undefined, null)).toBe(false);
    expect(deepCompare(undefined, {})).toBe(false);
    expect(deepCompare(null, { a: 1 })).toBe(false);
  });

  it('should handle arrays using quickCompare', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];
    const arr3 = [1, 2, 4];

    expect(deepCompare(arr1, arr2)).toBe(true);
    expect(deepCompare(arr1, arr3)).toBe(false);
  });

  it('should handle arrays in object properties using quickCompare', () => {
    const obj1 = { arr: [1, 2, { nested: 'value' }] };
    const obj2 = { arr: [1, 2, { nested: 'value' }] };
    const obj3 = { arr: [1, 2, { nested: 'different' }] };

    expect(deepCompare(obj1, obj2)).toBe(true);
    expect(deepCompare(obj1, obj3)).toEqual({ arr: false });
  });

  it('should handle special objects by reference only', () => {
    const func1 = () => { };
    const func2 = () => { };
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2023-01-01');
    const promise1 = Promise.resolve(1);
    const promise2 = Promise.resolve(1);

    // Same reference should be true
    expect(deepCompare(func1, func1)).toBe(true);
    expect(deepCompare(promise1, promise1)).toBe(true);

    // Different references should be false (except dates which use compareDate)
    expect(deepCompare(func1, func2)).toBe(false);
    expect(deepCompare(promise1, promise2)).toBe(false);
    expect(deepCompare(date1, date2)).toBe(true); // dates use compareDate
  });

  it('should handle special objects in properties', () => {
    const func1 = () => { };
    const func2 = () => { };
    const regex1 = /test/;
    const regex2 = /test/;

    const obj1 = { fn: func1, regex: regex1 };
    const obj2 = { fn: func1, regex: regex1 }; // Same references
    const obj3 = { fn: func2, regex: regex2 }; // Different references

    expect(deepCompare(obj1, obj2)).toBe(true);
    expect(deepCompare(obj1, obj3)).toEqual({ fn: false, regex: false });
  });

  it('should not deep compare special objects properties', () => {
    const obj1 = {
      special: new Map([['key', 'value']]),
      normal: { nested: { deep: 'value' } }
    };
    const obj2 = {
      special: new Map([['key', 'value']]), // Different Map instance
      normal: { nested: { deep: 'different' } }
    };

    const result = deepCompare(obj1, obj2) as any;
    expect(result.special).toBe(false); // Maps compared by reference
    expect(result.normal.nested.deep).toBe(false); // Normal objects compared deeply
  });
});
