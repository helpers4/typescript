/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { createCachedResolver } from './createCachedResolver';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'createCachedResolver',
  category: 'function',
  examples: [
    {
      title: 'Compute once, reuse on every later call for the same key',
      description: 'compute() only runs on a cache miss — a repeated call for the same key returns the cached value.',
      code: `let calls = 0;
const { resolve } = createCachedResolver((id: number) => {
  calls++;
  return id * 2;
});
resolve(1); // calls compute, calls === 1
resolve(1); // cache hit, calls still === 1`,
      assert: () => {
        let calls = 0;
        const { resolve } = createCachedResolver((id: number) => {
          calls++;
          return id * 2;
        });
        resolve(1);
        resolve(1);
        if (calls !== 1) throw new Error(`Expected compute to run once, ran ${calls} times`);
      },
    },
    {
      title: "clear() wipes the cache — the next resolve() recomputes",
      description: 'Useful for a "refresh" action that must pick up changes since the cache was last filled.',
      code: `let calls = 0;
const { resolve, clear } = createCachedResolver((id: number) => { calls++; return id; });
resolve(1);
clear();
resolve(1); // recomputed, calls === 2`,
      assert: () => {
        let calls = 0;
        const { resolve, clear } = createCachedResolver((id: number) => {
          calls++;
          return id;
        });
        resolve(1);
        clear();
        resolve(1);
        if (calls !== 2) throw new Error(`Expected 2 compute calls, got ${calls}`);
      },
    },
    {
      title: 'WeakMap-backed cache for object keys',
      description: 'Pass a factory returning a WeakMap so entries can be garbage-collected once the key object is no longer referenced elsewhere.',
      code: `const resolver = createCachedResolver(
  (config: object) => deriveExpensiveSettings(config),
  () => new WeakMap(),
);`,
      assert: () => {
        const key = {};
        let calls = 0;
        const resolver = createCachedResolver(
          (_config: object) => {
            calls++;
            return 'derived';
          },
          () => new WeakMap(),
        );
        resolver.resolve(key);
        resolver.resolve(key);
        if (calls !== 1) throw new Error(`Expected compute to run once, ran ${calls} times`);
      },
    },
  ],
};

export default examples;
