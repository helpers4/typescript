/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { curry } from '@helpers4/function';
import { RUN, consume } from '../../scripts/bench';

const add3 = (a: number, b: number, c: number): number => a + b + c;
const curriedAdd3 = curry(add3);

test('curry', async ({ bench }) => {
  await bench.compare(
    bench('curry a 3-argument function', () => {
      consume(curry(add3));
    }),
    bench('fully apply a curried 3-argument function', () => {
      curriedAdd3(1)(2)(3);
    }),
    RUN,
  );
});
