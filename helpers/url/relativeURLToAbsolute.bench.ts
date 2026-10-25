/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { relativeURLToAbsolute } from '@helpers4/url';
import { RUN, consume } from '../../scripts/bench';

test('relativeURLToAbsolute', async ({ bench }) => {
  await bench.compare(
    bench('with simple relative path', () => {
      consume(relativeURLToAbsolute('/some/path'));
    }),
    bench('with nested relative path', () => {
      consume(relativeURLToAbsolute('/some/deep/nested/path'));
    }),
    bench('with trailing slash', () => {
      consume(relativeURLToAbsolute('/some/path/'));
    }),
    bench('without leading slash', () => {
      consume(relativeURLToAbsolute('some/path'));
    }),
    RUN,
  );
});
