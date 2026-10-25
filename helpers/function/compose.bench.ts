/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { compose } from '@helpers4/function';
import { RUN, consume } from '../../scripts/bench';

const addOne = (x: number): number => x + 1;
const double = (x: number): number => x * 2;
const toStr = (x: number): string => String(x);

const composed3 = compose(toStr, double, addOne);

test('compose', async ({ bench }) => {
  await bench.compare(
    bench('build a 3-function composition', () => {
      consume(compose(toStr, double, addOne));
    }),
    bench('call a pre-built 3-function composition', () => {
      composed3(3);
    }),
    RUN,
  );
});
