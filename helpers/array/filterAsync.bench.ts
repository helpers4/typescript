/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { filterAsync } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const small = Array.from({ length: 10 }, (_, i) => i);
const large = Array.from({ length: 1_000 }, (_, i) => i);

test('filterAsync', async ({ bench }) => {
  await bench.compare(
    bench('small array, unlimited concurrency', async () => {
      consume(await filterAsync(small, (n) => n % 2 === 0));
    }),
    bench('large array, unlimited concurrency', async () => {
      consume(await filterAsync(large, (n) => n % 2 === 0));
    }),
    bench('large array, concurrency capped at 10', async () => {
      consume(await filterAsync(large, (n) => n % 2 === 0, 10));
    }),
    RUN,
  );
});
