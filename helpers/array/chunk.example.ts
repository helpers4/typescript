/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { chunk } from './chunk';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'chunk',
  category: 'array',
  examples: [
    {
      title: 'Split an array into pairs',
      description: 'Chunks an array of 5 elements into groups of 2, with the last chunk containing the remainder.',
      code: `chunk([1, 2, 3, 4, 5], 2)
// => [[1, 2], [3, 4], [5]]`,
      assert: () => {
        const result = chunk([1, 2, 3, 4, 5], 2);
        if (result.length !== 3) throw new Error(`Expected 3 chunks, got ${result.length}`);
        if (result[0].length !== 2 || result[2].length !== 1) throw new Error('Unexpected chunk sizes');
      },
    },
    {
      title: 'Handle exact divisions',
      description: 'When the array length is evenly divisible by the chunk size, all chunks are equal.',
      code: `chunk([1, 2, 3, 4], 2)
// => [[1, 2], [3, 4]]`,
      assert: () => {
        const result = chunk([1, 2, 3, 4], 2);
        if (result.length !== 2) throw new Error(`Expected 2 chunks, got ${result.length}`);
      },
    },
    {
      title: 'Return empty array for invalid size',
      description: 'A size of 0 or negative returns an empty array.',
      code: `chunk([1, 2, 3], 0)
// => []`,
      assert: () => {
        const result = chunk([1, 2, 3], 0);
        if (result.length !== 0) throw new Error(`Expected empty array, got ${result.length} chunks`);
      },
    },
  ],
};

export default examples;
