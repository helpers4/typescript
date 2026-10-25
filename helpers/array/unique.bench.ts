/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { unique } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const small = [1, 2, 3, 2, 1, 4, 5, 3];
const medium = Array.from({ length: 200 }, (_, i) => i % 100);
const noDupes = Array.from({ length: 100 }, (_, i) => i);

test('unique', async ({ bench }) => {
  await bench.compare(
    bench('small array with duplicates (8 items)', () => {
      consume(unique(small));
    }),
    bench('medium array 50% duplicates (200 items)', () => {
      consume(unique(medium));
    }),
    bench('no duplicates (100 items)', () => {
      consume(unique(noDupes));
    }),
    RUN,
  );
});
