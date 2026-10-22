/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { parallel } from './parallel';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'parallel',
  category: 'promise',
  examples: [
    {
      title: 'Run tasks with concurrency limit',
      description: 'Executes async functions with at most N running concurrently.',
      code: `const results = await parallel(
  [() => fetch('/a'), () => fetch('/b'), () => fetch('/c')],
  2
)
// At most 2 requests run at a time; results are in order`,
      assert: async () => {
        const results = await parallel(
          [() => Promise.resolve(1), () => Promise.resolve(2), () => Promise.resolve(3)],
          2,
        );
        if (results.length !== 3) throw new Error(`Expected 3 results, got ${results.length}`);
        if (results[0] !== 1 || results[1] !== 2 || results[2] !== 3) throw new Error('Wrong order');
      },
    },
    {
      title: 'Sequential execution with limit of 1',
      description: 'Setting limit to 1 runs functions one at a time.',
      code: `await parallel([fnA, fnB, fnC], 1)
// Runs fnA, then fnB, then fnC`,
      assert: async () => {
        const order: number[] = [];
        const results = await parallel(
          [
            async () => { order.push(1); return 'a'; },
            async () => { order.push(2); return 'b'; },
          ],
          1,
        );
        if (order[0] !== 1 || order[1] !== 2) throw new Error('Not sequential');
        if (results[0] !== 'a') throw new Error(`Expected 'a', got ${results[0]}`);
      },
    },
  ],
};

export default examples;
