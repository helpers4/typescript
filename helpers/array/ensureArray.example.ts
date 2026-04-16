/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { ensureArray } from './ensureArray';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'ensureArray',
  category: 'array',
  examples: [
    {
      title: 'Wrap a single value',
      description: 'Wraps a non-array value in an array.',
      code: `ensureArray('hello')
// => ['hello']`,
      assert: () => {
        const result = ensureArray('hello');
        if (result.length !== 1 || result[0] !== 'hello')
          throw new Error('Unexpected result');
      },
    },
    {
      title: 'Pass through an existing array',
      description: 'Returns the array as-is if already an array.',
      code: `ensureArray([1, 2, 3])
// => [1, 2, 3]`,
      assert: () => {
        const arr = [1, 2, 3];
        const result = ensureArray(arr);
        if (result !== arr) throw new Error('Expected same reference');
      },
    },
    {
      title: 'Handle null and undefined',
      description: 'Returns an empty array for null or undefined values.',
      code: `ensureArray(null)
// => []`,
      assert: () => {
        const result = ensureArray(null);
        if (result.length !== 0) throw new Error('Expected empty array');
      },
    },
    {
      title: 'Flatten nested arrays with depth',
      description:
        'Flattens the resulting array to a given depth, like Array.prototype.flat().',
      code: `ensureArray([[1, [2, 3]], [4]], 1)
// => [1, [2, 3], 4]`,
      assert: () => {
        const result = ensureArray([[1, [2, 3]], [4]], 1);
        if (result.length !== 3 || result[0] !== 1 || result[2] !== 4)
          throw new Error('Unexpected flattened result');
      },
    },
  ],
};

export default examples;
