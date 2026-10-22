/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { mapValues } from './mapValues';

const small = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3],
]);
const large = new Map(Array.from({ length: 10_000 }, (_, i) => [i, i]));

describe('mapValues', () => {
  bench('small map', () => {
    mapValues(small, (value) => value * 10);
  });
  bench('large map', () => {
    mapValues(large, (value) => value * 10);
  });
});
