/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';

import { DEFAULT_PERCENTAGE_TIERS, percentageToTier } from './percentageToTier';

describe('percentageToTier', () => {
  bench('default tiers, perfect value', () => {
    percentageToTier(100, DEFAULT_PERCENTAGE_TIERS);
  });

  bench('default tiers, excellent value', () => {
    percentageToTier(95, DEFAULT_PERCENTAGE_TIERS);
  });

  bench('default tiers, poor value', () => {
    percentageToTier(10, DEFAULT_PERCENTAGE_TIERS);
  });

  bench('custom tiers', () => {
    percentageToTier(75, [
      { min: 50, icon: '🟢', color: 'green', label: 'pass' },
      { min: 0, icon: '🔴', color: 'red', label: 'fail' },
    ]);
  });

  bench('negative value (fallback)', () => {
    percentageToTier(-5, DEFAULT_PERCENTAGE_TIERS);
  });
});
