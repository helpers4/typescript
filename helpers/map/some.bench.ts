/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { some } from './some';

const small = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3],
]);
const large = new Map(Array.from({ length: 10_000 }, (_, i) => [i, i]));

describe('some', () => {
  bench('small map, no match', () => {
    some(small, (value) => value > 100);
  });
  bench('large map, match near the start (short-circuit)', () => {
    some(large, (value) => value === 5);
  });
  bench('large map, no match (full scan)', () => {
    some(large, (value) => value === -1);
  });
});
