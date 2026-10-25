/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { removeUndefinedNull } from '@helpers4/object';
import { RUN, consume } from '../../scripts/bench';

const small = { a: 1, b: null, c: undefined, d: 'hello' };
const large: Record<string, number | null | undefined> = Object.fromEntries(
  Array.from({ length: 1_000 }, (_, i) => [`key${i}`, i % 3 === 0 ? null : i]),
);

test('removeUndefinedNull', async ({ bench }) => {
  await bench.compare(
    bench('small object', () => {
      consume(removeUndefinedNull(small));
    }),
    bench('large object, 1/3 null', () => {
      consume(removeUndefinedNull(large));
    }),
    RUN,
  );
});
