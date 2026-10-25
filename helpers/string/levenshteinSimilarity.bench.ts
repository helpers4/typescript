/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { levenshteinSimilarity } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

test('levenshteinSimilarity', async ({ bench }) => {
  await bench.compare(
    bench('short strings', () => {
      consume(levenshteinSimilarity('kitten', 'sitting'));
    }),
    bench('identical strings', () => {
      consume(levenshteinSimilarity('helpers4', 'helpers4'));
    }),
    RUN,
  );
});
