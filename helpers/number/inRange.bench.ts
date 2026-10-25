/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { inRange } from '@helpers4/number';
import { RUN, consume } from '../../scripts/bench';

test('inRange', async ({ bench }) => {
  await bench.compare(
    bench('default inclusive both', () => {
      consume(inRange(5, 1, 10));
    }),
    bench('exclusive boundaries', () => {
      consume(inRange(5, 1, 10, { inclusive: 'none' }));
    }),
    RUN,
  );
});
