/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { correctFloat } from './correctFloat';

describe('correctFloat', () => {
  bench('integer — no drift', () => {
    correctFloat(42);
  });
  bench('classic 0.1 + 0.2 drift', () => {
    correctFloat(0.1 + 0.2);
  });
  bench('custom precision (4 digits)', () => {
    correctFloat(1.23456789, 4);
  });
  bench('large float', () => {
    correctFloat(123456789.9876543);
  });
  bench('negative zero', () => {
    correctFloat(-0);
  });
});
