/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { equalsShallow } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const small = [1, 2, 3, 4, 5];
const large = Array.from({ length: 10_000 }, (_, i) => i);
const largeCopy = [...large];
const largeDiffLast = [...large.slice(0, -1), -1];

test('equalsShallow', async ({ bench }) => {
  await bench.compare(
    bench('same reference (fast path)', () => {
      consume(equalsShallow(large, large));
    }),
    bench('small arrays, equal', () => {
      consume(equalsShallow(small, [1, 2, 3, 4, 5]));
    }),
    bench('large arrays, equal values', () => {
      consume(equalsShallow(large, largeCopy));
    }),
    bench('large arrays, differ at last index (worst case)', () => {
      consume(equalsShallow(large, largeDiffLast));
    }),
    RUN,
  );
});
