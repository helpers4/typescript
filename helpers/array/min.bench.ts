/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { min } from './min';

const small = Array.from({ length: 100 }, () => Math.random() * 1000);
const large = Array.from({ length: 100_000 }, () => Math.random() * 1000);

describe('min', () => {
  bench('min() — 100 elements', () => {
    min(small);
  });

  bench('Math.min(...arr) — 100 elements', () => {
    Math.min(...small);
  });

  bench('min() — 100 000 elements', () => {
    min(large);
  });

  // Math.min(...large) would throw RangeError (Maximum call stack size exceeded)
  // so it is intentionally omitted for the large case
});
