/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { maxBy } from './maxBy';

const small = Array.from({ length: 100 }, () => ({ v: Math.random() * 1000 }));
const large = Array.from({ length: 100_000 }, () => ({ v: Math.random() * 1000 }));

describe('maxBy', () => {
  bench('maxBy() — 100 elements', () => {
    maxBy(small, (item) => item.v);
  });

  bench('maxBy() — 100 000 elements', () => {
    maxBy(large, (item) => item.v);
  });
});
