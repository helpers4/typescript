/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { compare } from './compare';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'compare',
  category: 'date',
  examples: [
    {
      title: 'Compare dates with millisecond precision',
      description: 'By default, two identical Date objects are equal.',
      code: `const d = new Date('2025-01-19T12:00:00Z');
compare(d, new Date('2025-01-19T12:00:00Z'))
// => true`,
      assert: () => {
        const d = new Date('2025-01-19T12:00:00Z');
        if (!compare(d, new Date('2025-01-19T12:00:00Z'))) throw new Error('Expected true');
      },
    },
    {
      title: 'Compare only by day',
      description: 'Using day precision ignores the time part.',
      code: `compare(
  new Date('2025-01-19T08:00:00Z'),
  new Date('2025-01-19T23:59:59Z'),
  { precision: 'days' }
)
// => true`,
      assert: () => {
        if (!compare(
          new Date('2025-01-19T08:00:00Z'),
          new Date('2025-01-19T23:59:59Z'),
          { precision: 'days' }
        )) throw new Error('Expected true');
      },
    },
  ],
};

export default examples;
