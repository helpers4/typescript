/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isOdd } from './isOdd';

const examples: HelperExamples = {
  helper: 'isOdd',
  category: 'number',
  examples: [
    {
      title: 'Check if a number is odd',
      description: 'Returns true for integers not divisible by 2, false otherwise.',
      code: `isOdd(3)   // => true
isOdd(1)   // => true
isOdd(2)   // => false
isOdd(0)   // => false
isOdd(1.5) // => false  (not an integer)`,
      assert: () => {
        if (!isOdd(3)) throw new Error('3 should be odd');
        if (!isOdd(1)) throw new Error('1 should be odd');
        if (isOdd(2)) throw new Error('2 should not be odd');
        if (isOdd(1.5)) throw new Error('1.5 should not be odd');
      },
    },
    {
      title: 'Filter odd numbers from an array',
      description: 'Use as a predicate in .filter() to extract odd integers.',
      code: `const nums = [1, 2, 3, 4, 5, 6];
nums.filter(isOdd)
// => [1, 3, 5]`,
      assert: () => {
        const nums = [1, 2, 3, 4, 5, 6];
        const result = nums.filter(isOdd);
        if (result.length !== 3 || result[0] !== 1) throw new Error('Expected [1, 3, 5]');
      },
    },
  ],
};

export default examples;
