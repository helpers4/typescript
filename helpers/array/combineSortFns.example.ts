/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { combineSortFns } from './combineSortFns';
import { createSortByBooleanFn } from './createSortByBooleanFn';
import { createSortByStringFn } from './sortBy';

const examples: HelperExamples = {
  helper: 'combineSortFns',
  category: 'array',
  examples: [
    {
      title: 'Default items first, then alphabetical',
      description: 'Chain a boolean comparator with a string comparator to break ties.',
      code: `const items = [
  { isDefault: false, label: 'Bob' },
  { isDefault: true, label: 'Zoe' },
  { isDefault: false, label: 'Alice' },
];
items.sort(combineSortFns(
  createSortByBooleanFn('isDefault'),
  createSortByStringFn('label'),
))
// => [Zoe (default), Alice, Bob]`,
      assert: () => {
        const items = [
          { isDefault: false, label: 'Bob' },
          { isDefault: true, label: 'Zoe' },
          { isDefault: false, label: 'Alice' },
        ];
        items.sort(combineSortFns(createSortByBooleanFn('isDefault'), createSortByStringFn('label')));
        if (items.map((i) => i.label).join(',') !== 'Zoe,Alice,Bob') throw new Error('Unexpected order');
      },
    },
    {
      title: 'Falls through when the first comparator ties',
      description: 'A `0` result from the first function moves on to the next one.',
      code: `const rows = [{ a: 1, b: 2 }, { a: 1, b: 1 }];
rows.sort(combineSortFns<{ a: number; b: number }>(
  (x, y) => x.a - y.a,
  (x, y) => x.b - y.b,
))
// => [{ a: 1, b: 1 }, { a: 1, b: 2 }]`,
      assert: () => {
        const rows = [
          { a: 1, b: 2 },
          { a: 1, b: 1 },
        ];
        rows.sort(
          combineSortFns<{ a: number; b: number }>(
            (x, y) => x.a - y.a,
            (x, y) => x.b - y.b,
          ),
        );
        if (rows[0]!.b !== 1) throw new Error('Unexpected order');
      },
    },
  ],
};

export default examples;
