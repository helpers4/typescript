/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { cartesianProduct } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const small = [1, 2, 3];
const medium = Array.from({ length: 20 }, (_, i) => i);

test('cartesianProduct', async ({ bench }) => {
  await bench.compare(
    bench('two small arrays', () => {
      consume(cartesianProduct(small, ['a', 'b', 'c']));
    }),
    bench('three small arrays (8-cube)', () => {
      consume(cartesianProduct([0, 1], [0, 1], [0, 1]));
    }),
    bench('two medium arrays (20x20 = 400 tuples)', () => {
      consume(cartesianProduct(medium, medium));
    }),
    RUN,
  );
});
