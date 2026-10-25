/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { withoutTrailingSlash } from '@helpers4/url';
import { RUN, consume } from '../../scripts/bench';

test('withoutTrailingSlash', async ({ bench }) => {
  await bench.compare(
    bench('with no input', () => {
      consume(withoutTrailingSlash(undefined));
    }),
    bench('with empty string', () => {
      consume(withoutTrailingSlash(''));
    }),
    bench('with trailing slash', () => {
      consume(withoutTrailingSlash('some/path/'));
    }),
    bench('without trailing slash', () => {
      consume(withoutTrailingSlash('some/path'));
    }),
    RUN,
  );
});
