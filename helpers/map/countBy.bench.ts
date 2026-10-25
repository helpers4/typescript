/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { countBy } from '@helpers4/map';
import { RUN, consume } from '../../scripts/bench';

const small = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3],
]);
const large = new Map(Array.from({ length: 10_000 }, (_, i) => [i, i]));

test('countBy', async ({ bench }) => {
  await bench.compare(
    bench('small map, few groups', () => {
      consume(countBy(small, (value) => (value % 2 === 0 ? 'even' : 'odd')));
    }),
    bench('large map, few groups', () => {
      consume(countBy(large, (value) => (value % 2 === 0 ? 'even' : 'odd')));
    }),
    bench('large map, many groups', () => {
      consume(countBy(large, (value) => value % 1000));
    }),
    RUN,
  );
});
