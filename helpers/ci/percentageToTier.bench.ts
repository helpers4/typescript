/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { DEFAULT_PERCENTAGE_TIERS, percentageToTier } from '@helpers4/ci';
import { RUN, consume } from '../../scripts/bench';

test('percentageToTier', async ({ bench }) => {
  await bench.compare(
    bench('default tiers, perfect value', () => {
      consume(percentageToTier(100, DEFAULT_PERCENTAGE_TIERS));
    }),
    bench('default tiers, excellent value', () => {
      consume(percentageToTier(95, DEFAULT_PERCENTAGE_TIERS));
    }),
    bench('default tiers, poor value', () => {
      consume(percentageToTier(10, DEFAULT_PERCENTAGE_TIERS));
    }),
    bench('custom tiers', () => {
      consume(percentageToTier(75, [
        { min: 50, icon: '🟢', color: 'green', label: 'pass' },
        { min: 0, icon: '🔴', color: 'red', label: 'fail' },
      ]));
    }),
    bench('negative value (fallback)', () => {
      consume(percentageToTier(-5, DEFAULT_PERCENTAGE_TIERS));
    }),
    RUN,
  );
});
