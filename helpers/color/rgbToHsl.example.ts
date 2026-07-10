/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { rgbToHsl } from './rgbToHsl';

const examples: HelperExamples = {
  helper: 'rgbToHsl',
  category: 'color',
  examples: [
    {
      title: 'Convert an RGB color to HSL',
      description: 'Useful for generating tints/shades by adjusting lightness.',
      code: `rgbToHsl({ r: 255, g: 0, b: 0 })
// => { h: 0, s: 100, l: 50, a: 1 }`,
      assert: () => {
        const result = rgbToHsl({ r: 255, g: 0, b: 0 });
        if (result.h !== 0 || result.s !== 100 || result.l !== 50) throw new Error('Expected pure red HSL');
      },
    },
    {
      title: 'Grayscale colors have no saturation',
      description: 'When r, g, and b are equal, the color is achromatic (s = 0).',
      code: `rgbToHsl({ r: 128, g: 128, b: 128 })
// => { h: 0, s: 0, l: 50.2, a: 1 }`,
      assert: () => {
        const result = rgbToHsl({ r: 128, g: 128, b: 128 });
        if (result.s !== 0) throw new Error('Expected 0 saturation for a gray color');
      },
    },
  ],
};

export default examples;
