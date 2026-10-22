/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { filter } from './filter';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'filter',
  category: 'set',
  examples: [
    {
      title: 'Keep only even values',
      description: 'Creates a new Set with only the values that satisfy the predicate.',
      code: `filter(new Set([1, 2, 3, 4]), value => value % 2 === 0)
// => Set(2) { 2, 4 }`,
      assert: () => {
        const result = filter(new Set([1, 2, 3, 4]), (v) => v % 2 === 0);
        if (result.size !== 2 || !result.has(2) || !result.has(4)) throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
