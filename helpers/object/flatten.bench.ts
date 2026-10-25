/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { flatten } from '@helpers4/object';
import { RUN, consume } from '../../scripts/bench';

const small = { a: { b: { c: 1 }, d: 2 } };
const wide: Record<string, unknown> = Object.fromEntries(
  Array.from({ length: 500 }, (_, i) => [`key${i}`, { nested: { value: i } }]),
);

test('flatten', async ({ bench }) => {
  await bench.compare(
    bench('small nested object', () => {
      consume(flatten(small));
    }),
    bench('wide object, 500 two-level entries', () => {
      consume(flatten(wide));
    }),
    RUN,
  );
});
