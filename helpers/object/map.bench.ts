/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { map } from '@helpers4/object';
import { RUN, consume } from '../../scripts/bench';

const large: Record<string, number> = Object.fromEntries(
  Array.from({ length: 1_000 }, (_, i) => [`key${i}`, i]),
);

test('map', async ({ bench }) => {
  await bench.compare(
    bench('map values only', () => {
      consume(map(large, v => v * 2));
    }),
    bench('map keys only', () => {
      consume(map(large, undefined, k => k.toUpperCase()));
    }),
    bench('map keys and values', () => {
      consume(map(large, v => v * 2, k => k.toUpperCase()));
    }),
    RUN,
  );
});
