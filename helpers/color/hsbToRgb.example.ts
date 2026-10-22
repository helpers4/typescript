/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { hsbToRgb } from './hsbToRgb';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'hsbToRgb',
  category: 'color',
  examples: [
    {
      title: 'Convert a design tool color',
      description: 'From the HSB values of a color picker to RGB.',
      code: `hsbToRgb({ h: 0, s: 100, b: 100 }) // => { r: 255, g: 0, b: 0, a: 1 }`,
      assert: () => {
        const rgb = hsbToRgb({ h: 0, s: 100, b: 100 });
        if (rgb.r !== 255 || rgb.g !== 0 || rgb.b !== 0) throw new Error('Expected red');
      },
    },
    {
      title: 'Darker shade',
      description: 'Lower the brightness to darken without changing the hue.',
      code: `hsbToRgb({ h: 120, s: 100, b: 50 }) // => { r: 0, g: 128, b: 0, a: 1 }`,
      assert: () => {
        const rgb = hsbToRgb({ h: 120, s: 100, b: 50 });
        if (rgb.g !== 128 || rgb.r !== 0) throw new Error('Expected dark green');
      },
    },
  ],
};

export default examples;
