/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { sortNumberAscFn, sortStringAscFn } from './sort';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'sortNumberAscFn',
  category: 'array',
  examples: [
    {
      title: 'Sort numbers ascending',
      description: 'Use sortNumberAscFn as a comparator for Array.sort().',
      code: `[3, 1, 2].sort(sortNumberAscFn)
// => [1, 2, 3]`,
      assert: () => {
        const result = [3, 1, 2].sort(sortNumberAscFn);
        if (result[0] !== 1 || result[1] !== 2 || result[2] !== 3) throw new Error('Unexpected order');
      },
    },
    {
      title: 'Sort strings alphabetically',
      description: 'Use sortStringAscFn for locale-aware string sorting.',
      code: `['banana', 'apple', 'cherry'].sort(sortStringAscFn)
// => ['apple', 'banana', 'cherry']`,
      assert: () => {
        const result = ['banana', 'apple', 'cherry'].sort(sortStringAscFn);
        if (result[0] !== 'apple') throw new Error('Unexpected order');
      },
    },
  ],
};

export default examples;
