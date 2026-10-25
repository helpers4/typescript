/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { chunk } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const small = [1, 2, 3, 4, 5];
const large = Array.from({ length: 10_000 }, (_, i) => i);

test('chunk', async ({ bench }) => {
  await bench.compare(
    bench('small array, size 2', () => {
      consume(chunk(small, 2));
    }),
    bench('large array, size 10', () => {
      consume(chunk(large, 10));
    }),
    bench('large array, size 1000', () => {
      consume(chunk(large, 1000));
    }),
    RUN,
  );
});
