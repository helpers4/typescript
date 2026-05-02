/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { intersects } from './intersects';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'intersects',
  category: 'array',
  examples: [
    {
      title: 'Detect shared element',
      description: 'Returns true when at least one element is shared between both arrays.',
      code: `intersects([1, 2, 3], [3, 4, 5])
// => true`,
      assert: () => {
        if (!intersects([1, 2, 3], [3, 4, 5])) throw new Error('Expected true');
      },
    },
    {
      title: 'No common elements',
      description: 'Returns false when no elements are shared.',
      code: `intersects([1, 2], [3, 4])
// => false`,
      assert: () => {
        if (intersects([1, 2], [3, 4])) throw new Error('Expected false');
      },
    },
  ],
};

export default examples;
