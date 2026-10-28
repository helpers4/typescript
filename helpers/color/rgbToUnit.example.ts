/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { rgbToUnit } from './rgbToUnit';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'rgbToUnit',
  category: 'color',
  examples: [
    {
      title: 'Write a design tool color',
      description: 'Channels from 0 to 1, alpha unchanged.',
      code: `rgbToUnit({ r: 255, g: 51, b: 0 }) // => { r: 1, g: 0.2, b: 0, a: 1 }`,
      assert: () => {
        const c = rgbToUnit({ r: 255, g: 51, b: 0 });
        if (c.r !== 1 || c.g !== 0.2 || c.b !== 0) throw new Error('Unexpected channels');
      },
    },
  ],
};

export default examples;
