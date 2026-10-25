/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { map } from '@helpers4/set';
import { RUN, consume } from '../../scripts/bench';

const small = new Set([1, 2, 3, 4, 5]);
const large = new Set(Array.from({ length: 10_000 }, (_, i) => i));

test('map', async ({ bench }) => {
  await bench.compare(
    bench('small set', () => {
      consume(map(small, (value) => value * 10));
    }),
    bench('large set, no collisions', () => {
      consume(map(large, (value) => value * 10));
    }),
    bench('large set, with collisions (collapsing)', () => {
      consume(map(large, (value) => value % 100));
    }),
    RUN,
  );
});
