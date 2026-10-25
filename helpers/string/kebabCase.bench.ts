/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { kebabCase } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

test('kebabCase', async ({ bench }) => {
  await bench.compare(
    bench('simple camelCase', () => {
      consume(kebabCase('helloWorld'));
    }),
    bench('multiple segments', () => {
      consume(kebabCase('myLongVariableName'));
    }),
    bench('already kebab-case', () => {
      consume(kebabCase('hello-world'));
    }),
    bench('single word', () => {
      consume(kebabCase('hello'));
    }),
    RUN,
  );
});
