/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { isDefinedAndNotNull } from './isDefinedAndNotNull';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isDefinedAndNotNull',
  category: 'function',
  examples: [
    {
      title: 'Check defined values',
      description: 'Returns true for values that are neither undefined nor null.',
      code: `isDefinedAndNotNull(42)    // => true
isDefinedAndNotNull('')    // => true
isDefinedAndNotNull(null)  // => false`,
      assert: () => {
        if (!isDefinedAndNotNull(42)) throw new Error('Expected true for 42');
        if (!isDefinedAndNotNull('')) throw new Error('Expected true for empty string');
        if (isDefinedAndNotNull(null)) throw new Error('Expected false for null');
        if (isDefinedAndNotNull(undefined)) throw new Error('Expected false for undefined');
      },
    },
  ],
};

export default examples;
