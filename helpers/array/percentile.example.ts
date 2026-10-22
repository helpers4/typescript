/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { percentile } from './percentile';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'percentile',
  category: 'array',
  examples: [
    {
      title: 'Median via the 50th percentile',
      description: 'The 50th percentile is equivalent to the median.',
      code: `percentile([1, 2, 3, 4], 50)
// => 2.5`,
      assert: () => {
        if (percentile([1, 2, 3, 4], 50) !== 2.5) throw new Error('Expected 2.5');
      },
    },
    {
      title: 'Min and max via 0 and 100',
      description: 'The 0th and 100th percentiles are the min and max.',
      code: `percentile([4, 1, 3, 2], 0)   // => 1
percentile([4, 1, 3, 2], 100) // => 4`,
      assert: () => {
        if (percentile([4, 1, 3, 2], 0) !== 1) throw new Error('Expected 1');
        if (percentile([4, 1, 3, 2], 100) !== 4) throw new Error('Expected 4');
      },
    },
  ],
};

export default examples;
