/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { min } from './min';

const examples: HelperExamples = {
  helper: 'min',
  category: 'array',
  examples: [
    {
      title: 'Safe minimum for large arrays',
      description: 'Unlike Math.min(...array), min() uses a loop and handles arrays of any size without stack overflow.',
      code: `min([3, 1, 4, 1, 5, 9])
// => 1

// Safe for 1 000 000+ elements (Math.min(...arr) would throw):
min(Array.from({ length: 1_000_000 }, (_, i) => i))
// => 0`,
      assert: () => {
        if (min([3, 1, 4, 1, 5, 9]) !== 1) throw new Error('Expected 1');
        if (min([]) !== undefined) throw new Error('Expected undefined');
      },
    },
  ],
};

export default examples;
