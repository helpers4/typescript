/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { filterAsync } from './filterAsync';

const small = Array.from({ length: 10 }, (_, i) => i);
const large = Array.from({ length: 1_000 }, (_, i) => i);

describe('filterAsync', () => {
  bench('small array, unlimited concurrency', async () => {
    await filterAsync(small, (n) => n % 2 === 0);
  });
  bench('large array, unlimited concurrency', async () => {
    await filterAsync(large, (n) => n % 2 === 0);
  });
  bench('large array, concurrency capped at 10', async () => {
    await filterAsync(large, (n) => n % 2 === 0, 10);
  });
});
