/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { clamp } from './clamp';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'clamp',
  category: 'number',
  examples: [
    {
      title: 'Clamp a value within range',
      description: 'Restricts a number to be within a min/max range.',
      code: `clamp(15, 0, 10)  // => 10
clamp(-5, 0, 10)  // => 0
clamp(5, 0, 10)   // => 5`,
      assert: () => {
        if (clamp(15, 0, 10) !== 10) throw new Error('Expected 10');
        if (clamp(-5, 0, 10) !== 0) throw new Error('Expected 0');
        if (clamp(5, 0, 10) !== 5) throw new Error('Expected 5');
      },
    },
  ],
};

export default examples;
