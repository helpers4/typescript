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

  it('should handle unequal primitives in object properties', () => {
    const obj1 = { num: 42, str: 'hello', bool: true };
    const obj2 = { num: 43, str: 'world', bool: false };
    const result = deepCompare(obj1, obj2) as DeepCompareResult;
    expect(result).toEqual({ num: false, str: false, bool: false });
  });

  it('should handle comparing objects with various special types', () => {
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2023-01-01');
    const date3 = new Date('2023-01-02');

    expect(deepCompare(date1, date2)).toBe(true);
    expect(deepCompare(date1, date3)).toBe(false);
  });

  it('should handle dates in object properties correctly', () => {
    const obj1 = { created: new Date('2023-01-01'), name: 'test' };
    const obj2 = { created: new Date('2023-01-01'), name: 'test' };
    const obj3 = { created: new Date('2023-01-02'), name: 'test' };

    expect(deepCompare(obj1, obj2)).toBe(true);
    expect(deepCompare(obj1, obj3)).toEqual({ created: false });
  });

  it('should handle functions in object properties', () => {
    const func1 = () => { };
    const func2 = () => { };

    const obj1 = { fn: func1 };
    const obj2 = { fn: func1 };
    const obj3 = { fn: func2 };

    expect(deepCompare(obj1, obj2)).toBe(true);
    expect(deepCompare(obj1, obj3)).toEqual({ fn: false });
  });

  it('should handle mixed types in properties', () => {
    const obj1 = { a: null, b: undefined, c: 42 };
    const obj2 = { a: undefined, b: null, c: '42' };
    const result = deepCompare(obj1, obj2) as DeepCompareResult;
    expect(result).toEqual({ a: false, b: false, c: false });
  });

  it('should handle null/undefined in object property values', () => {
    const obj1 = { value: null };
    const obj2 = { value: undefined };
    const obj3 = { value: true };

    expect(deepCompare(obj1, obj2)).toEqual({ value: false });
    expect(deepCompare(obj1, obj3)).toEqual({ value: false });
    expect(deepCompare(obj2, obj3)).toEqual({ value: false });
  });

  it('should handle nested objects with only-in-A properties', () => {
    const obj1 = { nested: { a: 1, b: 2 } };
    const obj2 = { nested: { a: 1 } };
    const result = deepCompare(obj1, obj2);
    expect(result).toEqual({ nested: { b: 'onlyA' } });
  });

  it('should handle deeply nested differences with object result', () => {
    const obj1 = { level1: { level2: { x: 1, y: 2 } } };
    const obj2 = { level1: { level2: { x: 1, y: 3 } } };
    const result = deepCompare(obj1, obj2);
    expect(result).toEqual({ level1: { level2: { y: false } } });
  });

  it('should handle nested objects returning false (incompatible types)', () => {
    // Test where nestedResult is exactly `false` due to type incompatibility
    const obj1 = { nested: { a: 1 } };
    const obj2 = { nested: [] as any };  // Array instead of object
    const result = deepCompare(obj1, obj2);
    // nested comparison returns false (array vs object)
    expect(result).toEqual({ nested: false });
  });

  it('should handle identical nested objects (nestedResult === true)', () => {
    // Test where nestedResult is exactly `true`
    const obj1 = { nested: { x: 1, y: 2 }, other: 'different' };
    const obj2 = { nested: { x: 1, y: 2 }, other: 'value' };
    const result = deepCompare(obj1, obj2);
    // nested is identical (true), but other differs
    expect(result).toEqual({ other: false });
  });
});
