/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { relativeLuminance } from './relativeLuminance';

const examples: HelperExamples = {
  helper: 'relativeLuminance',
  category: 'color',
  examples: [
    {
      title: 'Measure how bright a color is',
      description: 'Black is 0, white is 1, and green weighs the most of the three primaries.',
      code: `relativeLuminance({ r: 0, g: 0, b: 0 }) // => 0
relativeLuminance({ r: 0, g: 255, b: 0 }) // => 0.7152`,
      assert: () => {
        if (relativeLuminance({ r: 0, g: 0, b: 0 }) !== 0) throw new Error('Expected 0 for black');
        if (Math.abs(relativeLuminance({ r: 0, g: 255, b: 0 }) - 0.7152) > 1e-9) throw new Error('Expected 0.7152 for green');
      },
    },
    {
      title: 'Pick light or dark text for a background',
      description: 'A background brighter than about 0.18 takes dark text better than white text.',
      code: `relativeLuminance({ r: 255, g: 220, b: 0 }) > 0.18 // => true`,
      assert: () => {
        if (!(relativeLuminance({ r: 255, g: 220, b: 0 }) > 0.18)) throw new Error('Expected a bright yellow');
      },
    },
  ],
};

export default examples;
