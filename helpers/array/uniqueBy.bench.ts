/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { uniqueBy } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const small = Array.from({ length: 100 }, (_, i) => ({ id: i % 20 }));
const large = Array.from({ length: 100_000 }, (_, i) => ({ id: i % 1000 }));

test('uniqueBy', async ({ bench }) => {
  await bench.compare(
    bench('uniqueBy() — 100 elements', () => {
      consume(uniqueBy(small, (item) => item.id));
    }),
    bench('uniqueBy() — 100 000 elements', () => {
      consume(uniqueBy(large, (item) => item.id));
    }),
    RUN,
  );
});
