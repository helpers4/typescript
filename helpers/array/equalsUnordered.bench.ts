/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { equalsUnordered } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const small = [1, 2, 3, 4, 5];
const smallReversed = [5, 4, 3, 2, 1];
const medium = Array.from({ length: 200 }, (_, i) => i);
const mediumShuffled = medium.toReversed();

test('equalsUnordered', async ({ bench }) => {
  await bench.compare(
    bench('small arrays, same order', () => {
      consume(equalsUnordered(small, small));
    }),
    bench('small arrays, reversed order', () => {
      consume(equalsUnordered(small, smallReversed));
    }),
    bench('medium arrays, reversed order', () => {
      consume(equalsUnordered(medium, mediumShuffled));
    }),
    RUN,
  );
});
