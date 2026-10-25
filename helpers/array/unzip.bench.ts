/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { unzip } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const small: [number, string][] = [[1, 'a'], [2, 'b'], [3, 'c']];
const large: [number, string][] = Array.from({ length: 10_000 }, (_, i) => [i, `item-${i}`]);

test('unzip', async ({ bench }) => {
  await bench.compare(
    bench('small array of pairs', () => {
      consume(unzip(small));
    }),
    bench('large array of pairs', () => {
      consume(unzip(large));
    }),
    RUN,
  );
});
