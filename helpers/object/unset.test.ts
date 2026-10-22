/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { unset } from './unset';

describe('unset', () => {
  it('removes a top-level key', () => {
    const obj: Record<string, unknown> = { a: 1, b: 2 };
    unset(obj, 'a');
    expect(obj).toEqual({ b: 2 });
    expect(Object.hasOwn(obj, 'a')).toBe(false);
  });

  it('removes a nested key using dot notation', () => {
    const obj = { a: { b: 1, c: 2 } };
    unset(obj, 'a.b');
    expect(obj).toEqual({ a: { c: 2 } });
  });

  it('removes an array element key using bracket notation (leaves a hole)', () => {
    const obj: Record<string, unknown> = { items: ['x', 'y', 'z'] };
    unset(obj, 'items[1]');
    const items = obj['items'] as unknown[];
    expect(1 in items).toBe(false);
    expect(items[0]).toBe('x');
    expect(items[2]).toBe('z');
  });

  it('returns the same object reference', () => {
    const obj = { a: 1 };
    const result = unset(obj, 'a');
    expect(result).toBe(obj);
  });

  it('is a no-op when the path does not exist', () => {
    const obj = { a: 1 };
    const result = unset(obj, 'x.y');
    expect(result).toBe(obj);
    expect(result).toEqual({ a: 1 });
  });

  it('is a no-op when an intermediate segment is not an object', () => {
    const obj = { a: 1 };
    unset(obj, 'a.b.c');
    expect(obj).toEqual({ a: 1 });
  });

  it('is a no-op when the direct parent of the final key resolves to null', () => {
    // Exercises the case where the loop's last reassignment lands on a
    // non-object value that the loop itself never re-validates.
    const obj = { a: { b: null } };
    unset(obj, 'a.b.c');
    expect(obj).toEqual({ a: { b: null } });
  });

  it('is a no-op for an empty path', () => {
    const obj = { a: 1 };
    const result = unset(obj, '');
    expect(result).toBe(obj);
  });

  it('is a no-op for an empty PropertyKey[] path', () => {
    const obj = { a: 1 };
    const result = unset(obj, []);
    expect(result).toBe(obj);
    expect(result).toEqual({ a: 1 });
  });

  it('accepts an explicit PropertyKey[] path', () => {
    const obj = { a: { b: { c: 1 } } };
    unset(obj, ['a', 'b', 'c']);
    expect(obj).toEqual({ a: { b: {} } });
  });

  it('accepts symbol keys via PropertyKey[] path', () => {
    const sym = Symbol('id');
    const obj: Record<PropertyKey, unknown> = { [sym]: 'value', other: 1 };
    unset(obj, [sym]);
    expect(Object.hasOwn(obj, sym)).toBe(false);
    expect(obj['other']).toBe(1);
  });

  it('actually deletes the key rather than setting it to undefined', () => {
    const obj: Record<string, unknown> = { a: 1 };
    unset(obj, 'a');
    expect(Object.keys(obj)).toEqual([]);
  });

  // --- Prototype pollution protection ---

  it('rejects a path containing __proto__', () => {
    const obj = { a: 1 };
    const result = unset(obj, '__proto__.polluted');
    expect(result).toBe(obj);
    expect(result).toEqual({ a: 1 });
  });

  it('rejects a path containing constructor', () => {
    const obj = { a: { b: 1 } };
    unset(obj, 'a.constructor');
    expect(obj.a.constructor).toBe(Object);
  });

  it('rejects a path containing prototype', () => {
    const obj = { a: 1 };
    const result = unset(obj, 'prototype');
    expect(result).toEqual({ a: 1 });
  });
});
