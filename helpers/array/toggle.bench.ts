/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { toggle } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

interface Item {
  readonly id: number
}

const large: Item[] = Array.from({ length: 10_000 }, (_, i) => ({ id: i }));

test('toggle', async ({ bench }) => {
  await bench.compare(
    bench('remove existing item (reference equality)', () => {
      consume(toggle(large, large[5]));
    }),
    bench('add new item (reference equality)', () => {
      consume(toggle(large, { id: -1 }));
    }),
    bench('toggle by derived key', () => {
      consume(toggle(large, { id: 5 }, x => x.id));
    }),
    RUN,
  );
});
