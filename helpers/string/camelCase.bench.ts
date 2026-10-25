/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { camelCase } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

test('camelCase', async ({ bench }) => {
  await bench.compare(
    bench('simple kebab-case', () => {
      consume(camelCase('hello-world'));
    }),
    bench('multiple segments', () => {
      consume(camelCase('my-long-variable-name'));
    }),
    bench('already camelCase', () => {
      consume(camelCase('helloWorld'));
    }),
    bench('single word', () => {
      consume(camelCase('hello'));
    }),
    RUN,
  );
});
