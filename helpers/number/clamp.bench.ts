/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { clamp } from '@helpers4/number';
import { RUN, consume } from '../../scripts/bench';

test('clamp', async ({ bench }) => {
  await bench.compare(
    bench('within range', () => {
      consume(clamp(5, 0, 10));
    }),
    bench('above max', () => {
      consume(clamp(15, 0, 10));
    }),
    bench('below min', () => {
      consume(clamp(-5, 0, 10));
    }),
    RUN,
  );
});
