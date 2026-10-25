/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { satisfiesRange } from '@helpers4/version';
import { RUN, consume } from '../../scripts/bench';

test('satisfiesRange', async ({ bench }) => {
  await bench.compare(
    bench('exact match', () => {
      consume(satisfiesRange('1.2.3', '1.2.3'));
    }),
    bench('>= comparator', () => {
      consume(satisfiesRange('1.5.0', '>=1.0.0'));
    }),
    bench('caret range', () => {
      consume(satisfiesRange('1.5.0', '^1.0.0'));
    }),
    RUN,
  );
});
