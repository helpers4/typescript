/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { max } from './max';

const examples: HelperExamples = {
  helper: 'max',
  category: 'array',
  examples: [
    {
      title: 'Safe maximum for large arrays',
      description: 'Unlike Math.max(...array), max() uses a loop and handles arrays of any size without stack overflow.',
      code: `max([3, 1, 4, 1, 5, 9])
// => 9

// Safe for 1 000 000+ elements (Math.max(...arr) would throw):
max(Array.from({ length: 1_000_000 }, (_, i) => i))
// => 999999`,
      assert: () => {
        if (max([3, 1, 4, 1, 5, 9]) !== 9) throw new Error('Expected 9');
        if (max([]) !== undefined) throw new Error('Expected undefined');
      },
    },
  ],
};

export default examples;
