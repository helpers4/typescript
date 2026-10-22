/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { rgbToHsb } from './rgbToHsb';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'rgbToHsb',
  category: 'color',
  examples: [
    {
      title: 'Show a color like a design tool picker',
      description: 'Pure colors have a brightness of 100.',
      code: `rgbToHsb({ r: 255, g: 0, b: 0 }) // => { h: 0, s: 100, b: 100, a: 1 }`,
      assert: () => {
        const hsb = rgbToHsb({ r: 255, g: 0, b: 0 });
        if (hsb.h !== 0 || hsb.s !== 100 || hsb.b !== 100) throw new Error('Expected { h: 0, s: 100, b: 100 }');
      },
    },
    {
      title: 'White versus HSL',
      description: 'White is saturation 0 and brightness 100 (HSL would say lightness 100).',
      code: `rgbToHsb({ r: 255, g: 255, b: 255 }) // => { h: 0, s: 0, b: 100, a: 1 }`,
      assert: () => {
        const hsb = rgbToHsb({ r: 255, g: 255, b: 255 });
        if (hsb.s !== 0 || hsb.b !== 100) throw new Error('Expected s 0, b 100');
      },
    },
  ],
};

export default examples;
