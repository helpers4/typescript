/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { parallelSettle } from './parallelSettle';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'parallelSettle',
  category: 'promise',
  examples: [
    {
      title: 'Limit concurrency without one failure stopping the rest',
      description: 'Runs at most `concurrency` functions at a time and partitions outcomes instead of rejecting on the first failure.',
      code: `const { fulfilled, rejected } = await parallelSettle(
  [() => fetch('/a'), () => fetch('/b'), () => fetch('/c')],
  2
)
// At most 2 requests run at a time; a failing request doesn't stop the others`,
      assert: async () => {
        const { fulfilled, rejected } = await parallelSettle(
          [() => Promise.resolve(1), () => Promise.reject(new Error('boom')), () => Promise.resolve(3)],
          2,
        );
        if (fulfilled.length !== 2 || rejected.length !== 1) {
          throw new Error(`Expected 2 fulfilled and 1 rejected, got ${JSON.stringify({ fulfilled, rejected })}`);
        }
      },
    },
    {
      title: 'All functions succeed',
      description: 'Returns an empty rejected array when nothing fails.',
      code: `const { fulfilled, rejected } = await parallelSettle(
  [() => Promise.resolve('a'), () => Promise.resolve('b')],
  2
)
// => { fulfilled: ['a', 'b'], rejected: [] }`,
      assert: async () => {
        const { fulfilled, rejected } = await parallelSettle(
          [() => Promise.resolve('a'), () => Promise.resolve('b')],
          2,
        );
        if (rejected.length !== 0 || fulfilled.length !== 2) {
          throw new Error(`Expected no rejections, got ${JSON.stringify({ fulfilled, rejected })}`);
        }
      },
    },
  ],
};

export default examples;
