/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { zip } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const smallA = [1, 2, 3];
const smallB = ['a', 'b', 'c'];
const largeA = Array.from({ length: 10_000 }, (_, i) => i);
const largeB = Array.from({ length: 10_000 }, (_, i) => `item-${i}`);

test('zip', async ({ bench }) => {
  await bench.compare(
    bench('small arrays', () => {
      consume(zip(smallA, smallB));
    }),
    bench('large arrays', () => {
      consume(zip(largeA, largeB));
    }),
    RUN,
  );
});
