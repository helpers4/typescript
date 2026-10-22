/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { toMapByKey } from './toMapByKey';

const small = [
  { id: 'a', n: 1 },
  { id: 'b', n: 2 },
  { id: 'c', n: 3 },
];
const large = Array.from({ length: 10_000 }, (_, i) => ({ id: i, n: i * 2 }));

describe('toMapByKey', () => {
  bench('small array', () => {
    toMapByKey(small, (item) => item.id);
  });
  bench('large array', () => {
    toMapByKey(large, (item) => item.id);
  });
  bench('large array, with duplicate keys (collapsing)', () => {
    toMapByKey(large, (item) => item.id % 100);
  });
});
