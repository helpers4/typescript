/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { extractPureURI } from '@helpers4/url';
import { RUN, consume } from '../../scripts/bench';

test('extractPureURI', async ({ bench }) => {
  await bench.compare(
    bench('with no input', () => {
      consume(extractPureURI(undefined));
    }),
    bench('with empty string', () => {
      consume(extractPureURI(''));
    }),
    bench('with path only', () => {
      consume(extractPureURI('/some/path'));
    }),
    bench('with query string', () => {
      consume(extractPureURI('/some/path?query=thing'));
    }),
    bench('with fragment', () => {
      consume(extractPureURI('/some/path#fragment'));
    }),
    bench('with query and fragment', () => {
      consume(extractPureURI('/some/path?query=thing#fragment'));
    }),
    bench('with full URL', () => {
      consume(extractPureURI('https://example.com/some/path?query=thing#fragment'));
    }),
    RUN,
  );
});
