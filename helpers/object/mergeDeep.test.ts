/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { mergeDeep } from './mergeDeep';

describe('mergeDeep', () => {
  it('should merge objects deeply', () => {
    const base = { a: 1, b: { c: 2, d: 3 } };
    const source = { b: { c: 4, e: 5 }, f: 6 };

    const result = mergeDeep(base, source);

    expect(result).toEqual({ a: 1, b: { c: 4, d: 3, e: 5 }, f: 6 });
  });

  it('should handle multiple sources', () => {
    const result = mergeDeep({ a: 1 }, { b: 2 }, { c: 3 });
    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('should not mutate base or sources', () => {
    const base = { a: 1, b: { c: 2 } };
    const source = { b: { d: 3 } };
    const result = mergeDeep(base, source);

    expect(base.b).not.toHaveProperty('d');
    expect(result.b).toHaveProperty('d', 3);
    expect(result.b).toHaveProperty('c', 2);
  });

  it('should return new object when no sources provided', () => {
    const base = { a: 1 };
    const result = mergeDeep(base);
    expect(result).toEqual({ a: 1 });
    expect(result).not.toBe(base);
  });

  it('should handle undefined values in source', () => {
    const result = mergeDeep({ a: 1 }, { b: undefined });
    expect(result).toEqual({ a: 1 });
    expect('b' in result).toBe(false);
  });

  it('should handle null values in source', () => {
    const result = mergeDeep({ a: 1 }, { b: null });
    expect(result).toEqual({ a: 1, b: null });
  });

  it('should handle arrays as values (not merge them)', () => {
    const result = mergeDeep({ arr: [1, 2] }, { arr: [3, 4] });
    expect(result.arr).toEqual([3, 4]);
  });

  it('should deeply merge multiple nested objects', () => {
    const result = mergeDeep(
      { a: { b: { c: 1 } } },
      { a: { b: { d: 2 } } },
      { a: { e: 3 } },
    );
    expect(result).toEqual({ a: { b: { c: 1, d: 2 }, e: 3 } });
  });

  it('should handle multiple sources with no common properties', () => {
    expect(mergeDeep({ x: 1 }, { y: 2 }, { z: 3 })).toEqual({ x: 1, y: 2, z: 3 });
  });

  it('should handle merging with nested null values correctly', () => {
    const result = mergeDeep({ a: { b: null } }, { a: { c: 3 } });
    expect(result).toEqual({ a: { b: null, c: 3 } });
  });

  it('should handle multiple sources including empty objects', () => {
    expect(mergeDeep({ a: 1 }, { b: 2 }, {}, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('should handle null/undefined sources gracefully', () => {
    const result = mergeDeep({ a: 1 }, null as unknown as Record<string, unknown>, undefined as unknown as Record<string, unknown>, { b: 2 });
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('should deeply merge nested objects (not just overwrite)', () => {
    const result = mergeDeep({ a: { x: 1, y: 2 } }, { a: { z: 3 } });
    expect(result.a).toEqual({ x: 1, y: 2, z: 3 });
    expect(result.a.x).toBe(1);
  });

  it('should overwrite when base value is not plain object', () => {
    const result = mergeDeep({ a: 'string' }, { a: { nested: true } });
    expect(result.a).toEqual({ nested: true });
  });

  it('should overwrite when source value is not plain object', () => {
    const result = mergeDeep({ a: { nested: true } }, { a: 'string' });
    expect(result.a).toBe('string');
  });

  it('should not allow __proto__ pollution', () => {
    const malicious = JSON.parse('{"__proto__":{"polluted":"yes"}}');
    mergeDeep({}, malicious);
    expect(({} as Record<string, unknown>)['polluted']).toBeUndefined();
  });

  it('should not allow constructor pollution', () => {
    const base = {};
    const malicious = { constructor: { polluted: 'yes' } };
    const result = mergeDeep(base, malicious);
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
