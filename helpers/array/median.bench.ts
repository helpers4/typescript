/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { median } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const small = [5, 3, 1, 4, 2];
const large = Array.from({ length: 10_000 }, () => Math.random());

test('median', async ({ bench }) => {
  await bench.compare(
    bench('small array (odd length)', () => {
      consume(median(small));
    }),
    bench('large array', () => {
      consume(median(large));
    }),
    RUN,
  );
});
