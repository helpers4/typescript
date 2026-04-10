/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { shallowEquals } from './shallowEquals';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'shallowEquals',
  category: 'array',
  examples: [
    {
      title: 'Compare identical arrays',
      description: 'Uses JSON.stringify for a fast shallow comparison.',
      code: `shallowEquals([1, 2, 3], [1, 2, 3])
// => true`,
      assert: () => {
        if (!shallowEquals([1, 2, 3], [1, 2, 3])) throw new Error('Expected true');
      },
    },
    {
      title: 'Detect order differences',
      description: 'Unlike equals, shallowEquals is order-sensitive.',
      code: `shallowEquals([1, 2], [2, 1])
// => false`,
      assert: () => {
        if (shallowEquals([1, 2], [2, 1])) throw new Error('Expected false');
      },
    },
  ],
};

export default examples;
