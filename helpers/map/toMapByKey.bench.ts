/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { toMapByKey } from '@helpers4/map';
import { RUN, consume } from '../../scripts/bench';

const small = [
  { id: 'a', n: 1 },
  { id: 'b', n: 2 },
  { id: 'c', n: 3 },
];
const large = Array.from({ length: 10_000 }, (_, i) => ({ id: i, n: i * 2 }));

test('toMapByKey', async ({ bench }) => {
  await bench.compare(
    bench('small array', () => {
      consume(toMapByKey(small, (item) => item.id));
    }),
    bench('large array', () => {
      consume(toMapByKey(large, (item) => item.id));
    }),
    bench('large array, with duplicate keys (collapsing)', () => {
      consume(toMapByKey(large, (item) => item.id % 100));
    }),
    RUN,
  );
});
