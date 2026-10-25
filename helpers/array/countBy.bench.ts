/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { countBy } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const small = [1, 2, 3, 4, 5];
const large = Array.from({ length: 10_000 }, (_, i) => i);

test('countBy', async ({ bench }) => {
  await bench.compare(
    bench('small array, few keys', () => {
      consume(countBy(small, n => (n % 2 === 0 ? 'even' : 'odd')));
    }),
    bench('large array, few keys', () => {
      consume(countBy(large, n => (n % 2 === 0 ? 'even' : 'odd')));
    }),
    bench('large array, many keys', () => {
      consume(countBy(large, n => String(n % 1000)));
    }),
    RUN,
  );
});
