/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { increment } from '@helpers4/version';
import { RUN, consume } from '../../scripts/bench';

test('increment', async ({ bench }) => {
  await bench.compare(
    bench('patch bump', () => {
      consume(increment('1.2.3', 'patch'));
    }),
    bench('major bump, with leading v', () => {
      consume(increment('v1.2.3', 'major'));
    }),
    RUN,
  );
});
