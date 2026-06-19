/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { mean } from './mean';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'mean',
  category: 'array',
  examples: [
    {
      title: 'Average a list of numbers',
      description: 'Returns the arithmetic mean of the array; NaN for empty arrays.',
      code: `mean([1, 2, 3, 4])  // => 2.5
mean([10, 20, 30])  // => 20
mean([])            // => NaN`,
      assert: () => {
        if (mean([1, 2, 3, 4]) !== 2.5) throw new Error('Expected 2.5');
        if (mean([10, 20, 30]) !== 20) throw new Error('Expected 20');
        if (mean([0]) !== 0) throw new Error('Expected 0 for single-element array');
        if (!Number.isNaN(mean([]))) throw new Error('Expected NaN for empty');
      },
    },
  ],
};

export default examples;
