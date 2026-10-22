/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { globToRegExp } from './globToRegExp';

describe('globToRegExp', () => {
  bench('compile a simple pattern', () => {
    globToRegExp('*.test.ts');
  });
  bench('compile a pattern with multiple wildcards', () => {
    globToRegExp('report-????-*.csv');
  });
});
