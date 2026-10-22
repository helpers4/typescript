/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { isKnown } from './isKnown';

describe('isKnown', () => {
  bench('known license', () => {
    isKnown('MIT');
  });
  bench('unknown license', () => {
    isKnown('custom:Acme End User License');
  });
});
