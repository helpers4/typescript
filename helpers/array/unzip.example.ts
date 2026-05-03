/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { unzip } from './unzip';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'unzip',
  category: 'array',
  examples: [
    {
      title: 'Split pairs into separate arrays',
      description: 'The inverse of zip — separate each position into its own array.',
      code: `const pairs: [number, string][] = [[1, 'a'], [2, 'b'], [3, 'c']];
const [nums, letters] = unzip(pairs);

nums;    // => [1, 2, 3]
letters; // => ['a', 'b', 'c']`,
      assert: () => {
        const [nums, letters] = unzip([[1, 'a'], [2, 'b'], [3, 'c']]);
        if (JSON.stringify(nums) !== '[1,2,3]') throw new Error('Unexpected nums');
        if (JSON.stringify(letters) !== '["a","b","c"]') throw new Error('Unexpected letters');
      },
    },
  ],
};

export default examples;
