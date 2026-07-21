/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { countBy } from './countBy';

const small = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3],
]);
const large = new Map(Array.from({ length: 10_000 }, (_, i) => [i, i]));

describe('countBy', () => {
  bench('small map, few groups', () => {
    countBy(small, (value) => (value % 2 === 0 ? 'even' : 'odd'));
  });
  bench('large map, few groups', () => {
    countBy(large, (value) => (value % 2 === 0 ? 'even' : 'odd'));
  });
  bench('large map, many groups', () => {
    countBy(large, (value) => value % 1000);
  });
});
