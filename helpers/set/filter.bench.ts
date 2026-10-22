/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { filter } from './filter';

const small = new Set([1, 2, 3, 4, 5]);
const large = new Set(Array.from({ length: 10_000 }, (_, i) => i));

describe('filter', () => {
  bench('small set', () => {
    filter(small, (value) => value % 2 === 0);
  });
  bench('large set, half match', () => {
    filter(large, (value) => value % 2 === 0);
  });
});
