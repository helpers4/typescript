/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { pipe } from '@helpers4/function';
import { RUN, consume } from '../../scripts/bench';

const addOne = (x: number): number => x + 1;
const double = (x: number): number => x * 2;
const toStr = (x: number): string => String(x);

const piped3 = pipe(addOne, double, toStr);

test('pipe', async ({ bench }) => {
  await bench.compare(
    bench('build a 3-function pipeline', () => {
      consume(pipe(addOne, double, toStr));
    }),
    bench('call a pre-built 3-function pipeline', () => {
      piped3(3);
    }),
    RUN,
  );
});
