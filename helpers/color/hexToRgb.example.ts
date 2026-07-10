/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { hexToRgb } from './hexToRgb';

const examples: HelperExamples = {
  helper: 'hexToRgb',
  category: 'color',
  examples: [
    {
      title: 'Parse a hex color into RGB channels',
      description: 'The leading # is optional; shorthand 3/4-digit forms are also supported.',
      code: `hexToRgb('#ff0000')
// => { r: 255, g: 0, b: 0, a: 1 }`,
      assert: () => {
        const result = hexToRgb('#ff0000');
        if (!result || result.r !== 255 || result.g !== 0 || result.b !== 0) throw new Error('Expected opaque red');
      },
    },
    {
      title: 'Returns null for an invalid color',
      description: 'Lets you branch on parse failure instead of getting a garbage color.',
      code: `hexToRgb('not-a-color')
// => null`,
      assert: () => {
        if (hexToRgb('not-a-color') !== null) throw new Error('Expected null for invalid input');
      },
    },
  ],
};

export default examples;
