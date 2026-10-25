/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { eachDay, eachMonth } from '@helpers4/date';
import { RUN, consume } from '../../scripts/bench';

test('sequence', async ({ bench }) => {
  await bench.compare(
    bench('eachDay, one week', () => {
      consume(eachDay('2025-01-01', '2025-01-07'));
    }),
    bench('eachDay, one year (365 entries)', () => {
      consume(eachDay('2025-01-01', '2025-12-31'));
    }),
    bench('eachMonth, one year', () => {
      consume(eachMonth('2025-01-01', '2025-12-31'));
    }),
    RUN,
  );
});
