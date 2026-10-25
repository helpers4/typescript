/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { pickBy } from '@helpers4/object';
import { RUN, consume } from '../../scripts/bench';

const small = { a: 1, b: 0, c: 2 };
const large: Record<string, number> = Object.fromEntries(
  Array.from({ length: 1_000 }, (_, i) => [`key${i}`, i]),
);

test('pickBy', async ({ bench }) => {
  await bench.compare(
    bench('small object', () => {
      consume(pickBy(small, value => value > 0));
    }),
    bench('large object, predicate matches half', () => {
      consume(pickBy(large, value => value % 2 === 0));
    }),
    RUN,
  );
});
