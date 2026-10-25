/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { titleCase } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

test('titleCase', async ({ bench }) => {
  await bench.compare(
    bench('simple string', () => {
      consume(titleCase('hello world'));
    }),
    bench('from kebab-case', () => {
      consume(titleCase('hello-world-foo'));
    }),
    bench('already title case', () => {
      consume(titleCase('Hello World'));
    }),
    bench('long string', () => {
      consume(titleCase('the quick brown fox jumps over the lazy dog'));
    }),
    RUN,
  );
});
