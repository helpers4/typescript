/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { unpremultiply } from './unpremultiply';

const examples: HelperExamples = {
  helper: 'unpremultiply',
  category: 'color',
  examples: [
    {
      title: 'Recover the straight color',
      description: 'Divides the channels by the alpha, the inverse of premultiply.',
      code: `unpremultiply({ r: 127.5, g: 50, b: 0, a: 0.5 })
// => { r: 255, g: 100, b: 0, a: 0.5 }`,
      assert: () => {
        const out = unpremultiply({ r: 127.5, g: 50, b: 0, a: 0.5 });
        if (out.r !== 255 || out.g !== 100 || out.a !== 0.5) throw new Error('Expected the straight color');
      },
    },
    {
      title: 'A transparent color becomes transparent black',
      description: 'The channels are lost at alpha 0, so there is nothing to recover.',
      code: `unpremultiply({ r: 0, g: 0, b: 0, a: 0 })
// => { r: 0, g: 0, b: 0, a: 0 }`,
      assert: () => {
        const out = unpremultiply({ r: 0, g: 0, b: 0, a: 0 });
        if (out.r !== 0 || out.a !== 0) throw new Error('Expected transparent black');
      },
    },
  ],
};

export default examples;
