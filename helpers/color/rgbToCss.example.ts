/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { rgbToCss } from './rgbToCss';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'rgbToCss',
  category: 'color',
  examples: [
    {
      title: 'Opaque color',
      description: 'The alpha is left out.',
      code: `rgbToCss({ r: 255, g: 128, b: 0 }) // => 'rgb(255 128 0)'`,
      assert: () => {
        if (rgbToCss({ r: 255, g: 128, b: 0 }) !== 'rgb(255 128 0)') throw new Error('Unexpected CSS');
      },
    },
    {
      title: 'Translucent color',
      description: 'The alpha comes after a slash.',
      code: `rgbToCss({ r: 255, g: 128, b: 0, a: 0.5 }) // => 'rgb(255 128 0 / 0.5)'`,
      assert: () => {
        if (rgbToCss({ r: 255, g: 128, b: 0, a: 0.5 }) !== 'rgb(255 128 0 / 0.5)') throw new Error('Unexpected CSS');
      },
    },
  ],
};

export default examples;
