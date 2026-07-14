/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { clone } from './clone';

describe('clone', () => {
  it('returns primitives as-is', () => {
    expect(clone(42)).toBe(42);
    expect(clone('hello')).toBe('hello');
    expect(clone(true)).toBe(true);
    expect(clone(null)).toBeNull();
    expect(clone(undefined)).toBeUndefined();
  });

  it('shallow-copies a plain object', () => {
    const nested = { b: 1 };
    const obj = { a: nested };
    const result = clone(obj);
    expect(result).toEqual(obj);
    expect(result).not.toBe(obj);
    expect(result.a).toBe(nested); // shallow — same nested reference
  });

  it('clones a Date to a new instance with the same timestamp', () => {
    const date = new Date('2024-01-01T00:00:00.000Z');
    const result = clone(date);
    expect(result).not.toBe(date);
    expect(result.getTime()).toBe(date.getTime());
  });

  it('clones a Map to a new instance with the same entries', () => {
    const map = new Map([['a', 1], ['b', 2]]);
    const result = clone(map);
    expect(result).not.toBe(map);
    expect([...result.entries()]).toEqual([['a', 1], ['b', 2]]);
  });

  it('clones a Set to a new instance with the same members', () => {
    const set = new Set([1, 2, 3]);
    const result = clone(set);
    expect(result).not.toBe(set);
    expect([...result]).toEqual([1, 2, 3]);
  });

  it('clones an array to a new array with the same elements', () => {
    const arr = [1, 2, 3];
    const result = clone(arr);
    expect(result).not.toBe(arr);
    expect(result).toEqual(arr);
  });

  it('does not deeply clone nested arrays/objects (shallow only)', () => {
    const inner = [1, 2];
    const arr = [inner];
    const result = clone(arr);
    expect(result[0]).toBe(inner);
  });

  it('shallow-copies unrecognized object types by their own enumerable keys', () => {
    class Point {
      constructor(public x: number, public y: number) {}
    }
    const point = new Point(1, 2);
    const result = clone(point);
    expect(result).toEqual({ x: 1, y: 2 });
    expect(result).not.toBe(point);
  });

  it('skips prototype-polluting keys when copying unrecognized objects', () => {
    const malicious = JSON.parse('{"a":1,"__proto__":{"polluted":"yes"}}');
    const result = clone(malicious as Record<string, unknown>);
    expect(result).toEqual({ a: 1 });
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
  });
});
