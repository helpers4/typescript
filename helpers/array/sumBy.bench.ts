/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { sumBy } from './sumBy';

const small = [{ price: 10 }, { price: 20 }, { price: 30 }];
const large = Array.from({ length: 10_000 }, (_, i) => ({ price: i, nested: { value: i } }));

describe('sumBy', () => {
  bench('small array, function accessor', () => {
    sumBy(small, (item) => item.price);
  });
  bench('large array, function accessor', () => {
    sumBy(large, (item) => item.price);
  });
  bench('large array, string path accessor', () => {
    sumBy(large, 'price');
  });
  bench('large array, nested string path accessor', () => {
    sumBy(large, 'nested.value');
  });
  bench('null input', () => {
    sumBy(null, (item: { price: number }) => item.price);
  });
});
