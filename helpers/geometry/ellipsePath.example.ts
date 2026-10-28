/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { ellipsePath } from './ellipsePath';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'ellipsePath',
  category: 'geometry',
  examples: [
    {
      title: 'Fill a box with an ellipse',
      description: 'Two half-turn arcs; a square box gives a circle.',
      code: `ellipsePath({ x: 0, y: 0, width: 10, height: 6 }) // => 'M0 3 A5 3 0 0 1 10 3 A5 3 0 0 1 0 3 Z'`,
      assert: () => {
        if (ellipsePath({ x: 0, y: 0, width: 10, height: 6 }) !== 'M0 3 A5 3 0 0 1 10 3 A5 3 0 0 1 0 3 Z') throw new Error('Unexpected path');
      },
    },
  ],
};

export default examples;
