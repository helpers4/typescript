/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { reduce } from '@helpers4/map';
import { RUN, consume } from '../../scripts/bench';

const small = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3],
]);
const large = new Map(Array.from({ length: 10_000 }, (_, i) => [i, i]));

test('reduce', async ({ bench }) => {
  await bench.compare(
    bench('small map', () => {
      consume(reduce(small, (acc, value) => acc + value, 0));
    }),
    bench('large map', () => {
      consume(reduce(large, (acc, value) => acc + value, 0));
    }),
    RUN,
  );
});
