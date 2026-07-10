/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { argbToRgb } from './argbToRgb';

const examples: HelperExamples = {
  helper: 'argbToRgb',
  category: 'color',
  examples: [
    {
      title: 'Convert a packed ARGB integer to a CSS color',
      description: 'The top byte (alpha) is discarded — the result is always opaque.',
      code: `argbToRgb(0xffff0000)
// => 'rgb(255,0,0)'`,
      assert: () => {
        if (argbToRgb(0xffff0000) !== 'rgb(255,0,0)') throw new Error('Expected opaque red');
      },
    },
    {
      title: 'Alpha byte does not affect the result',
      description: 'Two ARGB values differing only in the alpha byte produce the same rgb() string.',
      code: `argbToRgb(0x00ff0000) === argbToRgb(0x80ff0000)
// => true`,
      assert: () => {
        if (argbToRgb(0x00ff0000) !== argbToRgb(0x80ff0000)) throw new Error('Expected alpha byte to be ignored');
      },
    },
  ],
};

export default examples;
