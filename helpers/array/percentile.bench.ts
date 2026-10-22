/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { percentile } from './percentile';

const small = [5, 3, 1, 4, 2];
const large = Array.from({ length: 10_000 }, () => Math.random());

describe('percentile', () => {
  bench('small array, p50', () => {
    percentile(small, 50);
  });
  bench('large array, p50 (interpolated)', () => {
    percentile(large, 50);
  });
  bench('large array, p0 (min, still sorts first)', () => {
    percentile(large, 0);
  });
});
