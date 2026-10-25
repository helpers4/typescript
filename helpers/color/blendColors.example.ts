/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { blendColors } from './blendColors';

const examples: HelperExamples = {
  helper: 'blendColors',
  category: 'color',
  examples: [
    {
      title: 'Paint a half-transparent color over another',
      description: 'The default normal mode is a plain alpha composite.',
      code: `blendColors({ r: 255, g: 0, b: 0 }, { r: 0, g: 0, b: 255, a: 0.5 })
// => { r: 128, g: 0, b: 128, a: 1 }`,
      assert: () => {
        const out = blendColors({ r: 255, g: 0, b: 0 }, { r: 0, g: 0, b: 255, a: 0.5 });
        if (out.r !== 128 || out.b !== 128 || out.a !== 1) throw new Error('Expected purple');
      },
    },
    {
      title: 'Use a CSS blend mode',
      description: 'Same maths as mix-blend-mode, handy to compute what the browser would paint.',
      code: `blendColors({ r: 200, g: 100, b: 50 }, { r: 100, g: 100, b: 100 }, 'multiply')
// => { r: 78, g: 39, b: 20, a: 1 }`,
      assert: () => {
        const out = blendColors({ r: 200, g: 100, b: 50 }, { r: 100, g: 100, b: 100 }, 'multiply');
        if (out.r !== 78 || out.g !== 39 || out.b !== 20) throw new Error('Expected a multiplied color');
      },
    },
  ],
};

export default examples;
