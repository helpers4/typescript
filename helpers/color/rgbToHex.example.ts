/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { rgbToHex } from './rgbToHex';

const examples: HelperExamples = {
  helper: 'rgbToHex',
  category: 'color',
  examples: [
    {
      title: 'Format an opaque color as hex',
      description: 'Alpha defaults to 1 (opaque) and is omitted from the output.',
      code: `rgbToHex({ r: 255, g: 0, b: 0 })
// => '#ff0000'`,
      assert: () => {
        if (rgbToHex({ r: 255, g: 0, b: 0 }) !== '#ff0000') throw new Error('Expected #ff0000');
      },
    },
    {
      title: 'Include alpha when the color is translucent',
      description: 'A non-opaque color formats as an 8-digit #rrggbbaa string.',
      code: `rgbToHex({ r: 0, g: 255, b: 0, a: 0.5 })
// => '#00ff0080'`,
      assert: () => {
        if (rgbToHex({ r: 0, g: 255, b: 0, a: 0.5 }) !== '#00ff0080') throw new Error('Expected #00ff0080');
      },
    },
  ],
};

export default examples;
