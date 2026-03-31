/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { safeDate } from './safeDate';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'safeDate',
  category: 'date',
  examples: [
    {
      title: 'Parse a valid date string',
      description: 'Returns a Date object from a valid ISO string.',
      code: `safeDate('2025-01-19T12:00:00Z')
// => Date(2025-01-19T12:00:00.000Z)`,
      assert: () => {
        const result = safeDate('2025-01-19T12:00:00Z');
        if (!result || result.toISOString() !== '2025-01-19T12:00:00.000Z') throw new Error('Unexpected result');
      },
    },
    {
      title: 'Return null for invalid input',
      description: 'Returns null when the input cannot produce a valid Date.',
      code: `safeDate(null)
// => null`,
      assert: () => {
        if (safeDate(null) !== null) throw new Error('Expected null');
      },
    },
  ],
};

export default examples;
