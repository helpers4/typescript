/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { snakeCase } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

test('snakeCase', async ({ bench }) => {
  await bench.compare(
    bench('from camelCase', () => {
      consume(snakeCase('helloWorld'));
    }),
    bench('multiple segments', () => {
      consume(snakeCase('myLongVariableName'));
    }),
    bench('already snake_case', () => {
      consume(snakeCase('hello_world'));
    }),
    bench('single word', () => {
      consume(snakeCase('hello'));
    }),
    RUN,
  );
});
