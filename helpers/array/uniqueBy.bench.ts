/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { uniqueBy } from './uniqueBy';

const small = Array.from({ length: 100 }, (_, i) => ({ id: i % 20 }));
const large = Array.from({ length: 100_000 }, (_, i) => ({ id: i % 1000 }));

describe('uniqueBy', () => {
  bench('uniqueBy() — 100 elements', () => {
    uniqueBy(small, (item) => item.id);
  });

  bench('uniqueBy() — 100 000 elements', () => {
    uniqueBy(large, (item) => item.id);
  });
});
