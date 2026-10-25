/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { minBy } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const small = Array.from({ length: 100 }, () => ({ v: Math.random() * 1000 }));
const large = Array.from({ length: 100_000 }, () => ({ v: Math.random() * 1000 }));

test('minBy', async ({ bench }) => {
  await bench.compare(
    bench('minBy() — 100 elements', () => {
      consume(minBy(small, (item) => item.v));
    }),
    bench('minBy() — 100 000 elements', () => {
      consume(minBy(large, (item) => item.v));
    }),
    RUN,
  );
});
