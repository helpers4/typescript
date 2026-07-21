/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { meanBy } from './meanBy';

const small = [{ price: 10 }, { price: 20 }, { price: 30 }];
const large = Array.from({ length: 10_000 }, (_, i) => ({ price: i }));

describe('meanBy', () => {
  bench('small array, function accessor', () => {
    meanBy(small, (item) => item.price);
  });
  bench('large array, function accessor', () => {
    meanBy(large, (item) => item.price);
  });
  bench('large array, string path accessor', () => {
    meanBy(large, 'price');
  });
  bench('null input', () => {
    meanBy(null, (item: { price: number }) => item.price);
  });
});
