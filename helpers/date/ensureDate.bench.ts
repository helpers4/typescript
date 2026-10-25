/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { ensureDate } from '@helpers4/date';
import { RUN, consume } from '../../scripts/bench';

const dateObj = new Date('2025-01-19T12:00:00Z');
const millis = 1737288000000;
const seconds = 1737288000;
const isoString = '2025-01-19T12:00:00Z';
const epochMs = Temporal.Instant.fromEpochMilliseconds(1737288000000);

test('ensureDate', async ({ bench }) => {
  await bench.compare(
    bench('from Date object', () => {
      consume(ensureDate(dateObj));
    }),
    bench('from milliseconds timestamp', () => {
      consume(ensureDate(millis));
    }),
    bench('from seconds timestamp', () => {
      consume(ensureDate(seconds));
    }),
    bench('from ISO string', () => {
      consume(ensureDate(isoString));
    }),
    bench('from Temporal.Instant', () => {
      consume(ensureDate(epochMs));
    }),
    bench('null input', () => {
      consume(ensureDate(null));
    }),
    bench('invalid string', () => {
      consume(ensureDate('not-a-date'));
    }),
    RUN,
  );
});
