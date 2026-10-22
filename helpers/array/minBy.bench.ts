/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { minBy } from './minBy';

const small = Array.from({ length: 100 }, () => ({ v: Math.random() * 1000 }));
const large = Array.from({ length: 100_000 }, () => ({ v: Math.random() * 1000 }));

describe('minBy', () => {
  bench('minBy() — 100 elements', () => {
    minBy(small, (item) => item.v);
  });

  bench('minBy() — 100 000 elements', () => {
    minBy(large, (item) => item.v);
  });
});
