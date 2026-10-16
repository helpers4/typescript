/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { reverseSortFn } from './reverseSortFn';
import { combineSortFns } from './combineSortFns';
import { createSortByStringFn } from './sortBy';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'reverseSortFn',
  category: 'array',
  examples: [
    {
      title: 'Newest first',
      description: 'Turns an ascending comparator into a descending one.',
      code: `const releases = [{ date: '2026-01-01' }, { date: '2026-03-01' }];
releases.sort(reverseSortFn(createSortByStringFn('date')))
// => [{ date: '2026-03-01' }, { date: '2026-01-01' }]`,
      assert: () => {
        const releases = [{ date: '2026-01-01' }, { date: '2026-03-01' }];
        releases.sort(reverseSortFn(createSortByStringFn('date')));
        if (releases[0]?.date !== '2026-03-01') throw new Error('Expected newest first');
      },
    },
    {
      title: 'Mixed order',
      description: 'Newest first, then name ascending, by combining it with combineSortFns.',
      code: `rows.sort(combineSortFns(
  reverseSortFn(createSortByStringFn('date')),
  createSortByStringFn('name'),
))`,
      assert: () => {
        const rows = [
          { date: '2026-01-01', name: 'a' },
          { date: '2026-03-01', name: 'b' },
          { date: '2026-03-01', name: 'a' },
        ];
        rows.sort(combineSortFns(reverseSortFn(createSortByStringFn('date')), createSortByStringFn('name')));
        if (rows.map(r => r.date + r.name).join() !== '2026-03-01a,2026-03-01b,2026-01-01a') throw new Error('Unexpected order');
      },
    },
  ],
};

export default examples;
