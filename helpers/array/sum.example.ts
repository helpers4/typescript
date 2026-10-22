/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { sum } from './sum';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'sum',
  category: 'array',
  examples: [
    {
      title: 'Sum numbers',
      description: 'Calculates the sum of an array of numbers.',
      code: `sum([1, 2, 3, 4])
// => 10`,
      assert: () => {
        if (sum([1, 2, 3, 4]) !== 10) throw new Error('Expected 10');
      },
    },
    {
      title: 'Sum with negative numbers',
      description: 'Handles negative numbers correctly.',
      code: `sum([10, -3, 5, -2])
// => 10`,
      assert: () => {
        if (sum([10, -3, 5, -2]) !== 10) throw new Error('Expected 10');
      },
    },
  ],
};

export default examples;
