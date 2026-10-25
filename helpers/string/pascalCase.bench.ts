/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { pascalCase } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

test('pascalCase', async ({ bench }) => {
  await bench.compare(
    bench('from kebab-case', () => {
      consume(pascalCase('hello-world'));
    }),
    bench('multiple segments', () => {
      consume(pascalCase('my-long-variable-name'));
    }),
    bench('already PascalCase', () => {
      consume(pascalCase('HelloWorld'));
    }),
    bench('single word', () => {
      consume(pascalCase('hello'));
    }),
    RUN,
  );
});
