/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { cssEasing } from './cssEasing';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'cssEasing',
  category: 'animation',
  examples: [
    {
      title: 'Easing exported by a design tool',
      description: 'Turn a CSS keyword into a function.',
      code: `const easing = cssEasing('ease-out');
easing(0.5) // => 0.6846...`,
      assert: () => {
        if (Math.abs(cssEasing('ease-out')(0.5) - 0.6846) > 1e-4) throw new Error('Expected 0.6846');
      },
    },
    {
      title: 'Symmetric curve',
      description: 'ease-in-out is halfway at mid-time.',
      code: `cssEasing('ease-in-out')(0.5) // => 0.5`,
      assert: () => {
        if (Math.abs(cssEasing('ease-in-out')(0.5) - 0.5) > 1e-6) throw new Error('Expected 0.5');
      },
    },
  ],
};

export default examples;
