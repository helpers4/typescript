/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isoWeek } from './isoWeek';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isoWeek',
  category: 'date',
  examples: [
    {
      title: 'Week number of a date',
      description: 'Weeks start on Monday and week 1 contains the first Thursday of the year.',
      code: `isoWeek('2026-06-15')
// => { year: 2026, week: 25 }`,
      assert: () => {
        const r = isoWeek('2026-06-15');
        if (r?.year !== 2026 || r.week !== 25) throw new Error('Unexpected result');
      },
    },
    {
      title: 'Year boundary',
      description: 'The first days of January can belong to the last week of the previous year.',
      code: `isoWeek('2027-01-01')
// => { year: 2026, week: 53 }`,
      assert: () => {
        const r = isoWeek('2027-01-01');
        if (r?.year !== 2026 || r.week !== 53) throw new Error('Unexpected result');
      },
    },
    {
      title: 'Invalid date',
      description: 'Returns null instead of throwing.',
      code: `isoWeek('not a date')
// => null`,
      assert: () => {
        if (isoWeek('not a date') !== null) throw new Error('Expected null');
      },
    },
  ],
};

export default examples;
