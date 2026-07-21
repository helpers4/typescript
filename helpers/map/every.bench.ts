/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { every } from './every';

const small = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3],
]);
const large = new Map(Array.from({ length: 10_000 }, (_, i) => [i, i]));

describe('every', () => {
  bench('small map, all match', () => {
    every(small, (value) => value > 0);
  });
  bench('large map, all match (worst case, full scan)', () => {
    every(large, (value) => value >= 0);
  });
  bench('large map, first entry fails (short-circuit)', () => {
    every(large, (value) => value > 0);
  });
});
