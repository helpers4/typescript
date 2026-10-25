/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { without } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const small = [1, 2, 3, 2, 4];
const large = Array.from({ length: 10_000 }, (_, i) => i);

test('without', async ({ bench }) => {
  await bench.compare(
    bench('small array, one value', () => {
      consume(without(small, 2));
    }),
    bench('large array, one value', () => {
      consume(without(large, 5_000));
    }),
    bench('large array, many values', () => {
      consume(without(large, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10));
    }),
    RUN,
  );
});
