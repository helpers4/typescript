/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { max } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const small = Array.from({ length: 100 }, () => Math.random() * 1000);
const large = Array.from({ length: 100_000 }, () => Math.random() * 1000);

test('max', async ({ bench }) => {
  await bench.compare(
    bench('max() — 100 elements', () => {
      consume(max(small));
    }),
    bench('Math.max(...arr) — 100 elements', () => {
      Math.max(...small);
    }),
    bench('max() — 100 000 elements', () => {
      consume(max(large));
    }),
    RUN,
  );
});
