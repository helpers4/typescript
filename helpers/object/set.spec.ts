/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { set } from './set';
import { get } from './get';

describe('set — property-based', () => {
  it('get(set(obj, path, value), path) === value for single-level paths', () => {
    // Exclude '.' and bracket chars — they create multi-level paths, tested separately
    const safeKey = fc.string({ minLength: 1, maxLength: 10 }).filter(
      (s) => !s.includes('.') && !s.includes('[') && !s.includes(']') && s !== '__proto__' && s !== 'constructor' && s !== 'prototype'
    );
    fc.assert(
      fc.property(
        safeKey,
        fc.integer(),
        (key, value) => {
          const obj: Record<string, unknown> = {};
          set(obj, key, value);
          expect(get(obj, key)).toBe(value);
        }
      )
    );
  });

  it('set mutates and returns the same object reference', () => {
    // Exclude '.' and bracket chars — they create multi-level paths, tested separately
    const safeKey = fc.string({ minLength: 1, maxLength: 10 }).filter(
      (s) => !s.includes('.') && !s.includes('[') && !s.includes(']') && s !== '__proto__' && s !== 'constructor' && s !== 'prototype'
    );
    fc.assert(
      fc.property(
        safeKey,
        fc.integer(),
        (key, value) => {
          const obj: Record<string, unknown> = {};
          const result = set(obj, key, value);
          expect(result).toBe(obj);
        }
      )
    );
  });
});

describe('set — contract', () => {
  it('"a.b.c" creates nested structure', () => {
    const obj: Record<string, unknown> = {};
    set(obj, 'a.b.c', 42);
    expect((obj as { a: { b: { c: number } } }).a.b.c).toBe(42);
  });

  it('overwriting existing value', () => {
    const obj = { x: 1 };
    set(obj, 'x', 99);
    expect(obj.x).toBe(99);
  });

  it('overwriting nested existing value', () => {
    const obj = { a: { b: 1 } };
    set(obj, 'a.b', 42);
    expect(obj.a.b).toBe(42);
  });

  it('empty path "": sets key "" on root object', () => {
    // path.split('.') with '' gives [''], so sets obj[''] = value
    const obj: Record<string, unknown> = {};
    set(obj, '', 'hello');
    expect(obj['']).toBe('hello');
  });

  it('null intermediate: overwrites null with new object', () => {
    // set checks: if current[key] is null, it creates a new object
    const obj: Record<string, unknown> = { a: null };
    set(obj, 'a.b', 42);
    expect((obj.a as Record<string, unknown>).b).toBe(42);
  });

  it('creates all intermediate objects as needed', () => {
    const obj: Record<string, unknown> = {};
    set(obj, 'x.y.z.w', true);
    expect(get(obj, 'x.y.z.w')).toBe(true);
  });

  it('ignores unsafe keys (__proto__, constructor, prototype)', () => {
    const obj: Record<string, unknown> = {};
    set(obj, '__proto__.polluted', 'yes');
    set(obj, 'constructor.polluted', 'yes');
    set(obj, 'prototype.polluted', 'yes');
    expect(({} as Record<string, unknown>)['polluted']).toBeUndefined();
    expect(obj.constructor).toBe(Object);
  });
});
