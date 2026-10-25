/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { mapSettled } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const large = Array.from({ length: 1_000 }, (_, i) => i);

test('mapSettled', async ({ bench }) => {
  await bench.compare(
    bench('large array, unlimited concurrency', async () => {
      consume(await mapSettled(large, (n) => n * 2));
    }),
    bench('large array, every other call failing, concurrency capped at 10', async () => {
      consume(await mapSettled(large, (n) => (n % 2 ? Promise.reject(n) : n), 10));
    }),
    RUN,
  );
});
