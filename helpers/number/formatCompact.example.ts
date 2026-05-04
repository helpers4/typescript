/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { formatCompact } from './formatCompact';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'formatCompact',
  category: 'number',
  examples: [
    {
      title: 'Compact large numbers',
      description: 'Formats a number using K / M suffixes for readability.',
      code: `formatCompact(1_500_000, 'en') // => '1.5M'
formatCompact(1_000, 'en')     // => '1K'
formatCompact(999, 'en')       // => '999'`,
      assert: () => {
        if (formatCompact(1_500_000, 'en') !== '1.5M') throw new Error('Expected 1.5M');
        if (formatCompact(1_000, 'en') !== '1K') throw new Error('Expected 1K');
        if (formatCompact(999, 'en') !== '999') throw new Error('Expected 999');
      },
    },
    {
      title: 'Locale-aware formatting',
      description: 'Uses the provided locale for the decimal separator and suffix.',
      code: `formatCompact(1_500_000, 'fr') // => '1,5\u00a0M'`,
      assert: () => {
        const result = formatCompact(1_500_000, 'fr');
        if (!result.includes('M')) throw new Error('Expected M suffix');
      },
    },
  ],
};

export default examples;
