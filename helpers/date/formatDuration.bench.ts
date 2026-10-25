/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { formatDuration } from '@helpers4/date';
import { RUN, consume } from '../../scripts/bench';

test('formatDuration', async ({ bench }) => {
  await bench.compare(
    bench('sub-minute duration', () => {
      consume(formatDuration(45_000));
    }),
    bench('multi-hour duration', () => {
      consume(formatDuration(5_025_000));
    }),
    bench('padded, minUnit minutes', () => {
      consume(formatDuration(5_025_000, { minUnit: 'minutes', padded: true }));
    }),
    RUN,
  );
});
