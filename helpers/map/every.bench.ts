/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { every } from '@helpers4/map';
import { RUN, consume } from '../../scripts/bench';

const small = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3],
]);
const large = new Map(Array.from({ length: 10_000 }, (_, i) => [i, i]));

test('every', async ({ bench }) => {
  await bench.compare(
    bench('small map, all match', () => {
      consume(every(small, (value) => value > 0));
    }),
    bench('large map, all match (worst case, full scan)', () => {
      consume(every(large, (value) => value >= 0));
    }),
    bench('large map, first entry fails (short-circuit)', () => {
      consume(every(large, (value) => value > 0));
    }),
    RUN,
  );
});
