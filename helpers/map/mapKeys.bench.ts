/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { mapKeys } from '@helpers4/map';
import { RUN, consume } from '../../scripts/bench';

const small = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3],
]);
const large = new Map(Array.from({ length: 10_000 }, (_, i) => [i, i]));

test('mapKeys', async ({ bench }) => {
  await bench.compare(
    bench('small map', () => {
      consume(mapKeys(small, (key) => key.toUpperCase()));
    }),
    bench('large map', () => {
      consume(mapKeys(large, (key) => key * 2));
    }),
    RUN,
  );
});
