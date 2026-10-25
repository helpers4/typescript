/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { addDays, addMonths, addYears, endOf, startOf } from '@helpers4/date';
import { RUN, consume } from '../../scripts/bench';

const date = new Date('2025-01-19T12:00:00Z');

test('addDays', async ({ bench }) => {
  await bench.compare(
    bench('add 1 day', () => {
      consume(addDays(date, 1));
    }),
    bench('add 365 days', () => {
      consume(addDays(date, 365));
    }),
    bench('subtract 30 days', () => {
      consume(addDays(date, -30));
    }),
    RUN,
  );
});

test('addMonths', async ({ bench }) => {
  await bench.compare(
    bench('add 1 month', () => {
      consume(addMonths(date, 1));
    }),
    bench('add 12 months', () => {
      consume(addMonths(date, 12));
    }),
    bench('end-of-month clamping (Jan 31 + 1)', () => {
      consume(addMonths(new Date('2025-01-31'), 1));
    }),
    RUN,
  );
});

test('addYears', async ({ bench }) => {
  await bench.compare(
    bench('add 1 year', () => {
      consume(addYears(date, 1));
    }),
    bench('leap day + 1 year', () => {
      consume(addYears(new Date('2024-02-29'), 1));
    }),
    RUN,
  );
});

test('startOf', async ({ bench }) => {
  await bench.compare(
    bench('day', () => {
      consume(startOf(date, 'day'));
    }),
    bench('month', () => {
      consume(startOf(date, 'month'));
    }),
    bench('year', () => {
      consume(startOf(date, 'year'));
    }),
    RUN,
  );
});

test('endOf', async ({ bench }) => {
  await bench.compare(
    bench('day', () => {
      consume(endOf(date, 'day'));
    }),
    bench('month', () => {
      consume(endOf(date, 'month'));
    }),
    bench('year', () => {
      consume(endOf(date, 'year'));
    }),
    RUN,
  );
});
