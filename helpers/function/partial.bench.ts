/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { partial } from '@helpers4/function';
import { RUN, consume } from '../../scripts/bench';

const multiply = (a: number, b: number): number => a * b;
const double = partial(multiply, 2);

test('partial', async ({ bench }) => {
  await bench.compare(
    bench('build a partially-applied function', () => {
      consume(partial(multiply, 2));
    }),
    bench('call a pre-built partially-applied function', () => {
      double(5);
    }),
    RUN,
  );
});
