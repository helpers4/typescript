/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { lerp } from '@helpers4/number';
import { RUN, consume } from '../../scripts/bench';

test('lerp', async ({ bench }) => {
  await bench.compare(
    bench('t = 0.5', () => {
      consume(lerp(0, 100, 0.5));
    }),
    bench('t = 0 (fast path)', () => {
      consume(lerp(0, 100, 0));
    }),
    RUN,
  );
});
