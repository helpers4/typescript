/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { equalsDeep } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const small = [1, 2, 3];
const medium = Array.from({ length: 100 }, (_, i) => i);
const nested = [[1, 2], [3, [4, 5]], [6, [7, [8, 9]]]];
const nestedCopy = [[1, 2], [3, [4, 5]], [6, [7, [8, 9]]]];

test('equalsDeep', async ({ bench }) => {
  await bench.compare(
    bench('small equal arrays', () => {
      consume(equalsDeep(small, [1, 2, 3]));
    }),
    bench('small different arrays', () => {
      consume(equalsDeep(small, [1, 2, 4]));
    }),
    bench('medium equal arrays (100 items)', () => {
      consume(equalsDeep(medium, Array.from({ length: 100 }, (_, i) => i)));
    }),
    bench('nested arrays (3 levels)', () => {
      consume(equalsDeep(nested, nestedCopy));
    }),
    bench('same reference', () => {
      consume(equalsDeep(small, small));
    }),
    bench('different lengths', () => {
      consume(equalsDeep(small, [1, 2]));
    }),
    RUN,
  );
});
