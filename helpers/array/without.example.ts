/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { without } from './without';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'without',
  category: 'array',
  examples: [
    {
      title: 'Remove a single value',
      description: 'Returns a new array with all occurrences of the given value removed.',
      code: `without([1, 2, 3, 2, 4], 2)
// => [1, 3, 4]`,
      assert: () => {
        const result = without([1, 2, 3, 2, 4], 2);
        if (JSON.stringify(result) !== JSON.stringify([1, 3, 4])) throw new Error('Unexpected result');
      },
    },
    {
      title: 'Remove multiple values',
      description: 'All listed values are excluded from the result.',
      code: `without([1, 2, 3, 2, 4], 2, 3)
// => [1, 4]`,
      assert: () => {
        const result = without([1, 2, 3, 2, 4], 2, 3);
        if (JSON.stringify(result) !== JSON.stringify([1, 4])) throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
