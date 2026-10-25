/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { sample } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const small = [1, 2, 3, 4, 5];
const large = Array.from({ length: 10_000 }, (_, i) => i);

test('sample', async ({ bench }) => {
  await bench.compare(
    bench('single element from small array', () => {
      consume(sample(small));
    }),
    bench('single element from large array', () => {
      consume(sample(large));
    }),
    bench('10 elements from large array (uses shuffle internally)', () => {
      consume(sample(large, 10));
    }),
    RUN,
  );
});
