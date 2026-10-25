/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { toMapByKey } from '@helpers4/set';
import { RUN, consume } from '../../scripts/bench';

const small = new Set([
  { id: 'a', n: 1 },
  { id: 'b', n: 2 },
  { id: 'c', n: 3 },
]);
const large = new Set(Array.from({ length: 10_000 }, (_, i) => ({ id: i, n: i * 2 })));

test('toMapByKey', async ({ bench }) => {
  await bench.compare(
    bench('small set', () => {
      consume(toMapByKey(small, (item) => item.id));
    }),
    bench('large set', () => {
      consume(toMapByKey(large, (item) => item.id));
    }),
    bench('large set, with duplicate keys (collapsing)', () => {
      consume(toMapByKey(large, (item) => item.id % 100));
    }),
    RUN,
  );
});
