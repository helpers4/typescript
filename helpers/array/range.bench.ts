/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { range } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

test('range', async ({ bench }) => {
  await bench.compare(
    bench('small range (0-5)', () => {
      consume(range(5));
    }),
    bench('large range (10,000 steps)', () => {
      consume(range(0, 10_000));
    }),
    bench('large range with step', () => {
      consume(range(0, 10_000, 2));
    }),
    RUN,
  );
});
