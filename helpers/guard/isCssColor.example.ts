/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isCssColor } from './isCssColor';

const examples: HelperExamples = {
  helper: 'isCssColor',
  category: 'guard',
  examples: [
    {
      title: 'Validate a color before writing it to inline style',
      description: 'Accepts hex, functional (rgb/rgba/hsl/hsla), and named colors.',
      code: `isCssColor('#ff0000')            // => true
isCssColor('rgba(0, 0, 0, 0.5)') // => true
isCssColor('rebeccapurple')      // => true
isCssColor(42)                   // => false`,
      assert: () => {
        if (!isCssColor('#ff0000')) throw new Error('Expected hex color to be valid');
        if (!isCssColor('rgba(0, 0, 0, 0.5)')) throw new Error('Expected rgba() color to be valid');
        if (!isCssColor('rebeccapurple')) throw new Error('Expected named color to be valid');
        if (isCssColor(42)) throw new Error('Expected non-string to be invalid');
      },
    },
    {
      title: 'Reject values that could inject extra CSS declarations',
      description: 'Guards against untrusted data smuggling a second declaration into a style attribute.',
      code: `isCssColor('red; background: url(evil)') // => false
isCssColor('red}body{color:blue')        // => false`,
      assert: () => {
        if (isCssColor('red; background: url(evil)')) throw new Error('Expected injection attempt to be rejected');
        if (isCssColor('red}body{color:blue')) throw new Error('Expected injection attempt to be rejected');
      },
    },
  ],
};

export default examples;
