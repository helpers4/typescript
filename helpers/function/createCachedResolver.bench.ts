/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { createCachedResolver } from './createCachedResolver';

const compute = (n: number) => n * 2;

describe('createCachedResolver', () => {
  bench('create a resolver', () => {
    createCachedResolver(compute);
  });

  bench('resolve(), cache hit (Map-backed)', () => {
    const { resolve } = createCachedResolver(compute);
    resolve(1);
    resolve(1);
  });

  bench('resolve(), cache hit (WeakMap-backed)', () => {
    const key = {};
    const { resolve } = createCachedResolver((k: object) => k, () => new WeakMap());
    resolve(key);
    resolve(key);
  });

  bench('resolve(), 100 distinct keys (all misses)', () => {
    const { resolve } = createCachedResolver(compute);
    for (let i = 0; i < 100; i++) resolve(i);
  });

  bench('clear(), Map-backed (calls Map.clear())', () => {
    const { resolve, clear } = createCachedResolver(compute);
    for (let i = 0; i < 100; i++) resolve(i);
    clear();
  });
});
