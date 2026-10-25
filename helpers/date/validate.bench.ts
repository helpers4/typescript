/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { isValidDateString } from '@helpers4/date';
import { RUN, consume } from '../../scripts/bench';

test('validate', async ({ bench }) => {
  await bench.compare(
    bench('valid ISO date string', () => {
      consume(isValidDateString('2025-01-19T12:00:00Z'));
    }),
    bench('invalid string', () => {
      consume(isValidDateString('not a date'));
    }),
    bench('empty string (short-circuit)', () => {
      consume(isValidDateString(''));
    }),
    RUN,
  );
});
