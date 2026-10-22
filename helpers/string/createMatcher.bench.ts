/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { createMatcher } from './createMatcher';

const matches = createMatcher(['Screen *', '/^(Home|Login)$/', '!* (old)']);

describe('createMatcher', () => {
  bench('create from three patterns', () => {
    createMatcher(['Screen *', '/^(Home|Login)$/', '!* (old)']);
  });
  bench('match with a created matcher', () => {
    matches('Screen 2 (old)');
  });
});
