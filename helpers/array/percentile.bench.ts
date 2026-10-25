/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { percentile } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const small = [5, 3, 1, 4, 2];
const large = Array.from({ length: 10_000 }, () => Math.random());

test('percentile', async ({ bench }) => {
  await bench.compare(
    bench('small array, p50', () => {
      consume(percentile(small, 50));
    }),
    bench('large array, p50 (interpolated)', () => {
      consume(percentile(large, 50));
    }),
    bench('large array, p0 (min, still sorts first)', () => {
      consume(percentile(large, 0));
    }),
    RUN,
  );
});
