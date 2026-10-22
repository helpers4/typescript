/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { percentageToTier } from './percentageToTier';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'percentageToTier',
  category: 'ci',
  examples: [
    {
      title: 'Coverage report tier',
      description: 'Maps a coverage percentage to a tier using the built-in default thresholds.',
      code: `percentageToTier(95.2)
// => { min: 90, icon: '🟢', color: 'green', label: 'excellent' }

percentageToTier(42)
// => { min: 0, icon: '🔴', color: 'red', label: 'poor' }`,
      assert: () => {
        if (percentageToTier(95.2).label !== 'excellent') throw new Error('Expected excellent');
        if (percentageToTier(42).label !== 'poor') throw new Error('Expected poor');
      },
    },
    {
      title: 'Custom pass/fail tiers',
      description: 'Supply your own tiers, e.g. a simple two-tier pass/fail gate.',
      code: `const tiers = [
  { min: 50, icon: '🟢', color: 'green', label: 'pass' },
  { min: 0, icon: '🔴', color: 'red', label: 'fail' },
];

percentageToTier(75, tiers)  // => { min: 50, icon: '🟢', color: 'green', label: 'pass' }
percentageToTier(25, tiers)  // => { min: 0, icon: '🔴', color: 'red', label: 'fail' }`,
      assert: () => {
        const tiers = [
          { min: 50, icon: '🟢', color: 'green', label: 'pass' },
          { min: 0, icon: '🔴', color: 'red', label: 'fail' },
        ];
        if (percentageToTier(75, tiers).label !== 'pass') throw new Error('Expected pass');
        if (percentageToTier(25, tiers).label !== 'fail') throw new Error('Expected fail');
      },
    },
  ],
};

export default examples;
