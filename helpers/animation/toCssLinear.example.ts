/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { spring } from './spring';
import { toCssLinear } from './toCssLinear';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'toCssLinear',
  category: 'animation',
  examples: [
    {
      title: 'Play a spring with the Web Animations API',
      description: 'Pass the spring duration and its sampled curve.',
      code: `const s = spring({ damping: 15 });
element.animate({ opacity: [0, 1] }, { duration: s.durationMs, easing: toCssLinear(s.easing) });`,
      assert: () => {
        if (!toCssLinear(spring({ damping: 15 }).easing).startsWith('linear(0, ')) throw new Error('Expected a linear() string');
      },
    },
    {
      title: 'Any custom curve',
      description: 'Fewer samples give a shorter string.',
      code: `toCssLinear((t) => t * t, 5) // => 'linear(0, 0.0625, 0.25, 0.5625, 1)'`,
      assert: () => {
        if (toCssLinear((t) => t * t, 5) !== 'linear(0, 0.0625, 0.25, 0.5625, 1)') throw new Error('Unexpected string');
      },
    },
  ],
};

export default examples;
