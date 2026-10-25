/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { escapeRegExp } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

const short = '1 + 1 = 2?';
const plain = 'no special characters here at all';
const long = '(a.b)*+c[d]?'.repeat(200);

test('escapeRegExp', async ({ bench }) => {
  await bench.compare(
    bench('short string with metacharacters', () => {
      consume(escapeRegExp(short));
    }),
    bench('plain string, nothing to escape', () => {
      consume(escapeRegExp(plain));
    }),
    bench('long string with many metacharacters', () => {
      consume(escapeRegExp(long));
    }),
    RUN,
  );
});
