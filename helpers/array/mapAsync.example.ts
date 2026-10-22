/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { mapAsync } from './mapAsync';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'mapAsync',
  category: 'array',
  examples: [
    {
      title: 'Map over an array with an async function',
      description: 'Every call starts immediately, results come back in input order.',
      code: `await mapAsync([1, 2, 3], async (n) => n * 2)
// => [2, 4, 6]`,
      assert: async () => {
        const result = await mapAsync([1, 2, 3], async (n) => n * 2);
        if (JSON.stringify(result) !== JSON.stringify([2, 4, 6])) throw new Error('Unexpected result');
      },
    },
    {
      title: 'Cap concurrency to avoid overwhelming an API',
      description: 'At most `concurrency` calls run at once; the rest queue and wait.',
      code: `await mapAsync(urls, (url) => fetch(url).then(r => r.json()), 2)
// at most 2 concurrent fetch() calls`,
      assert: async () => {
        let concurrent = 0;
        let max = 0;
        await mapAsync(
          [1, 2, 3, 4],
          async () => {
            concurrent++;
            max = Math.max(max, concurrent);
            await new Promise((r) => setTimeout(r, 5));
            concurrent--;
          },
          2,
        );
        if (max > 2) throw new Error(`Expected at most 2 concurrent, got ${max}`);
      },
    },
  ],
};

export default examples;
