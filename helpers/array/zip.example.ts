/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { zip } from './zip';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'zip',
  category: 'array',
  examples: [
    {
      title: 'Pair keys with values',
      description: 'Combine two arrays element-by-element.',
      code: `zip(['a', 'b', 'c'], [1, 2, 3])
// => [['a', 1], ['b', 2], ['c', 3]]`,
      assert: () => {
        const result = zip(['a', 'b', 'c'], [1, 2, 3]);
        if (JSON.stringify(result) !== JSON.stringify([['a', 1], ['b', 2], ['c', 3]]))
          throw new Error('Unexpected result');
      },
    },
    {
      title: 'Truncates to the shorter array',
      description: 'Stops at the end of the shorter array to avoid undefined entries.',
      code: `zip([1, 2, 3], ['x', 'y'])
// => [[1, 'x'], [2, 'y']]`,
      assert: () => {
        const result = zip([1, 2, 3], ['x', 'y']);
        if (result.length !== 2) throw new Error('Expected length 2');
      },
    },
  ],
};

export default examples;
