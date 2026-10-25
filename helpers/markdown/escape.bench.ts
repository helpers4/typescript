/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { escape } from '@helpers4/markdown';
import { RUN, consume } from '../../scripts/bench';

const short = '**bold** and _italic_';
const plain = 'no special characters here at all';
const long = '**bold** _italic_ [link](url) # heading\n'.repeat(100);

test('escape', async ({ bench }) => {
  await bench.compare(
    bench('short string with markdown syntax', () => {
      consume(escape(short));
    }),
    bench('plain string, nothing to escape', () => {
      consume(escape(plain));
    }),
    bench('long string, table cell mode', () => {
      consume(escape(long, { cell: true }));
    }),
    RUN,
  );
});
