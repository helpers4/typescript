/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { hslToRgb } from './hslToRgb';

const examples: HelperExamples = {
  helper: 'hslToRgb',
  category: 'color',
  examples: [
    {
      title: 'Convert an HSL color to RGB',
      description: 'Useful after generating a hue programmatically (e.g. evenly spaced chart colors).',
      code: `hslToRgb({ h: 120, s: 100, l: 50 })
// => { r: 0, g: 255, b: 0, a: 1 }`,
      assert: () => {
        const result = hslToRgb({ h: 120, s: 100, l: 50 });
        if (result.r !== 0 || result.g !== 255 || result.b !== 0) throw new Error('Expected pure green');
      },
    },
    {
      title: 'Hue wraps around 360 degrees',
      description: 'Negative or out-of-range hues are normalized before conversion.',
      code: `hslToRgb({ h: -360, s: 100, l: 50 })
// => { r: 255, g: 0, b: 0, a: 1 }  (same as h: 0)`,
      assert: () => {
        const result = hslToRgb({ h: -360, s: 100, l: 50 });
        if (result.r !== 255 || result.g !== 0 || result.b !== 0) throw new Error('Expected hue to wrap to red');
      },
    },
  ],
};

export default examples;
