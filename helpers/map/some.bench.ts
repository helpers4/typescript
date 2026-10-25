/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { some } from '@helpers4/map';
import { RUN, consume } from '../../scripts/bench';

const small = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3],
]);
const large = new Map(Array.from({ length: 10_000 }, (_, i) => [i, i]));

test('some', async ({ bench }) => {
  await bench.compare(
    bench('small map, no match', () => {
      consume(some(small, (value) => value > 100));
    }),
    bench('large map, match near the start (short-circuit)', () => {
      consume(some(large, (value) => value === 5));
    }),
    bench('large map, no match (full scan)', () => {
      consume(some(large, (value) => value === -1));
    }),
    RUN,
  );
});
