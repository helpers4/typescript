/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { matchGlob } from './matchGlob';

describe('matchGlob', () => {
  bench('match a file name', () => {
    matchGlob('*.test.ts', 'helper.test.ts');
  });
  bench('case-insensitive miss', () => {
    matchGlob('Screen ?', 'Dialog 2', false);
  });
});
