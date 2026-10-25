/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { trimStart } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

const short = '   Hello';
const long = '   ' + 'Hello, world! '.repeat(200);

test('trimStart', async ({ bench }) => {
  await bench.compare(
    bench('short string, default (whitespace) mode - native fast path', () => {
      consume(trimStart(short));
    }),
    bench('short string, wrappable mode - regex path', () => {
      consume(trimStart(short, 'wrappable'));
    }),
    bench('long string, default (whitespace) mode - native fast path', () => {
      consume(trimStart(long));
    }),
    bench('long string, wrappable mode - regex path', () => {
      consume(trimStart(long, 'wrappable'));
    }),
    RUN,
  );
});
