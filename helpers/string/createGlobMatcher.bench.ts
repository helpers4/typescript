/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { createGlobMatcher } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

const matches = createGlobMatcher(['/src/*.ts', '!*.test.ts']);

test('createGlobMatcher', async ({ bench }) => {
  await bench.compare(
    bench('create', () => {
      consume(createGlobMatcher(['/src/*.ts', '!*.test.ts']));
    }),
    bench('match', () => {
      matches('/src/index.test.ts');
    }),
    RUN,
  );
});
