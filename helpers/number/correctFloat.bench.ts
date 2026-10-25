/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { correctFloat } from '@helpers4/number';
import { RUN, consume } from '../../scripts/bench';

test('correctFloat', async ({ bench }) => {
  await bench.compare(
    bench('integer — no drift', () => {
      consume(correctFloat(42));
    }),
    bench('classic 0.1 + 0.2 drift', () => {
      consume(correctFloat(0.1 + 0.2));
    }),
    bench('custom precision (4 digits)', () => {
      consume(correctFloat(1.23456789, 4));
    }),
    bench('large float', () => {
      consume(correctFloat(123456789.9876543));
    }),
    bench('negative zero', () => {
      consume(correctFloat(-0));
    }),
    RUN,
  );
});
