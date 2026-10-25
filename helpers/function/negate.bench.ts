/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { negate } from '@helpers4/function';
import { RUN, consume } from '../../scripts/bench';

const isEven = (n: number): boolean => n % 2 === 0;
const isOdd = negate(isEven);

test('negate', async ({ bench }) => {
  await bench.compare(
    bench('build a negated predicate', () => {
      consume(negate(isEven));
    }),
    bench('call a pre-built negated predicate', () => {
      isOdd(3);
    }),
    RUN,
  );
});
