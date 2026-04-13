/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isNotNullish } from './isNotNullish';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isNotNullish',
  category: 'function',
  examples: [
    {
      title: 'Check defined values',
      description: 'Returns true for values that are neither undefined nor null.',
      code: `isNotNullish(42)    // => true
isNotNullish('')    // => true
isNotNullish(null)  // => false`,
      assert: () => {
        if (!isNotNullish(42)) throw new Error('Expected true for 42');
        if (!isNotNullish('')) throw new Error('Expected true for empty string');
        if (isNotNullish(null)) throw new Error('Expected false for null');
        if (isNotNullish(undefined)) throw new Error('Expected false for undefined');
      },
    },
  ],
};

export default examples;
