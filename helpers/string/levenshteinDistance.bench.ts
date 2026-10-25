/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { levenshteinDistance } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

test('levenshteinDistance', async ({ bench }) => {
  await bench.compare(
    bench('short strings', () => {
      consume(levenshteinDistance('kitten', 'sitting'));
    }),
    bench('identical strings', () => {
      consume(levenshteinDistance('helpers4', 'helpers4'));
    }),
    bench('long strings', () => {
      consume(levenshteinDistance(
        'This is a moderately long string used to benchmark the helper',
        'This is a moderately long string used for benchmarking this helper',
      ));
    }),
    RUN,
  );
});
