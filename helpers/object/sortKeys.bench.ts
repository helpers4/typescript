/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { sortKeys } from '@helpers4/object';
import { RUN, consume } from '../../scripts/bench';

const small = { c: 3, a: 1, b: 2 };
const large = Object.fromEntries(
  Array.from({ length: 1_000 }, (_, i) => [`key${999 - i}`, i]),
);

test('sortKeys', async ({ bench }) => {
  await bench.compare(
    bench('small object', () => {
      consume(sortKeys(small));
    }),
    bench('large object (1000 keys), default order', () => {
      consume(sortKeys(large));
    }),
    bench('large object, custom comparator', () => {
      consume(sortKeys(large, (a, b) => b.localeCompare(a)));
    }),
    RUN,
  );
});
