/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { sumBy } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const small = [{ price: 10 }, { price: 20 }, { price: 30 }];
const large = Array.from({ length: 10_000 }, (_, i) => ({ price: i, nested: { value: i } }));

test('sumBy', async ({ bench }) => {
  await bench.compare(
    bench('small array, function accessor', () => {
      consume(sumBy(small, (item) => item.price));
    }),
    bench('large array, function accessor', () => {
      consume(sumBy(large, (item) => item.price));
    }),
    bench('large array, string path accessor', () => {
      consume(sumBy(large, 'price'));
    }),
    bench('large array, nested string path accessor', () => {
      consume(sumBy(large, 'nested.value'));
    }),
    bench('null input', () => {
      consume(sumBy(null, (item: { price: number }) => item.price));
    }),
    RUN,
  );
});
