/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { unorderedPairKey } from './unorderedPairKey';

describe('unorderedPairKey', () => {
  bench('short strings', () => {
    unorderedPairKey('bob', 'alice');
  });
});
