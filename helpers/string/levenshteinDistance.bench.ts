/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { levenshteinDistance } from './levenshteinDistance';

describe('levenshteinDistance', () => {
  bench('short strings', () => {
    levenshteinDistance('kitten', 'sitting');
  });
  bench('identical strings', () => {
    levenshteinDistance('helpers4', 'helpers4');
  });
  bench('long strings', () => {
    levenshteinDistance(
      'This is a moderately long string used to benchmark the helper',
      'This is a moderately long string used for benchmarking this helper',
    );
  });
});
