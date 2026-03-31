/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { difference } from './difference';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'difference',
  category: 'array',
  examples: [
    {
      title: 'Get items only in the first array',
      description: 'Returns elements present in the first array but not in the second.',
      code: `difference([1, 2, 3, 4], [2, 4])
// => [1, 3]`,
      assert: () => {
        const result = difference([1, 2, 3, 4], [2, 4]);
        if (result.length !== 2 || result[0] !== 1 || result[1] !== 3) throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
