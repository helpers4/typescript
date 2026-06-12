/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { max } from './max';

const small = Array.from({ length: 100 }, () => Math.random() * 1000);
const large = Array.from({ length: 100_000 }, () => Math.random() * 1000);

describe('max', () => {
  bench('max() — 100 elements', () => {
    max(small);
  });

  bench('Math.max(...arr) — 100 elements', () => {
    Math.max(...small);
  });

  bench('max() — 100 000 elements', () => {
    max(large);
  });

  // Math.max(...large) would throw RangeError (Maximum call stack size exceeded)
  // so it is intentionally omitted for the large case
});
