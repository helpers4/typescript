/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { select } from './select';

const examples: HelperExamples = {
  helper: 'select',
  category: 'array',
  examples: [
    {
      title: 'Filter and transform in one pass',
      description:
        'Keeps only items matching the condition and transforms them — ' +
        'equivalent to .filter().map() but with a single iteration.',
      code: `select([1, 2, 3, 4, 5], x => x * 2, x => x % 2 === 0)
// => [4, 8]`,
      assert: () => {
        const result = select([1, 2, 3, 4, 5], x => x * 2, x => x % 2 === 0);
        if (result.length !== 2 || result[0] !== 4 || result[1] !== 8) {
          throw new Error('Expected [4, 8]');
        }
      },
    },
    {
      title: 'Extract a field from matching objects',
      description: 'Filter on a condition and pluck a specific property in a single readable call.',
      code: `const users = [
  { name: 'Alice', active: true },
  { name: 'Bob',   active: false },
  { name: 'Carol', active: true },
];
select(users, u => u.name, u => u.active)
// => ['Alice', 'Carol']`,
      assert: () => {
        const users = [
          { name: 'Alice', active: true },
          { name: 'Bob', active: false },
          { name: 'Carol', active: true },
        ];
        const result = select(users, u => u.name, u => u.active);
        if (result.length !== 2 || result[0] !== 'Alice' || result[1] !== 'Carol') {
          throw new Error('Expected [\'Alice\', \'Carol\']');
        }
      },
    },
  ],
};

export default examples;
