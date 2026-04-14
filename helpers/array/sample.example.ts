/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { sample } from './sample';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'sample',
  category: 'array',
  examples: [
    {
      title: 'Pick a single random element',
      description: 'Without a count, returns one random element from the array.',
      code: `sample([1, 2, 3, 4, 5])
// => 3 (random element)`,
      assert: () => {
        const result = sample([1, 2, 3, 4, 5]);
        if (![1, 2, 3, 4, 5].includes(result!)) throw new Error(`Unexpected value: ${result}`);
      },
    },
    {
      title: 'Pick multiple random elements',
      description: 'With a count, returns an array of unique random elements.',
      code: `sample([1, 2, 3, 4, 5], 3)
// => [2, 5, 1] (3 random unique elements)`,
      assert: () => {
        const result = sample([1, 2, 3, 4, 5], 3);
        if (result.length !== 3) throw new Error(`Expected 3 elements, got ${result.length}`);
        if (new Set(result).size !== 3) throw new Error('Elements are not unique');
      },
    },
    {
      title: 'Empty array returns undefined',
      description: 'Returns undefined when sampling from an empty array.',
      code: `sample([])
// => undefined`,
      assert: () => {
        const result = sample([]);
        if (result !== undefined) throw new Error(`Expected undefined, got ${result}`);
      },
    },
  ],
};

export default examples;
