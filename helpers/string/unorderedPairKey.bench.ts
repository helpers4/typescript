/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { unorderedPairKey } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

test('unorderedPairKey', async ({ bench }) => {
  await bench('short strings', () => {
      consume(unorderedPairKey('bob', 'alice'));
    }).run(RUN);
});
