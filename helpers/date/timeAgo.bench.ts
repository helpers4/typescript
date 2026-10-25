/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { timeAgo } from '@helpers4/date';
import { RUN, consume } from '../../scripts/bench';

const now = new Date('2025-06-15T12:00:00Z');
const secondsAgo = new Date('2025-06-15T11:59:30Z');
const yearsAgo = new Date('2020-01-01T00:00:00Z');

test('timeAgo', async ({ bench }) => {
  await bench.compare(
    bench('seconds ago', () => {
      consume(timeAgo(secondsAgo, { now }));
    }),
    bench('years ago', () => {
      consume(timeAgo(yearsAgo, { now }));
    }),
    bench('with explicit locale', () => {
      consume(timeAgo(yearsAgo, { now, locale: 'fr' }));
    }),
    RUN,
  );
});
