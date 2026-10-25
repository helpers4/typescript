/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { isSameDay, isSameMonth, isSameYear } from '@helpers4/date';
import { RUN, consume } from '../../scripts/bench';

const dateA = new Date('2025-06-15T08:00:00Z');
const dateB = new Date('2025-06-15T22:00:00Z');
const dateC = new Date('2025-11-02T00:00:00Z');

test('is', async ({ bench }) => {
  await bench.compare(
    bench('isSameDay, same day', () => {
      consume(isSameDay(dateA, dateB));
    }),
    bench('isSameMonth, different day same month', () => {
      consume(isSameMonth(dateA, dateB));
    }),
    bench('isSameYear, different month same year', () => {
      consume(isSameYear(dateA, dateC));
    }),
    RUN,
  );
});
