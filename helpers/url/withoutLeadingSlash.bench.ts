/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { withoutLeadingSlash } from '@helpers4/url';
import { RUN, consume } from '../../scripts/bench';

test('withoutLeadingSlash', async ({ bench }) => {
  await bench.compare(
    bench('with no input', () => {
      consume(withoutLeadingSlash(undefined));
    }),
    bench('with empty string', () => {
      consume(withoutLeadingSlash(''));
    }),
    bench('with leading slash', () => {
      consume(withoutLeadingSlash('/some/path'));
    }),
    bench('without leading slash', () => {
      consume(withoutLeadingSlash('some/path'));
    }),
    RUN,
  );
});
