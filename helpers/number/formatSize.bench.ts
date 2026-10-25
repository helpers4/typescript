/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { formatSize } from '@helpers4/number';
import { RUN, consume } from '../../scripts/bench';

test('formatSize', async ({ bench }) => {
  await bench.compare(
    bench('bytes (no division)', () => {
      consume(formatSize(512));
    }),
    bench('gigabytes (3 divisions)', () => {
      consume(formatSize(1_073_741_824));
    }),
    RUN,
  );
});
