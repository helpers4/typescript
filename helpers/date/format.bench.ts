/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { formatDuration, timeAgo, toISO8601, toRFC2822, toRFC3339 } from '@helpers4/date';
import { RUN, consume } from '../../scripts/bench';

const date = new Date('2025-01-19T12:00:00Z');
const now = new Date('2025-01-19T14:30:00Z');

test('toISO8601', async ({ bench }) => {
  await bench.compare(
    bench('from Date', () => {
      consume(toISO8601(date));
    }),
    bench('from string', () => {
      consume(toISO8601('2025-01-19T12:00:00Z'));
    }),
    RUN,
  );
});

test('toRFC3339', async ({ bench }) => {
  await bench.compare(
    bench('without millis', () => {
      consume(toRFC3339(date));
    }),
    bench('with millis', () => {
      consume(toRFC3339(date, true));
    }),
    RUN,
  );
});

test('toRFC2822', async ({ bench }) => {
  await bench('from Date', () => {
      consume(toRFC2822(date));
    }).run(RUN);
});

test('timeAgo', async ({ bench }) => {
  await bench.compare(
    bench('2.5 hours ago', () => {
      consume(timeAgo(date, { now }));
    }),
    bench('30 days ago', () => {
      consume(timeAgo(new Date('2024-12-20'), { now }));
    }),
    bench('with locale fr', () => {
      consume(timeAgo(date, { now, locale: 'fr' }));
    }),
    RUN,
  );
});

test('formatDuration', async ({ bench }) => {
  await bench.compare(
    bench('1h 23m 45s', () => {
      consume(formatDuration(5025000));
    }),
    bench('sub-second', () => {
      consume(formatDuration(450));
    }),
    bench('zero', () => {
      consume(formatDuration(0));
    }),
    bench('padded', () => {
      consume(formatDuration(5025000, { padded: true }));
    }),
    bench('large (days)', () => {
      consume(formatDuration(90061000));
    }),
    RUN,
  );
});
