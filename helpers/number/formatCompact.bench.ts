/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { formatCompact } from '@helpers4/number';
import { RUN, consume } from '../../scripts/bench';

test('formatCompact', async ({ bench }) => {
  await bench.compare(
    bench('default locale', () => {
      consume(formatCompact(1_500_000));
    }),
    bench('explicit locale', () => {
      consume(formatCompact(1_500_000, 'fr'));
    }),
    RUN,
  );
});
