/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { fromMillis, fromSeconds, isTimestampInSeconds, normalizeTimestamp, toMillis, toSeconds } from '@helpers4/date';
import { RUN, consume } from '../../scripts/bench';

const dateObj = new Date('2025-01-19T12:00:00Z');
const seconds = 1737288000;
const millis = 1737288000000;

test('isTimestampInSeconds', async ({ bench }) => {
  await bench.compare(
    bench('seconds-range', () => {
      consume(isTimestampInSeconds(seconds));
    }),
    bench('millis-range', () => {
      consume(isTimestampInSeconds(millis));
    }),
    bench('negative seconds', () => {
      consume(isTimestampInSeconds(-seconds));
    }),
    RUN,
  );
});

test('normalizeTimestamp', async ({ bench }) => {
  await bench.compare(
    bench('from seconds', () => {
      consume(normalizeTimestamp(seconds));
    }),
    bench('from millis (no-op)', () => {
      consume(normalizeTimestamp(millis));
    }),
    RUN,
  );
});

test('toSeconds', async ({ bench }) => {
  await bench.compare(
    bench('from Date', () => {
      consume(toSeconds(dateObj));
    }),
    bench('from ISO string', () => {
      consume(toSeconds('2025-01-19T12:00:00Z'));
    }),
    RUN,
  );
});

test('toMillis', async ({ bench }) => {
  await bench.compare(
    bench('from Date', () => {
      consume(toMillis(dateObj));
    }),
    bench('from ISO string', () => {
      consume(toMillis('2025-01-19T12:00:00Z'));
    }),
    RUN,
  );
});

test('fromSeconds', async ({ bench }) => {
  await bench.compare(
    bench('positive', () => {
      consume(fromSeconds(seconds));
    }),
    bench('zero', () => {
      consume(fromSeconds(0));
    }),
    bench('negative', () => {
      consume(fromSeconds(-seconds));
    }),
    RUN,
  );
});

test('fromMillis', async ({ bench }) => {
  await bench.compare(
    bench('positive', () => {
      consume(fromMillis(millis));
    }),
    bench('zero', () => {
      consume(fromMillis(0));
    }),
    RUN,
  );
});
