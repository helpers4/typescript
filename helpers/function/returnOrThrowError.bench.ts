/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { returnOrThrowError } from '@helpers4/function';
import { RUN, consume } from '../../scripts/bench';

test('returnOrThrowError', async ({ bench }) => {
  await bench.compare(
    bench('defined value (fast path)', () => {
      consume(returnOrThrowError(42, 'should not throw'));
    }),
    bench('nullish value (throw + catch)', () => {
      try {
        consume(returnOrThrowError(null, 'value is required'));
      } catch {
        // expected
      }
    }),
    RUN,
  );
});
