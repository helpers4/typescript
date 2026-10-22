/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isSpecialObject } from './isSpecialObject';

describe('isSpecialObject', () => {
  it('should return false for primitives', () => {
    expect(isSpecialObject(null)).toBe(false);
    expect(isSpecialObject(undefined)).toBe(false);
    expect(isSpecialObject(42)).toBe(false);
    expect(isSpecialObject('string')).toBe(false);
    expect(isSpecialObject(true)).toBe(false);
    expect(isSpecialObject(Symbol('test'))).toBe(false);
  });

  it('should return false for plain objects', () => {
    expect(isSpecialObject({})).toBe(false);
    expect(isSpecialObject({ a: 1, b: 2 })).toBe(false);
    expect(isSpecialObject(Object.create(null))).toBe(false);
  });

  it('should return false for arrays', () => {
    expect(isSpecialObject([])).toBe(false);
    expect(isSpecialObject([1, 2, 3])).toBe(false);
    expect(isSpecialObject(Array.from({ length: 5 }))).toBe(false);
  });

  it('should return true for Date objects', () => {
    expect(isSpecialObject(new Date())).toBe(true);
    expect(isSpecialObject(new Date('2023-01-01'))).toBe(true);
  });

  it('should return true for Functions', () => {
    expect(isSpecialObject(() => { })).toBe(true);
    expect(isSpecialObject(function () { })).toBe(true);
    expect(isSpecialObject(async () => { })).toBe(true);
    expect(isSpecialObject(function* generator() { })).toBe(true);
  });

  it('should return true for Promises', () => {
    expect(isSpecialObject(Promise.resolve())).toBe(true);
    expect(isSpecialObject(new Promise(() => { }))).toBe(true);
  });

  it('should return true for RegExp objects', () => {
    expect(isSpecialObject(/test/)).toBe(true);
    expect(isSpecialObject(new RegExp('test'))).toBe(true);
  });

  it('should return true for Error objects', () => {
    expect(isSpecialObject(new Error())).toBe(true);
    expect(isSpecialObject(new TypeError())).toBe(true);
    expect(isSpecialObject(new RangeError())).toBe(true);
  });

  it('should return true for Map and Set objects', () => {
    expect(isSpecialObject(new Map())).toBe(true);
    expect(isSpecialObject(new Set())).toBe(true);
    expect(isSpecialObject(new WeakMap())).toBe(true);
    expect(isSpecialObject(new WeakSet())).toBe(true);
  });

  it('should return true for ArrayBuffer and DataView', () => {
    expect(isSpecialObject(new ArrayBuffer(8))).toBe(true);
    expect(isSpecialObject(new DataView(new ArrayBuffer(8)))).toBe(true);
  });

  it('should return true for URL objects', () => {
    expect(isSpecialObject(new URL('https://example.com'))).toBe(true);
    expect(isSpecialObject(new URLSearchParams('?a=1&b=2'))).toBe(true);
  });

  it('should return true for Observable-like objects', () => {
    // Mock Observable
    const mockObservable = {
      constructor: { name: 'Observable' },
      subscribe: () => { }
    };
    expect(isSpecialObject(mockObservable)).toBe(true);
  });

  it('should handle objects without constructor gracefully', () => {
    const objWithoutConstructor = Object.create(null);
    objWithoutConstructor.someProperty = 'value';
    expect(isSpecialObject(objWithoutConstructor)).toBe(false);
  });

  it('should return true for HTMLElement in browser', () => {
    const element = document.createElement('div');
    expect(isSpecialObject(element)).toBe(true);
  });

  it('should return false for undefined passed directly', () => {
    expect(isSpecialObject(undefined)).toBe(false);
  });

  it('should return false for arrays (not special)', () => {
    expect(isSpecialObject([1, 2])).toBe(false);
  });

  it('should return true for built-in types by constructor name', () => {
    // Test Buffer
    const buffer = Buffer.from('test');
    expect(isSpecialObject(buffer)).toBe(true);
  });

  it('should return true for objects with matching Web API constructor names', () => {
    const webApiNames = ['File', 'Blob', 'FormData', 'Headers', 'Request', 'Response', 'EventTarget', 'Symbol'];
    for (const name of webApiNames) {
      const mock = Object.create({ constructor: { name } });
      mock.constructor = { name };
      expect(isSpecialObject(mock)).toBe(true);
    }
  });

  it('should return false for objects with non-matching constructor names', () => {
    const customObj = { constructor: { name: 'CustomClass' } };
    expect(isSpecialObject(customObj)).toBe(false);
  });

  // --- Mutation-killing tests ---

  // L15: typeof value === 'function' -> false
  // If mutated, functions would not be detected as special
  it('should identify functions as special objects (not false)', () => {
    const fn = () => {};
    expect(isSpecialObject(fn)).toBe(true);
    expect(isSpecialObject(function named() {})).toBe(true);
    // Verify it's truly the function check, not some other path
    expect(typeof fn).toBe('function');
  });

  // L30: typeof value !== 'object' -> false / BlockStatement {}
  // If mutated, non-objects (numbers, strings, booleans, symbols, bigints) would pass through
  // and could be wrongly detected as special objects
  it('should return false for non-object non-function primitives', () => {
    expect(isSpecialObject(42)).toBe(false);
    expect(isSpecialObject('string')).toBe(false);
    expect(isSpecialObject(true)).toBe(false);
    expect(isSpecialObject(Symbol('s'))).toBe(false);
    expect(isSpecialObject(BigInt(123))).toBe(false);
  });

  // L56: value.constructor?.name === 'Observable' -> true
  // If true, any object with a constructor would be treated as special
  it('should NOT treat plain objects with constructor as Observable', () => {
    const plainObj = { a: 1, b: 2 };
    expect(isSpecialObject(plainObj)).toBe(false);
    // Plain object has constructor.name === 'Object'
    expect(plainObj.constructor?.name).toBe('Object');
  });

  // L56: StringLiteral 'Observable' -> ''
  // If '' is used, constructor.name === '' would match objects with empty constructor name
  it('should only match Observable constructor name, not empty string', () => {
    const obj = { constructor: { name: '' } };
    expect(isSpecialObject(obj)).toBe(false);
  });

  it('should correctly identify Observable mock', () => {
    const mockObs = { constructor: { name: 'Observable' } };
    expect(isSpecialObject(mockObs)).toBe(true);
    // Non-Observable should not match
    const notObs = { constructor: { name: 'NotObservable' } };
    expect(isSpecialObject(notObs)).toBe(false);
  });
});
