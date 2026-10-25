/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { unset } from '@helpers4/object';
import { RUN, consume } from '../../scripts/bench';

test('unset', async ({ bench }) => {
  await bench.compare(
    bench('existing path (fresh object per call)', () => {
      consume(unset({ a: { b: 1, c: 2 } }, 'a.b'));
    }),
    bench('missing intermediate path (no-op, shared object)', () => {
      const shared = { a: { b: 1 } };
      consume(unset(shared, 'x.y.z'));
    }),
    RUN,
  );
});
