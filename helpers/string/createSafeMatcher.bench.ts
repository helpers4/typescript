/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { createSafeMatcher } from './createSafeMatcher';

describe('createSafeMatcher', () => {
  bench('valid patterns', () => {
    createSafeMatcher(['Screen *', '!* (old)']);
  });
  bench('invalid regular expression', () => {
    createSafeMatcher('/(/');
  });
});
