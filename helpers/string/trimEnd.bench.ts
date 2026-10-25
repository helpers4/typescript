/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { trimEnd } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

const short = 'Hello   ';
const long = 'Hello, world! '.repeat(200) + '   ';

test('trimEnd', async ({ bench }) => {
  await bench.compare(
    bench('short string, default (whitespace) mode - native fast path', () => {
      consume(trimEnd(short));
    }),
    bench('short string, wrappable mode - regex path', () => {
      consume(trimEnd(short, 'wrappable'));
    }),
    bench('long string, default (whitespace) mode - native fast path', () => {
      consume(trimEnd(long));
    }),
    bench('long string, wrappable mode - regex path', () => {
      consume(trimEnd(long, 'wrappable'));
    }),
    bench('long string, unicode mode - regex path', () => {
      consume(trimEnd(long, 'unicode'));
    }),
    RUN,
  );
});
