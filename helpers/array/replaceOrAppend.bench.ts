/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { replaceOrAppend } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

interface Item {
  readonly id: number
}

const large: Item[] = Array.from({ length: 10_000 }, (_, i) => ({ id: i }));

test('replaceOrAppend', async ({ bench }) => {
  await bench.compare(
    bench('replace, match near start', () => {
      consume(replaceOrAppend(large, { id: 5 }, x => x.id === 5));
    }),
    bench('replace, match near end', () => {
      consume(replaceOrAppend(large, { id: 9_995 }, x => x.id === 9_995));
    }),
    bench('append, no match (worst case)', () => {
      consume(replaceOrAppend(large, { id: -1 }, x => x.id === -1));
    }),
    RUN,
  );
});
