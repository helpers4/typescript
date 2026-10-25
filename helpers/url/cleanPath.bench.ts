/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { cleanPath } from '@helpers4/url';
import { RUN, consume } from '../../scripts/bench';

test('cleanPath', async ({ bench }) => {
  await bench.compare(
    bench('with no input', () => {
      consume(cleanPath(undefined));
    }),
    bench('with empty string', () => {
      consume(cleanPath(''));
    }),
    bench('with correct path', () => {
      consume(cleanPath('/some/path'));
    }),
    bench('with multiple slashes in path', () => {
      consume(cleanPath('/some//path'));
    }),
    bench('with protocol, path, query, and fragment', () => {
      consume(cleanPath('https://server//some//path?query=thing#fragment'));
    }),
    RUN,
  );
});
