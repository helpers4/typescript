/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { deepCompare } from './deepCompare';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'deepCompare',
  category: 'array',
  examples: [
    {
      title: 'Compare nested arrays',
      description: 'Deeply compares two arrays including nested structures.',
      code: `deepCompare([[1, 2], [3]], [[1, 2], [3]])
// => true`,
      assert: () => {
        if (!deepCompare([[1, 2], [3]], [[1, 2], [3]])) throw new Error('Expected true');
      },
    },
    {
      title: 'Detect nested differences',
      description: 'Returns false when nested arrays differ.',
      code: `deepCompare([[1, 2]], [[1, 3]])
// => false`,
      assert: () => {
        if (deepCompare([[1, 2]], [[1, 3]])) throw new Error('Expected false');
      },
    },
  ],
};

export default examples;
