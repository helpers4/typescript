/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { formatDate } from './formatDate';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'formatDate',
  category: 'date',
  examples: [
    {
      title: 'Stable short label',
      description: 'UTC and English by default, so the label is the same on every machine.',
      code: `formatDate('2026-07-27')
// => 'Jul 27, 2026'`,
      assert: () => {
        if (formatDate('2026-07-27') !== 'Jul 27, 2026') throw new Error('Unexpected result');
      },
    },
    {
      title: 'Custom fields and locale',
      description: 'The options replace the default format; the locale is the third argument.',
      code: `formatDate('2026-07-27', { month: 'short', day: 'numeric' })
// => 'Jul 27'
formatDate('2026-07-27', undefined, 'fr')
// => '27 juil. 2026'`,
      assert: () => {
        if (formatDate('2026-07-27', { month: 'short', day: 'numeric' }) !== 'Jul 27') throw new Error('fields');
        if (formatDate('2026-07-27', undefined, 'fr') !== '27 juil. 2026') throw new Error('locale');
      },
    },
  ],
};

export default examples;
