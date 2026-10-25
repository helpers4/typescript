/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { leadingSentence } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

const short = 'Hello world. More text here.';
const noTerminator = 'no terminator here '.repeat(100);
const terminatorNearEnd = `${'filler word '.repeat(100)}Done.`;

test('leadingSentence', async ({ bench }) => {
  await bench.compare(
    bench('short string, early terminator', () => {
      consume(leadingSentence(short));
    }),
    bench('long string, no terminator (full scan)', () => {
      consume(leadingSentence(noTerminator));
    }),
    bench('long string, terminator near the end', () => {
      consume(leadingSentence(terminatorNearEnd));
    }),
    RUN,
  );
});
