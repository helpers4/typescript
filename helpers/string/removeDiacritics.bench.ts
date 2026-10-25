/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { removeDiacritics } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

const short = 'café';
const plainAscii = 'hello world, nothing to strip here';
const long = 'café naïve résumé ÉCOLE piñata jalapeño '.repeat(100);

test('removeDiacritics', async ({ bench }) => {
  await bench.compare(
    bench('short string with diacritics', () => {
      consume(removeDiacritics(short));
    }),
    bench('plain ASCII, nothing to strip', () => {
      consume(removeDiacritics(plainAscii));
    }),
    bench('long string with many diacritics', () => {
      consume(removeDiacritics(long));
    }),
    RUN,
  );
});
