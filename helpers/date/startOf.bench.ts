/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { startOf } from '@helpers4/date';
import { RUN, consume } from '../../scripts/bench';

const date = new Date('2025-06-15T14:30:00Z');

test('startOf', async ({ bench }) => {
  await bench.compare(
    bench('start of day', () => {
      consume(startOf(date, 'day'));
    }),
    bench('start of month', () => {
      consume(startOf(date, 'month'));
    }),
    bench('start of year', () => {
      consume(startOf(date, 'year'));
    }),
    RUN,
  );
});
