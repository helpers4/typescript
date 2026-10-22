/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { createRegexMatcher } from './createRegexMatcher';

const matches = createRegexMatcher(['^src/', '!test\\.ts$']);

describe('createRegexMatcher', () => {
  bench('create', () => {
    createRegexMatcher(['^src/', '!test\\.ts$']);
  });
  bench('match', () => {
    matches('/src/index.test.ts');
  });
});
