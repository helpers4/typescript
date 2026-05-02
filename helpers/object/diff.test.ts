/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { DiffResult, diff } from './diff';

describe('diff', () => {
  it('should return true for identical objects', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 2 };
    expect(diff(obj1, obj2)).toBe(true);
  });

  it('should return true for same reference', () => {
    const obj = { a: 1, b: 2 };
    expect(diff(obj, obj)).toBe(true);
  });

  it('should return differences for different values', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 3 };
    const result = diff(obj1, obj2) as DiffResult;
    expect(result).toEqual({ b: false });
  });

  it('should detect properties only in first object', () => {
    const obj1 = { a: 1, b: 2, c: 3 };
    const obj2 = { a: 1, b: 2 };
    const result = diff(obj1, obj2) as DiffResult;
    expect(result).toEqual({ c: "onlyA" });
  });

  it('should detect properties only in second object', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 2, c: 3 };
    const result = diff(obj1, obj2) as DiffResult;
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
    const result = diff(obj1, obj2) as DiffResult;
    expect(result).toEqual({
      nested: { y: false }
    });
  });

  it('should handle arrays by returning false for differences', () => {
    const obj1 = { arr: [1, 2, 3] };
    const obj2 = { arr: [1, 2, 4] };
    const result = diff(obj1, obj2) as DiffResult;
    expect(result).toEqual({ arr: false });
  });

  it('should return true for identical arrays', () => {
    const obj1 = { arr: [1, 2, 3] };
    const obj2 = { arr: [1, 2, 3] };
    expect(diff(obj1, obj2)).toBe(true);
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

    const result = diff(obj1, obj2) as DiffResult;
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
    expect(diff(null, null)).toBe(true);
    expect(diff(undefined, undefined)).toBe(true);
    expect(diff(null, undefined)).toBe(false);
    expect(diff({ a: null }, { a: undefined })).toEqual({ a: false });
  });

  it('should handle different object types', () => {
    expect(diff({}, [])).toBe(false);
    expect(diff(null, {})).toBe(false);
  });

  it('should handle undefined and null parameters', () => {
    expect(diff(undefined, null)).toBe(false);
    expect(diff(undefined, {})).toBe(false);
    expect(diff(null, { a: 1 })).toBe(false);
  });

  it('should handle arrays using equalsShallow', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];
    const arr3 = [1, 2, 4];

    expect(diff(arr1, arr2)).toBe(true);
    expect(diff(arr1, arr3)).toBe(false);
  });

  it('should handle arrays in object properties using equalsShallow', () => {
    const obj1 = { arr: [1, 2, { nested: 'value' }] };
    const obj2 = { arr: [1, 2, { nested: 'value' }] };
    const obj3 = { arr: [1, 2, { nested: 'different' }] };

    expect(diff(obj1, obj2)).toBe(true);
    expect(diff(obj1, obj3)).toEqual({ arr: false });
  });

  it('should handle special objects by reference only', () => {
    const func1 = () => { };
    const func2 = () => { };
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2023-01-01');
    const promise1 = Promise.resolve(1);
    const promise2 = Promise.resolve(1);

    // Same reference should be true
    expect(diff(func1, func1)).toBe(true);
    expect(diff(promise1, promise1)).toBe(true);

    // Different references should be false (except dates which use compareDate)
    expect(diff(func1, func2)).toBe(false);
    expect(diff(promise1, promise2)).toBe(false);
    expect(diff(date1, date2)).toBe(true); // dates use compareDate
  });

  it('should handle special objects in properties', () => {
    const func1 = () => { };
    const func2 = () => { };
    const regex1 = /test/;
    const regex2 = /test/;

    const obj1 = { fn: func1, regex: regex1 };
    const obj2 = { fn: func1, regex: regex1 }; // Same references
    const obj3 = { fn: func2, regex: regex2 }; // Different references

    expect(diff(obj1, obj2)).toBe(true);
    expect(diff(obj1, obj3)).toEqual({ fn: false, regex: false });
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

    const result = diff(obj1, obj2) as any;
    expect(result.special).toBe(false); // Maps compared by reference
    expect(result.normal.nested.deep).toBe(false); // Normal objects compared deeply
  });

  it('should handle unequal primitives in object properties', () => {
    const obj1 = { num: 42, str: 'hello', bool: true };
    const obj2 = { num: 43, str: 'world', bool: false };
    const result = diff(obj1, obj2) as DiffResult;
    expect(result).toEqual({ num: false, str: false, bool: false });
  });

  it('should handle comparing objects with various special types', () => {
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2023-01-01');
    const date3 = new Date('2023-01-02');

    expect(diff(date1, date2)).toBe(true);
    expect(diff(date1, date3)).toBe(false);
  });

  it('should handle dates in object properties correctly', () => {
    const obj1 = { created: new Date('2023-01-01'), name: 'test' };
    const obj2 = { created: new Date('2023-01-01'), name: 'test' };
    const obj3 = { created: new Date('2023-01-02'), name: 'test' };

    expect(diff(obj1, obj2)).toBe(true);
    expect(diff(obj1, obj3)).toEqual({ created: false });
  });

  it('should handle functions in object properties', () => {
    const func1 = () => { };
    const func2 = () => { };

    const obj1 = { fn: func1 };
    const obj2 = { fn: func1 };
    const obj3 = { fn: func2 };

    expect(diff(obj1, obj2)).toBe(true);
    expect(diff(obj1, obj3)).toEqual({ fn: false });
  });

  it('should handle mixed types in properties', () => {
    const obj1 = { a: null, b: undefined, c: 42 };
    const obj2 = { a: undefined, b: null, c: '42' };
    const result = diff(obj1, obj2) as DiffResult;
    expect(result).toEqual({ a: false, b: false, c: false });
  });

  it('should handle null/undefined in object property values', () => {
    const obj1 = { value: null };
    const obj2 = { value: undefined };
    const obj3 = { value: true };

    expect(diff(obj1, obj2)).toEqual({ value: false });
    expect(diff(obj1, obj3)).toEqual({ value: false });
    expect(diff(obj2, obj3)).toEqual({ value: false });
  });

  it('should handle nested objects with only-in-A properties', () => {
    const obj1 = { nested: { a: 1, b: 2 } };
    const obj2 = { nested: { a: 1 } };
    const result = diff(obj1, obj2);
    expect(result).toEqual({ nested: { b: 'onlyA' } });
  });

  it('should handle deeply nested differences with object result', () => {
    const obj1 = { level1: { level2: { x: 1, y: 2 } } };
    const obj2 = { level1: { level2: { x: 1, y: 3 } } };
    const result = diff(obj1, obj2);
    expect(result).toEqual({ level1: { level2: { y: false } } });
  });

  // --- Mutation-killing tests for LogicalOperator && -> || ---

  // L37: objA instanceof Date && objB instanceof Date -> ||
  // If mutated to ||, then Date + non-Date would enter the Date comparison branch incorrectly
  it('should not treat Date + non-Date as two Dates at root', () => {
    const date = new Date('2023-01-01');
    const obj = { a: 1 };
    // With ||, this would try compareDate(date, obj) which is wrong
    expect(diff(date, obj)).toBe(false);
    expect(diff(obj, date)).toBe(false);
  });

  // L42: Array.isArray(objA) && Array.isArray(objB) -> ||
  // If mutated to ||, then Array + non-Array would enter equalsShallow branch
  it('should not treat Array + non-Array as two Arrays at root', () => {
    const arr = [1, 2, 3];
    const obj = { length: 3, '0': 1 };
    expect(diff(arr, obj)).toBe(false);
    expect(diff(obj, arr)).toBe(false);
  });

  // L53: isSpecialObject(objA) || isSpecialObject(objB) -> false
  // Need a test where one root arg is special and other is plain
  it('should return false when one root is special object and other is not', () => {
    const regex = /test/;
    const plain = { a: 1 };
    expect(diff(regex, plain)).toBe(false);
    expect(diff(plain, regex)).toBe(false);
  });

  // L75: Array.isArray(valueA) && Array.isArray(valueB) -> ||
  // If mutated to ||, then property with Array + non-Array would enter equalsShallow branch
  it('should handle property where one value is array and other is not', () => {
    // This kills the || mutation: with ||, one array triggers array comparison
    expect(diff({ x: [1, 2] }, { x: 'not-array' })).toEqual({ x: false });
    expect(diff({ x: 'not-array' }, { x: [1, 2] })).toEqual({ x: false });
  });

  // L81: valueA instanceof Date && valueB instanceof Date -> ||
  // If mutated to ||, Date + non-Date property would enter compareDate
  it('should handle property where one value is Date and other is not', () => {
    expect(diff({ d: new Date() }, { d: 42 })).toEqual({ d: false });
    expect(diff({ d: 42 }, { d: new Date() })).toEqual({ d: false });
  });

  // L87: isSpecialObject(valueA) || isSpecialObject(valueB) -> &&
  // If mutated to &&, only both-special triggers special comparison; one-special falls through
  it('should compare by reference when only one value is special object', () => {
    const fn = () => {};
    // With && mutation, fn + plain would NOT enter special branch, might deeply compare
    expect(diff({ a: fn }, { a: { x: 1 } })).toEqual({ a: false });
    expect(diff({ a: { x: 1 } }, { a: fn })).toEqual({ a: false });
  });

  // L87: isSpecialObject(valueA) || isSpecialObject(valueB) -> false
  // Need case where both are special and different -> should be false
  it('should return false for different special objects in properties', () => {
    const fn1 = () => {};
    const fn2 = () => {};
    expect(diff({ a: fn1 }, { a: fn2 })).toEqual({ a: false });
  });

  // L94: Complex condition with &&/|| mutations and ConditionalExpression -> true
  // The condition checks: both non-null, non-undefined, objects, non-special
  // If mutated to true, non-object primitives would try to recurse
  it('should handle property with null vs object (kills L94 || mutations)', () => {
    // When valueA is null and valueB is object, should NOT enter recursion
    expect(diff({ a: null }, { a: { x: 1 } })).toEqual({ a: false });
    expect(diff({ a: { x: 1 } }, { a: null })).toEqual({ a: false });
  });

  it('should handle property with undefined vs object (kills L94 mutations)', () => {
    expect(diff({ a: undefined }, { a: { x: 1 } })).toEqual({ a: false });
    expect(diff({ a: { x: 1 } }, { a: undefined })).toEqual({ a: false });
  });

  // L94: valueA !== null && valueB !== null -> valueA !== null || valueB !== null
  // If ||, then one-null pair would pass the null check and enter recursion
  it('should not recurse when one value is null and other is object', () => {
    const result1 = diff({ key: null }, { key: { nested: true } });
    expect(result1).toEqual({ key: false });
    const result2 = diff({ key: { nested: true } }, { key: null });
    expect(result2).toEqual({ key: false });
  });

  // L95: typeof valueA === 'object' && typeof valueB === 'object' -> true
  // If mutated, primitives would be treated as objects for recursion
  it('should not recurse when values are primitives (kills L95 true)', () => {
    // string vs string: primitive, should use === comparison
    expect(diff({ a: 'hello' }, { a: 'world' })).toEqual({ a: false });
    expect(diff({ a: 'same' }, { a: 'same' })).toBe(true);
    // number vs number: primitive
    expect(diff({ a: 1 }, { a: 2 })).toEqual({ a: false });
    expect(diff({ a: 1 }, { a: 1 })).toBe(true);
  });

  // L101: return false -> true (BooleanLiteral) and ConditionalExpression -> false
  // Object.keys(differences).length > 0 ? differences : true
  // If false returned instead of true when no differences, identical objects would return false
  it('should return true (not false) when objects have identical properties', () => {
    const result = diff({ a: 1, b: 'str', c: true }, { a: 1, b: 'str', c: true });
    expect(result).toBe(true);
    expect(result).not.toBe(false);
  });

  // L101: ConditionalExpression -> false: length > 0 ? differences : true -> false
  // When there ARE differences, should return the differences object, not false
  it('should return differences object (not false) when objects differ', () => {
    const result = diff({ a: 1 }, { a: 2 });
    expect(result).toEqual({ a: false });
    expect(result).not.toBe(false); // It should be an object, not the boolean false
    expect(typeof result).toBe('object');
  });

  it('should return false when objA is valid object and objB is null', () => {
    expect(diff({ a: 1 }, null)).toBe(false);
  });

  it('should return false when objA is valid object and objB is undefined', () => {
    expect(diff({ a: 1 }, undefined)).toBe(false);
  });

  it('should return false when comparing Date with plain object at root', () => {
    expect(diff(new Date('2023-01-01'), { a: 1 })).toBe(false);
  });

  it('should return false when comparing plain object with Date at root', () => {
    expect(diff({ a: 1 }, new Date('2023-01-01'))).toBe(false);
  });

  it('should return false when comparing array with plain object at root', () => {
    expect(diff([1, 2], { a: 1 })).toBe(false);
  });

  it('should return false when comparing plain object with array at root', () => {
    expect(diff({ a: 1 }, [1, 2])).toBe(false);
  });

  it('should return false when one root arg is special object and other is plain', () => {
    expect(diff(/test/, { a: 1 })).toBe(false);
    expect(diff({ a: 1 }, new Map())).toBe(false);
  });

  it('should handle nested object vs null value', () => {
    expect(diff({ a: { x: 1 } }, { a: null })).toEqual({ a: false });
  });

  it('should handle nested null vs object value', () => {
    expect(diff({ a: null }, { a: { x: 1 } })).toEqual({ a: false });
  });

  it('should handle nested object vs undefined value', () => {
    expect(diff({ a: { x: 1 } }, { a: undefined })).toEqual({ a: false });
  });

  it('should handle nested undefined vs object value', () => {
    expect(diff({ a: undefined }, { a: { x: 1 } })).toEqual({ a: false });
  });

  it('should handle nested special object vs plain object value', () => {
    expect(diff({ a: /regex/ }, { a: { x: 1 } })).toEqual({ a: false });
  });

  it('should handle nested plain object vs special object value', () => {
    expect(diff({ a: { x: 1 } }, { a: /regex/ })).toEqual({ a: false });
  });

  it('should handle nested Date vs non-Date value', () => {
    expect(diff({ d: new Date('2023-01-01') }, { d: 'not-a-date' })).toEqual({ d: false });
  });

  it('should handle nested non-Date vs Date value', () => {
    expect(diff({ d: 'not-a-date' }, { d: new Date('2023-01-01') })).toEqual({ d: false });
  });

  it('should handle nested array vs non-array value', () => {
    expect(diff({ arr: [1, 2] }, { arr: 'string' })).toEqual({ arr: false });
  });

  it('should handle nested non-array vs array value', () => {
    expect(diff({ arr: 'string' }, { arr: [1, 2] })).toEqual({ arr: false });
  });

  it('should handle primitive number vs object in property values', () => {
    expect(diff({ a: 42 }, { a: { x: 1 } })).toEqual({ a: false });
  });

  it('should handle object vs primitive number in property values', () => {
    expect(diff({ a: { x: 1 } }, { a: 42 })).toEqual({ a: false });
  });

  it('should handle nested objects returning false (incompatible types)', () => {
    // Test where nestedResult is exactly `false` due to type incompatibility
    const obj1 = { nested: { a: 1 } };
    const obj2 = { nested: [] as any };  // Array instead of object
    const result = diff(obj1, obj2);
    // nested comparison returns false (array vs object)
    expect(result).toEqual({ nested: false });
  });

  it('should handle identical nested objects (nestedResult === true)', () => {
    // Test where nestedResult is exactly `true`
    const obj1 = { nested: { x: 1, y: 2 }, other: 'different' };
    const obj2 = { nested: { x: 1, y: 2 }, other: 'value' };
    const result = diff(obj1, obj2);
    // nested is identical (true), but other differs
    expect(result).toEqual({ other: false });
  });

  describe('security edge cases', () => {
    it('should handle objects with __proto__ key from JSON.parse', () => {
      const obj1 = JSON.parse('{"__proto__":{"polluted":"yes"},"a":1}');
      const obj2 = JSON.parse('{"__proto__":{"polluted":"yes"},"a":1}');
      const result = diff(obj1, obj2);
      // Should not throw or pollute prototype
      expect(({} as Record<string, unknown>).polluted).toBeUndefined();
      expect(result).toBeDefined();
    });

    it('should handle objects with constructor key', () => {
      const obj1 = { constructor: { prototype: { admin: true } }, data: 1 };
      const obj2 = { constructor: { prototype: { admin: true } }, data: 1 };
      const result = diff(obj1, obj2);
      expect(result).toBeDefined();
    });

    it('should handle comparison between __proto__ polluted and clean objects', () => {
      const polluted = JSON.parse('{"__proto__":{"x":1},"a":1}');
      const clean = { a: 1 };
      const result = diff(polluted, clean);
      expect(({} as Record<string, unknown>).x).toBeUndefined();
      expect(result).toBeDefined();
    });

    it('should handle objects with very deep nesting without stack overflow', () => {
      let deep1: Record<string, unknown> = { value: 'end' };
      let deep2: Record<string, unknown> = { value: 'end' };
      for (let i = 0; i < 100; i++) {
        deep1 = { nested: deep1 };
        deep2 = { nested: deep2 };
      }
      expect(diff(deep1, deep2)).toBe(true);
    });
  });

  describe('depth option', () => {
    it('depth: 0 \u2014 nested plain objects with same shape return false (no recursion)', () => {
      const a = { nested: { b: 1 } };
      const b = { nested: { b: 1 } };
      // Different references for `nested`, depth=0 forbids recursion
      expect(diff(a, b, { depth: 0 })).toEqual({ nested: false });
    });

    it('depth: 0 \u2014 same reference for nested still equal', () => {
      const inner = { b: 1 };
      expect(diff({ nested: inner }, { nested: inner }, { depth: 0 })).toBe(true);
    });

    it('depth: Infinity (default) recurses fully', () => {
      const a = { nested: { b: { c: 1 } } };
      const b = { nested: { b: { c: 1 } } };
      expect(diff(a, b)).toBe(true);
    });

    it('depth: 1 recurses one level only', () => {
      const a = { nested: { b: { c: 1 } } };
      const b = { nested: { b: { c: 2 } } };
      // depth=1 \u2192 nested is recursed, but `b` (one more level) is leaf-compared by ref
      expect(diff(a, b, { depth: 1 })).toEqual({ nested: { b: false } });
    });
  });
});
