/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { symmetricDifference } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const small = [1, 2, 3];
const large = Array.from({ length: 10_000 }, (_, i) => i);
const largeShifted = Array.from({ length: 10_000 }, (_, i) => i + 5_000);

test('symmetricDifference', async ({ bench }) => {
  await bench.compare(
    bench('small arrays', () => {
      consume(symmetricDifference(small, [2, 3, 4]));
    }),
    bench('large arrays, half overlap', () => {
      consume(symmetricDifference(large, largeShifted));
    }),
    bench('large arrays, identical (empty result)', () => {
      consume(symmetricDifference(large, large));
    }),
    RUN,
  );
});
