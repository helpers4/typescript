/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { unflatten } from '@helpers4/object';
import { RUN, consume } from '../../scripts/bench';

const small = { 'a.b.c': 1, 'a.d': 2 };
const wide: Record<string, number> = Object.fromEntries(
  Array.from({ length: 500 }, (_, i) => [`key${i}.nested.value`, i]),
);

test('unflatten', async ({ bench }) => {
  await bench.compare(
    bench('small flattened object', () => {
      consume(unflatten(small));
    }),
    bench('wide flattened object, 500 three-level paths', () => {
      consume(unflatten(wide));
    }),
    RUN,
  );
});
