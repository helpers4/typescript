/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { hasValue } from '@helpers4/map';
import { RUN, consume } from '../../scripts/bench';

const large = new Map(Array.from({ length: 10_000 }, (_, i) => [i, i]));

test('hasValue', async ({ bench }) => {
  await bench.compare(
    bench('large map, value near the start', () => {
      consume(hasValue(large, 5));
    }),
    bench('large map, value near the end', () => {
      consume(hasValue(large, 9_995));
    }),
    bench('large map, value absent (full scan)', () => {
      consume(hasValue(large, -1));
    }),
    RUN,
  );
});
