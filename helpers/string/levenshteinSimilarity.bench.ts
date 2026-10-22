/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { levenshteinSimilarity } from './levenshteinSimilarity';

describe('levenshteinSimilarity', () => {
  bench('short strings', () => {
    levenshteinSimilarity('kitten', 'sitting');
  });
  bench('identical strings', () => {
    levenshteinSimilarity('helpers4', 'helpers4');
  });
});
