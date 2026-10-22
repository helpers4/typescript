/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, expectTypeOf, it } from 'vitest';
import { update } from './update';

describe('update', () => {
  it('applies the updater to an existing value', () => {
    const obj = { count: 1 };
    update(obj, 'count', (n) => (n ?? 0) + 1);
    expect(obj.count).toBe(2);
  });

  it('calls the updater with undefined when the path is absent', () => {
    const obj: Record<string, unknown> = {};
    update(obj, 'a.b', (n) => ((n as number | undefined) ?? 0) + 1);
    expect(obj).toEqual({ a: { b: 1 } });
  });

  it('creates intermediate objects as needed, like set()', () => {
    const obj: Record<string, unknown> = {};
    update(obj, 'stats.hits', (n) => ((n as number | undefined) ?? 0) + 1);
    expect(obj).toEqual({ stats: { hits: 1 } });
  });

  it('returns the same object reference', () => {
    const obj = { a: 1 };
    const result = update(obj, 'a', (n) => (n ?? 0) + 1);
    expect(result).toBe(obj);
  });

  it('supports bracket notation on array elements', () => {
    const obj = { items: [1, 2, 3] };
    update(obj, 'items[1]', (n) => (n as number) * 10);
    expect(obj.items).toEqual([1, 20, 3]);
  });

  it('supports a PropertyKey[] path', () => {
    const obj = { a: { b: 1 } };
    update(obj, ['a', 'b'], (n) => (n as number) + 41);
    expect(obj.a.b).toBe(42);
  });

  it('rejects a path containing __proto__ (delegates to the guard in set())', () => {
    const obj = { a: 1 };
    const result = update(obj, '__proto__.polluted', () => 'yes');
    expect(result).toBe(obj);
    expect(result).toEqual({ a: 1 });
  });

  it('is equivalent to set(obj, path, updater(get(obj, path)))', () => {
    const viaUpdate = update({ a: { b: 5 } }, 'a.b', (n) => (n as number) * 2);
    expect(viaUpdate).toEqual({ a: { b: 10 } });
  });
});

describe('update — type inference', () => {
  it('the updater receives the type inferred at the path', () => {
    const obj = { a: { b: 1 } };
    update(obj, 'a.b', (n) => {
      expectTypeOf(n).toEqualTypeOf<number | undefined>();
      return (n ?? 0) + 1;
    });
  });

  it('return type reflects the updated field', () => {
    const obj = { a: { b: 1 } };
    const result = update(obj, 'a.b', (n) => (n ?? 0) + 1);
    expectTypeOf(result).toEqualTypeOf<{ a: { b: number } }>();
  });
});
