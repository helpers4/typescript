/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { maxBy } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const small = Array.from({ length: 100 }, () => ({ v: Math.random() * 1000 }));
const large = Array.from({ length: 100_000 }, () => ({ v: Math.random() * 1000 }));

test('maxBy', async ({ bench }) => {
  await bench.compare(
    bench('maxBy() — 100 elements', () => {
      consume(maxBy(small, (item) => item.v));
    }),
    bench('maxBy() — 100 000 elements', () => {
      consume(maxBy(large, (item) => item.v));
    }),
    RUN,
  );
});
