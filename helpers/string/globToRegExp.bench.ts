/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { globToRegExp } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

test('globToRegExp', async ({ bench }) => {
  await bench.compare(
    bench('compile a simple pattern', () => {
      consume(globToRegExp('*.test.ts'));
    }),
    bench('compile a pattern with multiple wildcards', () => {
      consume(globToRegExp('report-????-*.csv'));
    }),
    RUN,
  );
});
