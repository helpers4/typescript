/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { equalsDeep } from './equalsDeep';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'equalsDeep',
  category: 'array',
  examples: [
    {
      title: 'Compare nested arrays',
      description: 'Deeply compares two arrays including nested structures.',
      code: `equalsDeep([[1, 2], [3]], [[1, 2], [3]])
// => true`,
      assert: () => {
        if (!equalsDeep([[1, 2], [3]], [[1, 2], [3]])) throw new Error('Expected true');
      },
    },
    {
      title: 'Detect nested differences',
      description: 'Returns false when nested arrays differ.',
      code: `equalsDeep([[1, 2]], [[1, 3]])
// => false`,
      assert: () => {
        if (equalsDeep([[1, 2]], [[1, 3]])) throw new Error('Expected false');
      },
    },
  ],
};

export default examples;
