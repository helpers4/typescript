/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { update } from '@helpers4/object';
import { RUN, consume } from '../../scripts/bench';

test('update', async ({ bench }) => {
  await bench.compare(
    bench('existing path (fresh object per call)', () => {
      consume(update({ count: 1 }, 'count', (n: number | undefined) => (n ?? 0) + 1));
    }),
    bench('creating intermediate objects (fresh object per call)', () => {
      consume(update({}, 'stats.hits', (n: number | undefined) => (n ?? 0) + 1));
    }),
    RUN,
  );
});
