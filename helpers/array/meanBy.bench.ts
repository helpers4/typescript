/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { meanBy } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const small = [{ price: 10 }, { price: 20 }, { price: 30 }];
const large = Array.from({ length: 10_000 }, (_, i) => ({ price: i }));

test('meanBy', async ({ bench }) => {
  await bench.compare(
    bench('small array, function accessor', () => {
      consume(meanBy(small, (item) => item.price));
    }),
    bench('large array, function accessor', () => {
      consume(meanBy(large, (item) => item.price));
    }),
    bench('large array, string path accessor', () => {
      consume(meanBy(large, 'price'));
    }),
    bench('null input', () => {
      consume(meanBy(null, (item: { price: number }) => item.price));
    }),
    RUN,
  );
});
