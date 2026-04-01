/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { oneInCommon } from './oneInCommon';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'oneInCommon',
  category: 'array',
  examples: [
    {
      title: 'Detect shared element',
      description: 'Returns true when at least one element is shared between both arrays.',
      code: `oneInCommon([1, 2, 3], [3, 4, 5])
// => true`,
      assert: () => {
        if (!oneInCommon([1, 2, 3], [3, 4, 5])) throw new Error('Expected true');
      },
    },
    {
      title: 'No common elements',
      description: 'Returns false when no elements are shared.',
      code: `oneInCommon([1, 2], [3, 4])
// => false`,
      assert: () => {
        if (oneInCommon([1, 2], [3, 4])) throw new Error('Expected false');
      },
    },
  ],
};

export default examples;
