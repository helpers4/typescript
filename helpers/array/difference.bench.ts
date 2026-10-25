/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { difference } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const small = [1, 2, 3, 4, 5];
const medium = Array.from({ length: 100 }, (_, i) => i);
const overlap = Array.from({ length: 100 }, (_, i) => i + 50);

test('difference', async ({ bench }) => {
  await bench.compare(
    bench('small arrays (5 items)', () => {
      consume(difference(small, [3, 4, 5, 6, 7]));
    }),
    bench('medium arrays (100 items, 50% overlap)', () => {
      consume(difference(medium, overlap));
    }),
    bench('no overlap', () => {
      consume(difference(small, [6, 7, 8, 9, 10]));
    }),
    bench('complete overlap', () => {
      consume(difference(small, small));
    }),
    RUN,
  );
});
