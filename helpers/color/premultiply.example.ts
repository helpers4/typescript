/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { premultiply } from './premultiply';

const examples: HelperExamples = {
  helper: 'premultiply',
  category: 'color',
  examples: [
    {
      title: 'Premultiply a half-transparent color',
      description: 'The channels are scaled by the alpha, the form GPU blending and canvas pixels use.',
      code: `premultiply({ r: 255, g: 100, b: 0, a: 0.5 })
// => { r: 127.5, g: 50, b: 0, a: 0.5 }`,
      assert: () => {
        const out = premultiply({ r: 255, g: 100, b: 0, a: 0.5 });
        if (out.r !== 127.5 || out.g !== 50 || out.a !== 0.5) throw new Error('Expected a premultiplied color');
      },
    },
    {
      title: 'An opaque color is unchanged',
      description: 'A missing alpha counts as 1.',
      code: `premultiply({ r: 10, g: 20, b: 30 })
// => { r: 10, g: 20, b: 30, a: 1 }`,
      assert: () => {
        const out = premultiply({ r: 10, g: 20, b: 30 });
        if (out.r !== 10 || out.a !== 1) throw new Error('Expected an unchanged color');
      },
    },
  ],
};

export default examples;
