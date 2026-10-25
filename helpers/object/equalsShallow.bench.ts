/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { equalsShallow } from '@helpers4/object';
import { RUN, consume } from '../../scripts/bench';

const small = { a: 1, b: 2, c: 3 };
const large: Record<string, number> = Object.fromEntries(
  Array.from({ length: 1_000 }, (_, i) => [`key${i}`, i]),
);
const largeCopy = { ...large };
const largeDiffLast = { ...large, key999: -1 };

test('equalsShallow', async ({ bench }) => {
  await bench.compare(
    bench('same reference (fast path)', () => {
      consume(equalsShallow(large, large));
    }),
    bench('small objects, equal', () => {
      consume(equalsShallow(small, { a: 1, b: 2, c: 3 }));
    }),
    bench('large objects, equal values', () => {
      consume(equalsShallow(large, largeCopy));
    }),
    bench('large objects, differ at last key', () => {
      consume(equalsShallow(large, largeDiffLast));
    }),
    RUN,
  );
});
