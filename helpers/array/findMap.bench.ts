/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { findMap } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const array = Array.from({ length: 1000 }, (_, i) => i);

test('findMap', async ({ bench }) => {
  await bench.compare(
    bench('match near the start (short-circuits early)', () => {
      consume(findMap(array, (n) => (n === 5 ? n : undefined)));
    }),
    bench('match near the end', () => {
      consume(findMap(array, (n) => (n === 995 ? n : undefined)));
    }),
    bench('no match (scans the whole array)', () => {
      consume(findMap(array, (n) => (n === -1 ? n : undefined)));
    }),
    RUN,
  );
});
