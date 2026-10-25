/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { createMatcher } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

const matches = createMatcher(['Screen *', '/^(Home|Login)$/', '!* (old)']);

test('createMatcher', async ({ bench }) => {
  await bench.compare(
    bench('create from three patterns', () => {
      consume(createMatcher(['Screen *', '/^(Home|Login)$/', '!* (old)']));
    }),
    bench('match with a created matcher', () => {
      matches('Screen 2 (old)');
    }),
    RUN,
  );
});
