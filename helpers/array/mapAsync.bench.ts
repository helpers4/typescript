/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { mapAsync } from './mapAsync';

const small = Array.from({ length: 10 }, (_, i) => i);
const large = Array.from({ length: 1_000 }, (_, i) => i);

describe('mapAsync', () => {
  bench('small array, unlimited concurrency', async () => {
    await mapAsync(small, (n) => n * 2);
  });
  bench('large array, unlimited concurrency', async () => {
    await mapAsync(large, (n) => n * 2);
  });
  bench('large array, concurrency capped at 10', async () => {
    await mapAsync(large, (n) => n * 2, 10);
  });
});
