/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { reduce } from './reduce';

const small = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3],
]);
const large = new Map(Array.from({ length: 10_000 }, (_, i) => [i, i]));

describe('reduce', () => {
  bench('small map', () => {
    reduce(small, (acc, value) => acc + value, 0);
  });
  bench('large map', () => {
    reduce(large, (acc, value) => acc + value, 0);
  });
});
