/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { partition } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const small = [1, 2, 3, 4, 5];
const large = Array.from({ length: 10_000 }, (_, i) => i);

test('partition', async ({ bench }) => {
  await bench.compare(
    bench('small array', () => {
      consume(partition(small, n => n % 2 === 0));
    }),
    bench('large array, even split', () => {
      consume(partition(large, n => n % 2 === 0));
    }),
    bench('large array, almost all pass', () => {
      consume(partition(large, n => n !== -1));
    }),
    RUN,
  );
});
