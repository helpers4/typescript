/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { randomBetween, randomIntBetween } from '@helpers4/number';
import { RUN, consume } from '../../scripts/bench';

test('random', async ({ bench }) => {
  await bench.compare(
    bench('randomBetween', () => {
      consume(randomBetween(0, 100));
    }),
    bench('randomIntBetween', () => {
      consume(randomIntBetween(0, 100));
    }),
    RUN,
  );
});
