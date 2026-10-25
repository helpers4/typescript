/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { isHostname } from '@helpers4/guard';
import { RUN, consume } from '../../scripts/bench';

const longName = Array.from({ length: 4 }, () => 'a'.repeat(61)).join('.');
const invalidAtEnd = 'a'.repeat(60) + '.example.com:80';

test('isHostname', async ({ bench }) => {
  await bench.compare(
    bench('short name', () => {
      consume(isHostname('example.com'));
    }),
    bench('long name (~245 chars)', () => {
      consume(isHostname(longName));
    }),
    bench('invalid, fails at the end', () => {
      consume(isHostname(invalidAtEnd));
    }),
    bench('non-string', () => {
      consume(isHostname(42));
    }),
    RUN,
  );
});
