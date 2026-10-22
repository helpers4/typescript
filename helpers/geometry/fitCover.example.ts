/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { fitCover } from './fitCover';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'fitCover',
  category: 'geometry',
  examples: [
    {
      title: 'Fill a viewport',
      description: 'The content overflows and is cropped on two sides.',
      code: `fitCover({ width: 200, height: 100 }, { width: 100, height: 100 }) // => { scale: 1, x: -50, y: 0 }`,
      assert: () => {
        const fit = fitCover({ width: 200, height: 100 }, { width: 100, height: 100 });
        if (fit.scale !== 1 || fit.x !== -50) throw new Error('Unexpected fit');
      },
    },
    {
      title: 'Tall content',
      description: 'Cropped at the top and bottom.',
      code: `fitCover({ width: 10, height: 20 }, { width: 100, height: 100 }) // => { scale: 10, x: 0, y: -50 }`,
      assert: () => {
        const fit = fitCover({ width: 10, height: 20 }, { width: 100, height: 100 });
        if (fit.scale !== 10 || fit.y !== -50) throw new Error('Unexpected fit');
      },
    },
  ],
};

export default examples;
