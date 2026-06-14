/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isEven } from './isEven';

const examples: HelperExamples = {
  helper: 'isEven',
  category: 'number',
  examples: [
    {
      title: 'Check if a number is even',
      description: 'Returns true for integers divisible by 2, false otherwise.',
      code: `isEven(4)   // => true
isEven(0)   // => true
isEven(3)   // => false
isEven(1.5) // => false  (not an integer)`,
      assert: () => {
        if (!isEven(4)) throw new Error('4 should be even');
        if (!isEven(0)) throw new Error('0 should be even');
        if (isEven(3)) throw new Error('3 should not be even');
        if (isEven(1.5)) throw new Error('1.5 should not be even');
      },
    },
    {
      title: 'Filter even numbers from an array',
      description: 'Use as a predicate in .filter() to extract even integers.',
      code: `const nums = [1, 2, 3, 4, 5, 6];
nums.filter(isEven)
// => [2, 4, 6]`,
      assert: () => {
        const nums = [1, 2, 3, 4, 5, 6];
        const result = nums.filter(isEven);
        if (result.length !== 3 || result[0] !== 2) throw new Error('Expected [2, 4, 6]');
      },
    },
  ],
};

export default examples;
