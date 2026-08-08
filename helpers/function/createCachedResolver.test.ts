/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it, vi } from 'vitest';
import { createCachedResolver } from './createCachedResolver';

describe('createCachedResolver', () => {
  it('computes and caches on the first resolve() for a key', () => {
    const compute = vi.fn((n: number) => n * 2);
    const { resolve } = createCachedResolver(compute);

    expect(resolve(5)).toBe(10);
    expect(compute).toHaveBeenCalledTimes(1);
    expect(compute).toHaveBeenCalledWith(5);
  });

  it('returns the cached value on a later resolve() for the same key, without recomputing', () => {
    const compute = vi.fn((n: number) => n * 2);
    const { resolve } = createCachedResolver(compute);

    resolve(5);
    resolve(5);
    resolve(5);

    expect(compute).toHaveBeenCalledTimes(1);
  });

  it('computes each distinct key independently', () => {
    const compute = vi.fn((n: number) => n * 2);
    const { resolve } = createCachedResolver(compute);

    expect(resolve(5)).toBe(10);
    expect(resolve(6)).toBe(12);
    expect(compute).toHaveBeenCalledTimes(2);
  });

  it('clear() discards the cache so the next resolve() recomputes', () => {
    const compute = vi.fn((n: number) => n * 2);
    const { resolve, clear } = createCachedResolver(compute);

    resolve(5);
    clear();
    resolve(5);

    expect(compute).toHaveBeenCalledTimes(2);
  });

  it('defaults to a Map-backed cache, so primitive keys work', () => {
    const { resolve } = createCachedResolver((s: string) => s.toUpperCase());
    expect(resolve('hello')).toBe('HELLO');
  });

  it('accepts a WeakMap factory for object keys', () => {
    const compute = vi.fn((_key: object) => 'computed');
    const key = {};
    const { resolve } = createCachedResolver(compute, () => new WeakMap());

    resolve(key);
    resolve(key);

    expect(compute).toHaveBeenCalledTimes(1);
  });

  it('calls the cache\'s own clear() when available (Map), to free memory proactively', () => {
    const map = new Map<number, number>();
    const clearSpy = vi.spyOn(map, 'clear');
    const { resolve, clear } = createCachedResolver((n: number) => n, () => map);

    resolve(1);
    clear();

    expect(clearSpy).toHaveBeenCalledTimes(1);
  });

  it('does not throw when the cache has no clear() (WeakMap)', () => {
    const { resolve, clear } = createCachedResolver((k: object) => k, () => new WeakMap());
    resolve({});
    expect(() => clear()).not.toThrow();
  });

  it('createCache is called again on clear(), producing a genuinely fresh cache', () => {
    const createCache = vi.fn(() => new Map<number, number>());
    const { clear } = createCachedResolver((n: number) => n, createCache);

    expect(createCache).toHaveBeenCalledTimes(1); // initial cache
    clear();
    expect(createCache).toHaveBeenCalledTimes(2);
    clear();
    expect(createCache).toHaveBeenCalledTimes(3);
  });

  it('two independent resolvers do not share a cache', () => {
    const a = createCachedResolver((n: number) => n * 2);
    const b = createCachedResolver((n: number) => n * 3);

    expect(a.resolve(5)).toBe(10);
    expect(b.resolve(5)).toBe(15);
  });
});
