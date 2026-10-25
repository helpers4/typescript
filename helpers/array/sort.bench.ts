/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { sortNumberAscFn, sortStringAscFn } from '@helpers4/array';
import { RUN } from '../../scripts/bench';

const numbers = [5, 3, 8, 1, 9, 2, 7, 4, 6, 10];
const strings = ['banana', 'apple', 'cherry', 'date', 'elderberry', 'fig', 'grape'];

test('sort', async ({ bench }) => {
  await bench.compare(
    bench('numbers ascending (10 items)', () => {
      [...numbers].sort(sortNumberAscFn);
    }),
    bench('strings ascending (7 items)', () => {
      [...strings].sort(sortStringAscFn);
    }),
    RUN,
  );
});
