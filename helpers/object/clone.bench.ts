/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { clone } from '@helpers4/object';
import { RUN, consume } from '../../scripts/bench';

const small = { a: 1, b: 2, c: 3 };
const large: Record<string, number> = Object.fromEntries(
  Array.from({ length: 1_000 }, (_, i) => [`key${i}`, i]),
);
const date = new Date('2024-01-01');

test('clone', async ({ bench }) => {
  await bench.compare(
    bench('primitive (fast path)', () => {
      consume(clone(42));
    }),
    bench('small object', () => {
      consume(clone(small));
    }),
    bench('large object (1000 keys)', () => {
      consume(clone(large));
    }),
    bench('Date instance', () => {
      consume(clone(date));
    }),
    RUN,
  );
});
