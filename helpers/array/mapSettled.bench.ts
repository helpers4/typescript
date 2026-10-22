/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { mapSettled } from './mapSettled';

const large = Array.from({ length: 1_000 }, (_, i) => i);

describe('mapSettled', () => {
  bench('large array, unlimited concurrency', async () => {
    await mapSettled(large, (n) => n * 2);
  });
  bench('large array, every other call failing, concurrency capped at 10', async () => {
    await mapSettled(large, (n) => (n % 2 ? Promise.reject(n) : n), 10);
  });
});
