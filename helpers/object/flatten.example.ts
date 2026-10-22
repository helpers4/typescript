/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { flatten } from './flatten';

const examples: HelperExamples = {
  helper: 'flatten',
  category: 'object',
  examples: [
    {
      title: 'Flatten a nested config object',
      description: 'Each key in the result is the full dot-notation path to a leaf value.',
      code: `flatten({ server: { host: 'localhost', port: 8080 } })
// => { 'server.host': 'localhost', 'server.port': 8080 }`,
      assert: () => {
        const result = flatten({ server: { host: 'localhost', port: 8080 } });
        if (result['server.host'] !== 'localhost' || result['server.port'] !== 8080) {
          throw new Error('Unexpected result');
        }
      },
    },
    {
      title: 'Arrays and special objects are kept as leaves',
      description: 'Only plain objects are recursed into — arrays stay intact.',
      code: `flatten({ tags: ['a', 'b'], meta: { owner: 'x' } })
// => { tags: ['a', 'b'], 'meta.owner': 'x' }`,
      assert: () => {
        const result = flatten({ tags: ['a', 'b'], meta: { owner: 'x' } });
        if (JSON.stringify(result['tags']) !== JSON.stringify(['a', 'b']) || result['meta.owner'] !== 'x') {
          throw new Error('Unexpected result');
        }
      },
    },
  ],
};

export default examples;
