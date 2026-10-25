/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { omit } from '@helpers4/object';
import { RUN, consume } from '../../scripts/bench';

const small = { a: 1, b: 2, c: 3 };
const large: Record<string, number> = Object.fromEntries(
  Array.from({ length: 1_000 }, (_, i) => [`key${i}`, i]),
);

test('omit', async ({ bench }) => {
  await bench.compare(
    bench('small object, one key', () => {
      consume(omit(small, ['b']));
    }),
    bench('large object, few keys omitted', () => {
      consume(omit(large, ['key0', 'key1', 'key2']));
    }),
    RUN,
  );
});
