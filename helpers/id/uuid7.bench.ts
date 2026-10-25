/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { uuid7 } from '@helpers4/id';
import { RUN, consume } from '../../scripts/bench';

test('uuid7', async ({ bench }) => {
  await bench('generate a single UUID v7', () => {
      consume(uuid7());
    }).run(RUN);
});
