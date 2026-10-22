/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isAsyncGeneratorFunction } from './isAsyncGeneratorFunction';

const examples: HelperExamples = {
  helper: 'isAsyncGeneratorFunction',
  category: 'type',
  examples: [
    {
      title: 'Detect an async generator function',
      description: 'Returns true for async function* declarations and expressions.',
      code: `async function* gen() { yield 1; }
isAsyncGeneratorFunction(gen)         // => true
isAsyncGeneratorFunction(gen())       // => false  (instance)
isAsyncGeneratorFunction(async () => {}) // => false`,
      assert: () => {
        async function* gen() { yield 1; }
        if (!isAsyncGeneratorFunction(gen)) throw new Error('should be async generator function');
        if (isAsyncGeneratorFunction(gen())) throw new Error('instance should return false');
        if (isAsyncGeneratorFunction(async () => {})) throw new Error('async fn should return false');
      },
    },
    {
      title: 'Distinguish async generator functions from sync generator functions',
      description: 'isAsyncGeneratorFunction is false for sync function*.',
      code: `function* sync() { yield 1; }
async function* async_() { yield 1; }
isAsyncGeneratorFunction(sync)   // => false
isAsyncGeneratorFunction(async_) // => true`,
      assert: () => {
        function* sync() { yield 1; }
        async function* asyncGen() { yield 1; }
        if (isAsyncGeneratorFunction(sync)) throw new Error('sync gen fn should return false');
        if (!isAsyncGeneratorFunction(asyncGen)) throw new Error('async gen fn should return true');
      },
    },
  ],
};

export default examples;
