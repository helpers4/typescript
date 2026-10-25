/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { withTrailingSlash } from '@helpers4/url';
import { RUN, consume } from '../../scripts/bench';

test('withTrailingSlash', async ({ bench }) => {
  await bench.compare(
    bench('with no input', () => {
      consume(withTrailingSlash(undefined));
    }),
    bench('with empty string', () => {
      consume(withTrailingSlash(''));
    }),
    bench('with missing trailing slash', () => {
      consume(withTrailingSlash('some/path'));
    }),
    bench('with trailing slash', () => {
      consume(withTrailingSlash('some/path/'));
    }),
    RUN,
  );
});
