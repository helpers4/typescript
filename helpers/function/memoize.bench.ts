/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { memoize } from '@helpers4/function';
import { RUN } from '../../scripts/bench';

const add = (a: number, b: number) => a + b;
const memoizedAdd = memoize(add);

test('memoize', async ({ bench }) => {
  await bench.compare(
    bench('cache miss', () => {
      const fn = memoize(add);
      fn(1, 2);
    }),
    bench('cache hit', () => {
      memoizedAdd(1, 2);
    }),
    bench('varying arguments', () => {
      const fn = memoize(add);
      fn(1, 2);
      fn(3, 4);
      fn(1, 2);
    }),
    RUN,
  );
});
