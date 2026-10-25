/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { createRegexMatcher } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

const matches = createRegexMatcher(['^src/', '!test\\.ts$']);

test('createRegexMatcher', async ({ bench }) => {
  await bench.compare(
    bench('create', () => {
      consume(createRegexMatcher(['^src/', '!test\\.ts$']));
    }),
    bench('match', () => {
      matches('/src/index.test.ts');
    }),
    RUN,
  );
});
