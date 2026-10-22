/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { settle } from './settle';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'settle',
  category: 'promise',
  examples: [
    {
      title: 'Partition fulfilled and rejected outcomes',
      description: 'Runs promises concurrently and splits results instead of rejecting on the first failure.',
      code: `const { fulfilled, rejected } = await settle([
  Promise.resolve(1),
  Promise.reject(new Error('boom')),
  Promise.resolve(3),
])
// => { fulfilled: [1, 3], rejected: [Error('boom')] }`,
      assert: async () => {
        const { fulfilled, rejected } = await settle([
          Promise.resolve(1),
          Promise.reject(new Error('boom')),
          Promise.resolve(3),
        ]);
        if (fulfilled.length !== 2 || rejected.length !== 1) {
          throw new Error(`Expected 2 fulfilled and 1 rejected, got ${JSON.stringify({ fulfilled, rejected })}`);
        }
      },
    },
    {
      title: 'All promises succeed',
      description: 'Returns an empty rejected array when nothing fails.',
      code: `const { fulfilled, rejected } = await settle([Promise.resolve('a'), Promise.resolve('b')])
// => { fulfilled: ['a', 'b'], rejected: [] }`,
      assert: async () => {
        const { fulfilled, rejected } = await settle([Promise.resolve('a'), Promise.resolve('b')]);
        if (rejected.length !== 0 || fulfilled.length !== 2) {
          throw new Error(`Expected no rejections, got ${JSON.stringify({ fulfilled, rejected })}`);
        }
      },
    },
  ],
};

export default examples;
