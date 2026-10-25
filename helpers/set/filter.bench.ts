/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { filter } from '@helpers4/set';
import { RUN, consume } from '../../scripts/bench';

const small = new Set([1, 2, 3, 4, 5]);
const large = new Set(Array.from({ length: 10_000 }, (_, i) => i));

test('filter', async ({ bench }) => {
  await bench.compare(
    bench('small set', () => {
      consume(filter(small, (value) => value % 2 === 0));
    }),
    bench('large set, half match', () => {
      consume(filter(large, (value) => value % 2 === 0));
    }),
    RUN,
  );
});
