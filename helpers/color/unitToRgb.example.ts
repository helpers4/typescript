/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { rgbToHex } from './rgbToHex';
import { unitToRgb } from './unitToRgb';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'unitToRgb',
  category: 'color',
  examples: [
    {
      title: 'Read a design tool color',
      description: 'Figma, Sketch and Penpot store channels from 0 to 1.',
      code: `rgbToHex(unitToRgb({ r: 1, g: 0.5, b: 0, a: 0.5 })) // => '#ff800080'`,
      assert: () => {
        if (rgbToHex(unitToRgb({ r: 1, g: 0.5, b: 0, a: 0.5 })) !== '#ff800080') throw new Error('Expected #ff800080');
      },
    },
  ],
};

export default examples;
