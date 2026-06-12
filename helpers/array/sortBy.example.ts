/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { createSortByStringFn } from './sortBy';

const examples: HelperExamples = {
  helper: 'createSortByStringFn',
  category: 'array',
  examples: [
    {
      title: 'Sort objects by string property',
      description: 'Use createSortByStringFn to sort objects by a specific string property.',
      code: `const items = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];
items.sort(createSortByStringFn('name'))
// => [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }]`,
      assert: () => {
        const items = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];
        items.sort(createSortByStringFn('name'));
        if (items[0].name !== 'Alice') throw new Error('Unexpected order');
      },
    },
    {
      title: 'Sort objects by multiple keys',
      description: 'Pass an array of keys; ties on the first key are broken by the next.',
      code: `const rows = [
  { dept: 'B', name: 'Alice' },
  { dept: 'A', name: 'Zoe' },
  { dept: 'B', name: 'Adam' },
  { dept: 'A', name: 'Anna' },
];
rows.sort(createSortByStringFn(['dept', 'name'] as const))
// => A:Anna, A:Zoe, B:Adam, B:Alice`,
      assert: () => {
        const rows = [
          { dept: 'B', name: 'Alice' },
          { dept: 'A', name: 'Zoe' },
          { dept: 'B', name: 'Adam' },
          { dept: 'A', name: 'Anna' },
        ];
        rows.sort(createSortByStringFn(['dept', 'name'] as const));
        if (rows[0].name !== 'Anna') throw new Error('Unexpected order');
      },
    },
  ],
};

export default examples;
