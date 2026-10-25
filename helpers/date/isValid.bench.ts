/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { isValid } from '@helpers4/date';
import { RUN, consume } from '../../scripts/bench';

const validDate = new Date();
const invalidDate = new Date('invalid');

test('isValid', async ({ bench }) => {
  await bench.compare(
    bench('valid Date instance', () => {
      consume(isValid(validDate));
    }),
    bench('invalid Date instance', () => {
      consume(isValid(invalidDate));
    }),
    bench('non-Date value', () => {
      consume(isValid('2023-01-01'));
    }),
    RUN,
  );
});
