/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { min } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const small = Array.from({ length: 100 }, () => Math.random() * 1000);
const large = Array.from({ length: 100_000 }, () => Math.random() * 1000);

test('min', async ({ bench }) => {
  await bench.compare(
    bench('min() — 100 elements', () => {
      consume(min(small));
    }),
    bench('Math.min(...arr) — 100 elements', () => {
      Math.min(...small);
    }),
    bench('min() — 100 000 elements', () => {
      consume(min(large));
    }),
    RUN,
  );
});
