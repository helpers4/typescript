/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { cubicBezier } from './cubicBezier';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'cubicBezier',
  category: 'animation',
  examples: [
    {
      title: 'Play a CSS curve in JavaScript',
      description: 'Same result as cubic-bezier() in CSS, e.g. to drive a canvas animation.',
      code: `const ease = cubicBezier(0.25, 0.1, 0.25, 1); // CSS ease
ease(0.5) // => 0.8024...`,
      assert: () => {
        if (Math.abs(cubicBezier(0.25, 0.1, 0.25, 1)(0.5) - 0.8024) > 1e-4) throw new Error('Expected 0.8024');
      },
    },
    {
      title: 'Overshoot',
      description: 'y control points outside [0, 1] make the animation go past its target and come back.',
      code: `const back = cubicBezier(0.34, 1.56, 0.64, 1);
back(0.5) > 1 // => true`,
      assert: () => {
        if (!(cubicBezier(0.34, 1.56, 0.64, 1)(0.5) > 1)) throw new Error('Expected an overshoot');
      },
    },
  ],
};

export default examples;
