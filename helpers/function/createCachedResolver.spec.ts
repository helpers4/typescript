/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it, vi } from 'vitest';
import { createCachedResolver } from './createCachedResolver';

describe('createCachedResolver — property-based', () => {
  it('resolve() called N times for the same key computes at most once', () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.string(), fc.integer(), fc.boolean()),
        fc.integer({ min: 1, max: 20 }),
        (key, callCount) => {
          const compute = vi.fn((k: typeof key) => k);
          const { resolve } = createCachedResolver(compute);

          for (let i = 0; i < callCount; i++) resolve(key);

          expect(compute).toHaveBeenCalledTimes(1);
        },
      ),
    );
  });

  it('resolve() always returns compute(key) for that key, regardless of cache state', () => {
    fc.assert(
      fc.property(fc.array(fc.integer(), { minLength: 1, maxLength: 20 }), (keys) => {
        const { resolve } = createCachedResolver((n: number) => n * 2);
        for (const key of keys) {
          expect(resolve(key)).toBe(key * 2);
        }
      }),
    );
  });

  it('clear() makes every previously-resolved key recompute exactly once more', () => {
    fc.assert(
      fc.property(fc.array(fc.integer(), { minLength: 1, maxLength: 10 }), (keys) => {
        const uniqueKeys = [...new Set(keys)];
        const compute = vi.fn((n: number) => n);
        const { resolve, clear } = createCachedResolver(compute);

        for (const key of uniqueKeys) resolve(key);
        const callsBeforeClear = compute.mock.calls.length;
        clear();
        for (const key of uniqueKeys) resolve(key);

        expect(compute.mock.calls.length).toBe(callsBeforeClear * 2);
      }),
    );
  });
});

describe('createCachedResolver — contract', () => {
  it('works with every primitive key type via the default Map-backed cache', () => {
    const stringResolver = createCachedResolver((s: string) => s.length);
    const numberResolver = createCachedResolver((n: number) => n + 1);
    const boolResolver = createCachedResolver((b: boolean) => !b);

    expect(stringResolver.resolve('hello')).toBe(5);
    expect(numberResolver.resolve(41)).toBe(42);
    expect(boolResolver.resolve(true)).toBe(false);
  });

  it('does not call compute for an unrelated key', () => {
    const compute = vi.fn((n: number) => n);
    const { resolve } = createCachedResolver(compute);

    resolve(1);
    compute.mockClear();
    resolve(2);

    expect(compute).toHaveBeenCalledExactlyOnceWith(2);
  });
});
