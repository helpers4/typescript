/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { range } from './range';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'range',
  category: 'array',
  examples: [
    {
      title: 'Generate a sequence from 0',
      description:
        'Creates an array of numbers from 0 to n-1 with a single argument.',
      code: `range(5)
// => [0, 1, 2, 3, 4]`,
      assert: () => {
        const result = range(5);
        if (result.length !== 5)
          throw new Error(`Expected 5 elements, got ${result.length}`);
        if (result[0] !== 0 || result[4] !== 4)
          throw new Error('Unexpected values');
      },
    },
    {
      title: 'Generate a sequence with start and end',
      description: 'Creates an array from start (inclusive) to end (exclusive).',
      code: `range(1, 5)
// => [1, 2, 3, 4]`,
      assert: () => {
        const result = range(1, 5);
        if (result.length !== 4)
          throw new Error(`Expected 4 elements, got ${result.length}`);
        if (result[0] !== 1 || result[3] !== 4)
          throw new Error('Unexpected values');
      },
    },
    {
      title: 'Generate a sequence with a custom step',
      description: 'Creates an array with a specified increment between values.',
      code: `range(0, 10, 2)
// => [0, 2, 4, 6, 8]`,
      assert: () => {
        const result = range(0, 10, 2);
        if (result.length !== 5)
          throw new Error(`Expected 5 elements, got ${result.length}`);
        if (result[2] !== 4) throw new Error('Unexpected value at index 2');
      },
    },
    {
      title: 'Generate a descending sequence',
      description:
        'Automatically produces a descending range when start > end.',
      code: `range(5, 0)
// => [5, 4, 3, 2, 1]`,
      assert: () => {
        const result = range(5, 0);
        if (result.length !== 5)
          throw new Error(`Expected 5 elements, got ${result.length}`);
        if (result[0] !== 5 || result[4] !== 1)
          throw new Error('Unexpected values');
      },
    },
  ],
};

export default examples;
