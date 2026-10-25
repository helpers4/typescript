/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { findKey } from '@helpers4/map';
import { RUN, consume } from '../../scripts/bench';

const large = new Map(Array.from({ length: 10_000 }, (_, i) => [i, i]));

test('findKey', async ({ bench }) => {
  await bench.compare(
    bench('large map, match near the start', () => {
      consume(findKey(large, (value) => value === 5));
    }),
    bench('large map, match near the end', () => {
      consume(findKey(large, (value) => value === 9_995));
    }),
    bench('large map, no match (full scan)', () => {
      consume(findKey(large, (value) => value === -1));
    }),
    RUN,
  );
});
