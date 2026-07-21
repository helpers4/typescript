/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { hasValue } from './hasValue';

const large = new Map(Array.from({ length: 10_000 }, (_, i) => [i, i]));

describe('hasValue', () => {
  bench('large map, value near the start', () => {
    hasValue(large, 5);
  });
  bench('large map, value near the end', () => {
    hasValue(large, 9_995);
  });
  bench('large map, value absent (full scan)', () => {
    hasValue(large, -1);
  });
});
