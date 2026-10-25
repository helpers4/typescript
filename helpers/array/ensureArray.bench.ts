/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { ensureArray } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const nested = Array.from({ length: 1_000 }, (_, i) => [i, [i + 1]]);

test('ensureArray', async ({ bench }) => {
  await bench.compare(
    bench('already an array (identity path)', () => {
      consume(ensureArray([1, 2, 3]));
    }),
    bench('single value wrapped', () => {
      consume(ensureArray('hello'));
    }),
    bench('nested array flattened to depth 1', () => {
      consume(ensureArray(nested, 1));
    }),
    RUN,
  );
});
