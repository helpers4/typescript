/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { roundTo } from '@helpers4/number';
import { RUN, consume } from '../../scripts/bench';

test('roundTo', async ({ bench }) => {
  await bench.compare(
    bench('2 decimal places', () => {
      consume(roundTo(3.14159, 2));
    }),
    bench('0 decimal places', () => {
      consume(roundTo(3.14159, 0));
    }),
    RUN,
  );
});
