/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { forEachAsync } from './forEachAsync';

const small = Array.from({ length: 10 }, (_, i) => i);
const large = Array.from({ length: 1_000 }, (_, i) => i);

describe('forEachAsync', () => {
  bench('small array, unlimited concurrency', async () => {
    await forEachAsync(small, () => {});
  });
  bench('large array, unlimited concurrency', async () => {
    await forEachAsync(large, () => {});
  });
  bench('large array, concurrency capped at 10', async () => {
    await forEachAsync(large, () => {}, 10);
  });
});
