/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { filterAsync } from './filterAsync';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'filterAsync',
  category: 'array',
  examples: [
    {
      title: 'Keep only the files that pass an async check',
      description: 'Every predicate call runs concurrently; matches keep their original order.',
      code: `await filterAsync(files, (file) => fileExists(file))
// => only the files that actually exist`,
      assert: async () => {
        const files = ['a', 'b', 'c'];
        const exists = new Set(['a', 'c']);
        const result = await filterAsync(files, async (file) => exists.has(file));
        if (JSON.stringify(result) !== JSON.stringify(['a', 'c'])) throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
