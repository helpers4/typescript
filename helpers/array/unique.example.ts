/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { unique } from './unique';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'unique',
  category: 'array',
  examples: [
    {
      title: 'Remove duplicates',
      description: 'Returns a new array with duplicate values removed.',
      code: `unique([1, 2, 2, 3, 3, 3])
// => [1, 2, 3]`,
      assert: () => {
        const result = unique([1, 2, 2, 3, 3, 3]);
        if (result.length !== 3) throw new Error(`Expected 3 unique values, got ${result.length}`);
      },
    },
  ],
};

export default examples;
