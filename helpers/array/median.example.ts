/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { median } from './median';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'median',
  category: 'array',
  examples: [
    {
      title: 'Odd-length array',
      description: 'Returns the middle value once sorted.',
      code: `median([3, 1, 2])
// => 2`,
      assert: () => {
        if (median([3, 1, 2]) !== 2) throw new Error('Expected 2');
      },
    },
    {
      title: 'Even-length array',
      description: 'Averages the two middle values.',
      code: `median([1, 2, 3, 4])
// => 2.5`,
      assert: () => {
        if (median([1, 2, 3, 4]) !== 2.5) throw new Error('Expected 2.5');
      },
    },
  ],
};

export default examples;
