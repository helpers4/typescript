/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { map } from './map';

const small = new Set([1, 2, 3, 4, 5]);
const large = new Set(Array.from({ length: 10_000 }, (_, i) => i));

describe('map', () => {
  bench('small set', () => {
    map(small, (value) => value * 10);
  });
  bench('large set, no collisions', () => {
    map(large, (value) => value * 10);
  });
  bench('large set, with collisions (collapsing)', () => {
    map(large, (value) => value % 100);
  });
});
