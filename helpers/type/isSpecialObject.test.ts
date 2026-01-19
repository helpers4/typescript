/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, it, expect } from 'vitest';
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
    expect(isSpecialObject(new Array(5))).toBe(false);
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
});
