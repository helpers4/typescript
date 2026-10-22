/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isAsyncGenerator } from './isAsyncGenerator';

const examples: HelperExamples = {
  helper: 'isAsyncGenerator',
  category: 'type',
  examples: [
    {
      title: 'Detect an async generator instance',
      description: 'Returns true only for the object produced by calling an async function*.',
      code: `async function* gen() { yield 1; }
isAsyncGenerator(gen())  // => true   (instance)
isAsyncGenerator(gen)    // => false  (function)
isAsyncGenerator([])     // => false`,
      assert: () => {
        async function* gen() { yield 1; }
        if (!isAsyncGenerator(gen())) throw new Error('async generator instance should return true');
        if (isAsyncGenerator(gen)) throw new Error('async generator function should return false');
      },
    },
    {
      title: 'Distinguish async from sync generators',
      description: 'isAsyncGenerator is false for sync generator instances.',
      code: `function* sync() { yield 1; }
async function* async_() { yield 1; }
isAsyncGenerator(sync())   // => false
isAsyncGenerator(async_()) // => true`,
      assert: () => {
        function* sync() { yield 1; }
        async function* asyncGen() { yield 1; }
        if (isAsyncGenerator(sync())) throw new Error('sync generator should return false');
        if (!isAsyncGenerator(asyncGen())) throw new Error('async generator should return true');
      },
    },
  ],
};

export default examples;
