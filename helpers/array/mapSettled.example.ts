/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { mapSettled } from './mapSettled';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'mapSettled',
  category: 'array',
  examples: [
    {
      title: 'Keep going when some calls fail',
      description: 'Each item gets its own result, like Promise.allSettled.',
      code: `await mapSettled([1, 2, 3], (n) => (n === 2 ? Promise.reject('no') : n * 10))
// => [{ status: 'fulfilled', value: 10 }, { status: 'rejected', reason: 'no' }, { status: 'fulfilled', value: 30 }]`,
      assert: async () => {
        const results = await mapSettled([1, 2, 3], (n) => (n === 2 ? Promise.reject(new Error('no')) : n * 10));
        if (results.map((r) => r.status).join() !== 'fulfilled,rejected,fulfilled') throw new Error('Unexpected statuses');
      },
    },
    {
      title: 'Cap concurrency',
      description: 'The third argument limits how many calls run at once.',
      code: `const results = await mapSettled(urls, (url) => fetch(url), 4);`,
      assert: async () => {
        const results = await mapSettled(['a', 'b', 'c'], (s) => s.toUpperCase(), 1);
        if (results.length !== 3) throw new Error('Expected 3 results');
      },
    },
  ],
};

export default examples;
