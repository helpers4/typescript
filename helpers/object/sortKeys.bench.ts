/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { sortKeys } from './sortKeys';

const small = { c: 3, a: 1, b: 2 };
const large = Object.fromEntries(
  Array.from({ length: 1_000 }, (_, i) => [`key${999 - i}`, i]),
);

describe('sortKeys', () => {
  bench('small object', () => {
    sortKeys(small);
  });
  bench('large object (1000 keys), default order', () => {
    sortKeys(large);
  });
  bench('large object, custom comparator', () => {
    sortKeys(large, (a, b) => b.localeCompare(a));
  });
});
