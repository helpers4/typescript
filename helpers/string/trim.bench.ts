/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { trim } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

const short = '   Hello   ';
const long = '   ' + 'Hello, world! '.repeat(200) + '   ';

test('trim', async ({ bench }) => {
  await bench.compare(
    bench('short string, default (whitespace) mode - native fast path', () => {
      consume(trim(short));
    }),
    bench('short string, wrappable mode - regex path', () => {
      consume(trim(short, 'wrappable'));
    }),
    bench('long string, default (whitespace) mode - native fast path', () => {
      consume(trim(long));
    }),
    bench('long string, wrappable mode - regex path', () => {
      consume(trim(long, 'wrappable'));
    }),
    bench('long string, unicode mode - regex path', () => {
      consume(trim(long, 'unicode'));
    }),
    RUN,
  );
});
