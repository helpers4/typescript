/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, expectTypeOf, it } from 'vitest';
import { mergeDeep } from './mergeDeep';

describe('mergeDeep', () => {
  it('should merge objects deeply', () => {
    const result = mergeDeep({ a: 1, b: { c: 2, d: 3 } }, { b: { c: 4, e: 5 }, f: 6 });
    expect(result).toEqual({ a: 1, b: { c: 4, d: 3, e: 5 }, f: 6 });
  });

  it('should handle multiple sources', () => {
    expect(mergeDeep({ a: 1 }, { b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('should not mutate any source', () => {
    const s1 = { a: 1, b: { c: 2 } };
    const s2 = { b: { d: 3 } };
    const result = mergeDeep(s1, s2);

    expect(s1.b).not.toHaveProperty('d');
    expect(s2.b).not.toHaveProperty('c');
    expect(result.b).toHaveProperty('d', 3);
    expect(result.b).toHaveProperty('c', 2);
  });

  it('single source returns new equal object', () => {
    const base = { a: 1 };
    const result = mergeDeep(base);
    expect(result).toEqual({ a: 1 });
    expect(result).not.toBe(base);
  });

  it('non-conflicting nested objects are not shared with the source', () => {
    const s1 = { a: { x: 1 } };
    const result = mergeDeep(s1, { b: 2 });
    expect(result.a).not.toBe(s1.a);
    (result.a as { x: number }).x = 99;
    expect(s1.a.x).toBe(1);
  });

  it('non-conflicting arrays are cloned, not shared', () => {
    const s1 = { arr: [1, 2, 3] };
    const result = mergeDeep(s1, { b: 2 });
    expect(result.arr).not.toBe(s1.arr);
    (result.arr as number[]).push(4);
    expect(s1.arr).toHaveLength(3);
  });

  it('non-conflicting nested plain objects preserve undefined-valued keys', () => {
    const result = mergeDeep({}, { cfg: { debug: undefined, level: 1 } });
    expect('debug' in (result as any).cfg).toBe(true);
    expect((result as any).cfg.level).toBe(1);
  });

  it('should handle undefined values in source', () => {
    const result = mergeDeep({ a: 1 }, { b: undefined });
    expect(result).toEqual({ a: 1 });
    expect('b' in result).toBe(false);
  });

  it('should handle null values in source', () => {
    expect(mergeDeep({ a: 1 }, { b: null })).toEqual({ a: 1, b: null });
  });

  it('should handle arrays as values (not merge them)', () => {
    expect(mergeDeep({ arr: [1, 2] }, { arr: [3, 4] })).toEqual({ arr: [3, 4] });
  });

  it('should deeply merge multiple nested objects', () => {
    expect(mergeDeep({ a: { b: { c: 1 } } }, { a: { b: { d: 2 } } }, { a: { e: 3 } }))
      .toEqual({ a: { b: { c: 1, d: 2 }, e: 3 } });
  });

  it('should handle multiple sources including empty objects', () => {
    expect(mergeDeep({ a: 1 }, { b: 2 }, {}, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('should deeply merge nested objects (not just overwrite)', () => {
    expect(mergeDeep({ a: { x: 1, y: 2 } }, { a: { z: 3 } }).a).toEqual({ x: 1, y: 2, z: 3 });
  });

  it('should overwrite when left value is not plain object', () => {
    expect(mergeDeep({ a: 'string' }, { a: { nested: true } }).a).toEqual({ nested: true });
  });

  it('should overwrite when right value is not plain object', () => {
    expect(mergeDeep({ a: { nested: true } }, { a: 'string' }).a).toBe('string');
  });

  it('should not allow __proto__ pollution', () => {
    const malicious = JSON.parse('{"__proto__":{"polluted":"yes"}}');
    mergeDeep({}, malicious);
    expect(({} as Record<string, unknown>)['polluted']).toBeUndefined();
  });

  it('should not allow constructor pollution', () => {
    const result = mergeDeep({}, { constructor: { polluted: 'yes' } });
    expect(result.constructor).toBe(Object);
  });

  it('should not allow prototype pollution', () => {
    const result = mergeDeep({}, { prototype: { polluted: 'yes' } });
    expect((result as Record<string, unknown>)['prototype']).toBeUndefined();
  });

  it('should skip inherited properties from source', () => {
    const proto = { inherited: 'value' };
    const source = Object.create(proto) as Record<string, unknown>;
    source['own'] = 'yes';
    const result = mergeDeep({} as Record<string, unknown>, source);
    expect(result['own']).toBe('yes');
    expect(result['inherited']).toBeUndefined();
  });
});

describe('mergeDeep — symbol keys', () => {
  it('should merge symbol keys from source', () => {
    const sym = Symbol('x');
    const result = mergeDeep({ a: 1 } as Record<PropertyKey, unknown>, { [sym]: 'value' });
    expect(result[sym]).toBe('value');
  });

  it('should not overwrite symbol key when source value is undefined', () => {
    const sym = Symbol('x');
    const result = mergeDeep({ [sym]: 'original' } as Record<PropertyKey, unknown>, { [sym]: undefined });
    expect(result[sym]).toBe('original');
  });

  it('should deeply merge symbol keys whose values are plain objects', () => {
    const sym = Symbol('nested');
    const result = mergeDeep({ [sym]: { a: 1 } } as Record<PropertyKey, unknown>, { [sym]: { b: 2 } });
    expect(result[sym]).toEqual({ a: 1, b: 2 });
  });

  it('should not merge non-enumerable symbol keys', () => {
    const sym = Symbol('hidden');
    const source = {};
    Object.defineProperty(source, sym, { value: 'hidden', enumerable: false });
    const result = mergeDeep({} as Record<PropertyKey, unknown>, source as Record<PropertyKey, unknown>);
    expect(result[sym]).toBeUndefined();
  });
});

describe('mergeDeep — type inference', () => {
  it('two disjoint objects → intersection type', () => {
    const result = mergeDeep({ a: 1 }, { b: 'x' });
    expectTypeOf(result).toEqualTypeOf<{ a: number } & { b: string }>();
  });

  it('three sources → triple intersection', () => {
    const result = mergeDeep({ a: 1 }, { b: 'x' }, { c: true });
    expectTypeOf(result).toEqualTypeOf<{ a: number } & { b: string } & { c: boolean }>();
  });

  it('nested shared key → nested intersection', () => {
    const result = mergeDeep({ a: { b: 1 } }, { a: { c: 'x' } });
    // TypeScript distributes intersection: { a: { b: number } } & { a: { c: string } }
    // = { a: { b: number } & { c: string } }
    expectTypeOf(result).toEqualTypeOf<{ a: { b: number } } & { a: { c: string } }>();
  });

  it('single source → same type', () => {
    const obj = { a: 1, b: 'x' };
    const result = mergeDeep(obj);
    expectTypeOf(result).toEqualTypeOf<typeof obj>();
  });
});
