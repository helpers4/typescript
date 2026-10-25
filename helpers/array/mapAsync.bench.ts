/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { mapAsync } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const small = Array.from({ length: 10 }, (_, i) => i);
const large = Array.from({ length: 1_000 }, (_, i) => i);

test('mapAsync', async ({ bench }) => {
  await bench.compare(
    bench('small array, unlimited concurrency', async () => {
      consume(await mapAsync(small, (n) => n * 2));
    }),
    bench('large array, unlimited concurrency', async () => {
      consume(await mapAsync(large, (n) => n * 2));
    }),
    bench('large array, concurrency capped at 10', async () => {
      consume(await mapAsync(large, (n) => n * 2, 10));
    }),
    RUN,
  );
});
