/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { intersects } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const small = [1, 2, 3, 4, 5];
const large = Array.from({ length: 10_000 }, (_, i) => i);
const largeNoOverlap = Array.from({ length: 10_000 }, (_, i) => i + 10_000);
const largeEarlyMatch = [0, ...Array.from({ length: 9_999 }, (_, i) => i + 10_000)];

test('intersects', async ({ bench }) => {
  await bench.compare(
    bench('small arrays, overlap', () => {
      consume(intersects(small, [3, 4, 5, 6, 7]));
    }),
    bench('small arrays, no overlap', () => {
      consume(intersects(small, [6, 7, 8, 9, 10]));
    }),
    bench('large arrays, no overlap (worst case for Set cost)', () => {
      consume(intersects(large, largeNoOverlap));
    }),
    bench('large arrays, early match in a (Set pays full cost, short-circuits quickly)', () => {
      consume(intersects(largeEarlyMatch, large));
    }),
    bench('large arrays, full overlap', () => {
      consume(intersects(large, large));
    }),
    RUN,
  );
});
