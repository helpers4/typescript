/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { filter } from './filter';

const small = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3],
]);
const large = new Map(Array.from({ length: 10_000 }, (_, i) => [i, i]));

describe('filter', () => {
  bench('small map', () => {
    filter(small, (value) => value % 2 === 0);
  });
  bench('large map, half match', () => {
    filter(large, (value) => value % 2 === 0);
  });
});
