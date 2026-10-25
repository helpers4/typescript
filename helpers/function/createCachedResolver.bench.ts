/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { createCachedResolver } from '@helpers4/function';
import { RUN, consume } from '../../scripts/bench';

const compute = (n: number) => n * 2;

// Constructed once, outside any timed bench body, and primed with one
// resolve() up front — the same shape as the sibling memoize.bench.ts's
// 'cache hit' bench — so these two benches time only the steady-state hit,
// not construction plus the first-call miss.
const hitMapResolver = createCachedResolver(compute);
hitMapResolver.resolve(1);

const hitWeakMapKey = {};
const hitWeakMapResolver = createCachedResolver((k: object) => k, () => new WeakMap());
hitWeakMapResolver.resolve(hitWeakMapKey);

const clearResolver = createCachedResolver(compute);

test('createCachedResolver', async ({ bench }) => {
  await bench.compare(
    bench('create a resolver', () => {
      consume(createCachedResolver(compute));
    }),
    bench('resolve(), cache hit (Map-backed)', () => {
      hitMapResolver.resolve(1);
    }),
    bench('resolve(), cache hit (WeakMap-backed)', () => {
      hitWeakMapResolver.resolve(hitWeakMapKey);
    }),
    bench('resolve(), 100 distinct keys (all misses)', () => {
      const { resolve } = createCachedResolver(compute);
      for (let i = 0; i < 100; i++) resolve(i);
    }),
    bench('clear(), Map-backed (calls Map.clear())', {
        // Untimed: repopulates the cache clear() is about to wipe, so the
        // timed function below measures only the clear() call itself.
        beforeEach: () => {
          for (let i = 0; i < 100; i++) clearResolver.resolve(i);
        },
      }, () => {
        clearResolver.clear();
      }),
    RUN,
  );
});
