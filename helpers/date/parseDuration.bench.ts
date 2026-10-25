/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { parseDuration } from '@helpers4/date';
import { RUN, consume } from '../../scripts/bench';

test('parseDuration', async ({ bench }) => {
  await bench.compare(
    bench('single segment', () => {
      consume(parseDuration('45s'));
    }),
    bench('multiple segments', () => {
      consume(parseDuration('1h 23m 45s'));
    }),
    bench('unparseable string', () => {
      consume(parseDuration('garbage'));
    }),
    RUN,
  );
});
