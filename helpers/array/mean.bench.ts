/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { mean } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const small = [1, 2, 3, 4, 5];
const large = Array.from({ length: 10_000 }, (_, i) => i);

test('mean', async ({ bench }) => {
  await bench.compare(
    bench('small array', () => {
      consume(mean(small));
    }),
    bench('large array', () => {
      consume(mean(large));
    }),
    RUN,
  );
});
