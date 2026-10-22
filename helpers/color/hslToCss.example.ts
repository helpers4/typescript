/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { hslToCss } from './hslToCss';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'hslToCss',
  category: 'color',
  examples: [
    {
      title: 'Opaque color',
      description: 'The alpha is left out.',
      code: `hslToCss({ h: 210, s: 100, l: 50 }) // => 'hsl(210 100% 50%)'`,
      assert: () => {
        if (hslToCss({ h: 210, s: 100, l: 50 }) !== 'hsl(210 100% 50%)') throw new Error('Unexpected CSS');
      },
    },
    {
      title: 'Translucent color with a negative hue',
      description: 'The hue is wrapped into 0-360 and the alpha comes after a slash.',
      code: `hslToCss({ h: -30, s: 80, l: 40, a: 0.25 }) // => 'hsl(330 80% 40% / 0.25)'`,
      assert: () => {
        if (hslToCss({ h: -30, s: 80, l: 40, a: 0.25 }) !== 'hsl(330 80% 40% / 0.25)') throw new Error('Unexpected CSS');
      },
    },
  ],
};

export default examples;
