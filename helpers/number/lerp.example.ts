/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { lerp } from './lerp';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'lerp',
  category: 'number',
  examples: [
    {
      title: 'Interpolate between two values',
      description: 'Returns the value between start and end at position t (0 = start, 1 = end).',
      code: `lerp(0, 100, 0)    // => 0
lerp(0, 100, 0.5)  // => 50
lerp(0, 100, 1)    // => 100`,
      assert: () => {
        if (lerp(0, 100, 0) !== 0) throw new Error('Expected 0');
        if (lerp(0, 100, 0.5) !== 50) throw new Error('Expected 50');
        if (lerp(0, 100, 1) !== 100) throw new Error('Expected 100');
      },
    },
    {
      title: 'Animate a colour channel',
      description: 't outside [0, 1] extrapolates beyond the range.',
      code: `lerp(0, 255, 0.5) // => 127.5
lerp(0, 10, 2)    // => 20  (extrapolation)`,
      assert: () => {
        if (lerp(0, 255, 0.5) !== 127.5) throw new Error('Expected 127.5');
        if (lerp(0, 10, 2) !== 20) throw new Error('Expected 20');
      },
    },
  ],
};

export default examples;
