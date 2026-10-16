/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { parsePartialDate } from './parsePartialDate';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'parsePartialDate',
  category: 'date',
  examples: [
    {
      title: 'Year and month only',
      description: 'A partial date is anchored in the middle of its period so it sorts next to full dates.',
      code: `parsePartialDate('2008')    // => { date: 2008-07-01, precision: 'year' }
parsePartialDate('2008-03') // => { date: 2008-03-15, precision: 'month' }`,
      assert: () => {
        const y = parsePartialDate('2008');
        const m = parsePartialDate('2008-03');
        if (y?.date.toISOString() !== '2008-07-01T00:00:00.000Z' || y.precision !== 'year') throw new Error('Unexpected year');
        if (m?.date.toISOString() !== '2008-03-15T00:00:00.000Z' || m.precision !== 'month') throw new Error('Unexpected month');
      },
    },
    {
      title: 'Invalid input',
      description: 'A month or day that does not exist gives null.',
      code: `parsePartialDate('2008-02-30') // => null`,
      assert: () => {
        if (parsePartialDate('2008-02-30') !== null) throw new Error('Expected null');
      },
    },
  ],
};

export default examples;
