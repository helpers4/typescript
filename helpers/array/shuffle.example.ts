/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { shuffle } from './shuffle';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'shuffle',
  category: 'array',
  examples: [
    {
      title: 'Shuffle an array of numbers',
      description: 'Returns a new array with the same elements in random order using the Fisher-Yates algorithm.',
      code: `shuffle([1, 2, 3, 4, 5])
// => [3, 1, 5, 2, 4] (random order)`,
      assert: () => {
        const result = shuffle([1, 2, 3, 4, 5]);
        if (result.length !== 5) throw new Error(`Expected 5 elements, got ${result.length}`);
        if (![1, 2, 3, 4, 5].every(n => result.includes(n))) throw new Error('Missing elements');
      },
    },
    {
      title: 'Original array is not mutated',
      description: 'The original array remains unchanged.',
      code: `const original = ['a', 'b', 'c'];
const shuffled = shuffle(original);
// original is still ['a', 'b', 'c']`,
      assert: () => {
        const original = ['a', 'b', 'c'];
        shuffle(original);
        if (original.join() !== 'a,b,c') throw new Error('Original was mutated');
      },
    },
  ],
};

export default examples;
