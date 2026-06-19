/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { get } from './get';

describe('get — property-based', () => {
  it('get(obj, key) === obj[key] for single-key paths', () => {
    fc.assert(
      fc.property(
        fc.record({ a: fc.integer(), b: fc.string() }),
        fc.constantFrom('a', 'b'),
        (obj, key) => {
          expect(get(obj, key)).toBe(obj[key as keyof typeof obj]);
        }
      )
    );
  });

  it('returns value when path exists', () => {
    // Exclude '.', '[', ']' — dot and bracket notation create multi-level paths
    const safeKey = fc
      .string({ minLength: 1, maxLength: 10 })
      .filter((s) => !s.includes('.') && !s.includes('[') && !s.includes(']') && s !== '__proto__' && s !== 'constructor' && s !== 'prototype');
    fc.assert(
      fc.property(safeKey, fc.integer(), (key, value) => {
        const obj = Object.create(null) as Record<string, unknown>;
        obj[key] = value;
        expect(get(obj, key)).toBe(value);
      })
    );
  });
});

describe('get — contract', () => {
  it('nested path "a.b.c" → correct value', () => {
    const obj = { a: { b: { c: 42 } } };
    expect(get(obj, 'a.b.c')).toBe(42);
  });

  it('missing path → defaultValue', () => {
    expect(get({ a: 1 }, 'b.c', 'fallback')).toBe('fallback');
  });

  it('missing path with no default → undefined', () => {
    expect(get({ a: 1 }, 'x.y.z')).toBeUndefined();
  });

  it('null object → returns defaultValue', () => {
    expect(get(null, 'a', 'default')).toBe('default');
  });

  it('undefined object → returns defaultValue', () => {
    expect(get(undefined, 'a', 'default')).toBe('default');
  });

  it('empty path "" → returns object itself (split gives [""])', () => {
    const obj = { a: 1 };
    // path.split('.') with '' gives [''], obj[''] is undefined → returns defaultValue
    expect(get(obj, '')).toBeUndefined();
  });

  it('path terminates at null intermediate → returns defaultValue', () => {
    const obj = { a: null };
    expect(get(obj, 'a.b', 'default')).toBe('default');
  });

  it('existing value of 0 is returned (not replaced by default)', () => {
    expect(get({ a: 0 }, 'a', 99)).toBe(0);
  });

  it('existing value of empty string is returned', () => {
    expect(get({ a: '' }, 'a', 'default')).toBe('');
  });
});
