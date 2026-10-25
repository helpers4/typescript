/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { pick } from '@helpers4/object';
import { RUN, consume } from '../../scripts/bench';

const small = { a: 1, b: 2, c: 3 };
const large: Record<string, number> = Object.fromEntries(
  Array.from({ length: 1_000 }, (_, i) => [`key${i}`, i]),
);

test('pick', async ({ bench }) => {
  await bench.compare(
    bench('small object, one key', () => {
      consume(pick(small, ['a']));
    }),
    bench('large object, few keys picked', () => {
      consume(pick(large, ['key0', 'key1', 'key2']));
    }),
    RUN,
  );
});
