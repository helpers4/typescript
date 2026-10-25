/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { difference } from '@helpers4/date';
import { RUN, consume } from '../../scripts/bench';

const dateA = new Date('2025-01-01T00:00:00Z');
const dateB = new Date('2025-06-15T12:00:00Z');
const stringA = '2025-01-01T00:00:00Z';
const stringB = '2025-06-15T12:00:00Z';

test('difference', async ({ bench }) => {
  await bench.compare(
    bench('Date instances, default unit (days)', () => {
      consume(difference(dateA, dateB));
    }),
    bench('date strings (parses via ensureDate)', () => {
      consume(difference(stringA, stringB));
    }),
    bench('Date instances, hours unit', () => {
      consume(difference(dateA, dateB, { unit: 'hours' }));
    }),
    RUN,
  );
});
