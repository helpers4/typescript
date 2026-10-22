/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { agree } from './agree';

describe('agree', () => {
  bench('matching families', () => {
    agree('GPL3', 'GPL-3.0-or-later');
  });
  bench('conflicting families', () => {
    agree('BSD-2-Clause', 'Apache-2.0');
  });
  bench('one side non-informative', () => {
    agree('custom', 'MIT');
  });
});
