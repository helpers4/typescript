/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { steps } from './steps';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'steps',
  category: 'animation',
  examples: [
    {
      title: 'A four-frame sprite',
      description: 'Progress moves by jumps instead of continuously.',
      code: `const fourFrames = steps(4);
fourFrames(0.3) // => 0.25
fourFrames(1)   // => 1`,
      assert: () => {
        if (steps(4)(0.3) !== 0.25 || steps(4)(1) !== 1) throw new Error('Unexpected steps');
      },
    },
    {
      title: 'Jump at the start',
      description: "With 'jump-start', the first jump happens right away.",
      code: `steps(4, 'jump-start')(0.3) // => 0.5`,
      assert: () => {
        if (steps(4, 'jump-start')(0.3) !== 0.5) throw new Error('Expected 0.5');
      },
    },
  ],
};

export default examples;
