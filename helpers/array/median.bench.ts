/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { median } from './median';

const small = [5, 3, 1, 4, 2];
const large = Array.from({ length: 10_000 }, () => Math.random());

describe('median', () => {
  bench('small array (odd length)', () => {
    median(small);
  });
  bench('large array', () => {
    median(large);
  });
});
