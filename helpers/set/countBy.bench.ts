/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { countBy } from '@helpers4/set';
import { RUN, consume } from '../../scripts/bench';

const small = new Set([1, 2, 3, 4, 5]);
const large = new Set(Array.from({ length: 10_000 }, (_, i) => i));

test('countBy', async ({ bench }) => {
  await bench.compare(
    bench('small set, few groups', () => {
      consume(countBy(small, (value) => (value % 2 === 0 ? 'even' : 'odd')));
    }),
    bench('large set, few groups', () => {
      consume(countBy(large, (value) => (value % 2 === 0 ? 'even' : 'odd')));
    }),
    bench('large set, many groups', () => {
      consume(countBy(large, (value) => value % 1000));
    }),
    RUN,
  );
});
