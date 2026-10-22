/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { createGlobMatcher } from './createGlobMatcher';

const matches = createGlobMatcher(['/src/*.ts', '!*.test.ts']);

describe('createGlobMatcher', () => {
  bench('create', () => {
    createGlobMatcher(['/src/*.ts', '!*.test.ts']);
  });
  bench('match', () => {
    matches('/src/index.test.ts');
  });
});
