/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { createSafeMatcher } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

test('createSafeMatcher', async ({ bench }) => {
  await bench.compare(
    bench('valid patterns', () => {
      consume(createSafeMatcher(['Screen *', '!* (old)']));
    }),
    bench('invalid regular expression', () => {
      consume(createSafeMatcher('/(/'));
    }),
    RUN,
  );
});
