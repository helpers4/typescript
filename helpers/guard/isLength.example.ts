/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isLength } from './isLength';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isLength',
  category: 'guard',
  examples: [
    {
      title: 'Validate an array-like length before indexing',
      description: 'Guards against negative, fractional, or unsafe length values.',
      code: `isLength(3)   // => true
isLength(-1)  // => false
isLength(1.5) // => false`,
      assert: () => {
        if (!isLength(3) || isLength(-1) || isLength(1.5)) throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
