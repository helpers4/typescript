/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { compact } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const small = [0, 1, false, 2, '', 3, null, undefined, Number.NaN];
const large = Array.from({ length: 10_000 }, (_, i) => (i % 3 === 0 ? 0 : i));

test('compact', async ({ bench }) => {
  await bench.compare(
    bench('small mixed-falsy array', () => {
      consume(compact(small));
    }),
    bench('large array, 1/3 falsy', () => {
      consume(compact(large));
    }),
    RUN,
  );
});
