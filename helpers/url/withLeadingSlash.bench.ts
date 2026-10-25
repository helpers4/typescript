/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { withLeadingSlash } from '@helpers4/url';
import { RUN, consume } from '../../scripts/bench';

test('withLeadingSlash', async ({ bench }) => {
  await bench.compare(
    bench('with no input', () => {
      consume(withLeadingSlash(undefined));
    }),
    bench('with empty string', () => {
      consume(withLeadingSlash(''));
    }),
    bench('with missing leading slash', () => {
      consume(withLeadingSlash('some/path'));
    }),
    bench('with leading slash', () => {
      consume(withLeadingSlash('/some/path'));
    }),
    RUN,
  );
});
