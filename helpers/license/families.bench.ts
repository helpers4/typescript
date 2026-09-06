/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { families } from './families';

describe('families', () => {
  bench('single known token', () => {
    families('GPL-3.0-or-later');
  });
  bench('compound expression', () => {
    families('GPL-2.0+ and LGPL-2.0+ and GFDL-1.3');
  });
  bench('unknown token', () => {
    families('custom:Acme End User License Agreement');
  });
});
