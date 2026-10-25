/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { capitalize } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

const short = 'hello';
const long = 'hELLO '.repeat(200);

test('capitalize', async ({ bench }) => {
  await bench.compare(
    bench('short string, default options', () => {
      consume(capitalize(short));
    }),
    bench('long string, default options', () => {
      consume(capitalize(long));
    }),
    bench('short string, lowercaseRest: false', () => {
      consume(capitalize(short, { lowercaseRest: false }));
    }),
    RUN,
  );
});
