/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { invert } from '@helpers4/object';
import { RUN, consume } from '../../scripts/bench';

const small = { a: 'x', b: 'y', c: 'z' };
const large: Record<string, string> = Object.fromEntries(
  Array.from({ length: 1_000 }, (_, i) => [`key${i}`, `value${i}`]),
);

test('invert', async ({ bench }) => {
  await bench.compare(
    bench('small object', () => {
      consume(invert(small));
    }),
    bench('large object (1000 keys)', () => {
      consume(invert(large));
    }),
    RUN,
  );
});
