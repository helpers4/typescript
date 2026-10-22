/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { parseEasing } from './parseEasing';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'parseEasing',
  category: 'animation',
  examples: [
    {
      title: 'Play an exported CSS easing in JavaScript',
      description: 'Keywords, cubic-bezier(), steps() and linear() are all read.',
      code: `parseEasing('ease-out')!(0.5)               // => 0.6846...
parseEasing('steps(4, jump-start)')!(0.3)   // => 0.5
parseEasing('linear(0, 0.9 50%, 1)')!(0.25) // => 0.45`,
      assert: () => {
        if (Math.abs(parseEasing('ease-out')!(0.5) - 0.6846) > 1e-4) throw new Error('Expected 0.6846');
        if (parseEasing('steps(4, jump-start)')!(0.3) !== 0.5) throw new Error('Expected 0.5');
      },
    },
    {
      title: 'Reject unknown easings',
      description: 'Anything that is not a CSS easing gives null.',
      code: `parseEasing('bounce') // => null`,
      assert: () => {
        if (parseEasing('bounce') !== null) throw new Error('Expected null');
      },
    },
  ],
};

export default examples;
