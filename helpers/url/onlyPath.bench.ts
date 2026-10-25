/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { onlyPath } from '@helpers4/url';
import { RUN, consume } from '../../scripts/bench';

test('onlyPath', async ({ bench }) => {
  await bench.compare(
    bench('with no input', () => {
      consume(onlyPath(undefined));
    }),
    bench('with empty string', () => {
      consume(onlyPath(''));
    }),
    bench('with path only', () => {
      consume(onlyPath('/some/path'));
    }),
    bench('with path and query', () => {
      consume(onlyPath('/some/path?query=thing'));
    }),
    bench('with path and fragment', () => {
      consume(onlyPath('/some/path#fragment'));
    }),
    bench('with path, query, and fragment', () => {
      consume(onlyPath('/some/path?query=thing#fragment'));
    }),
    RUN,
  );
});
