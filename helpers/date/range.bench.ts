/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { clampDate, eachDay, eachMonth, isWithinRange, overlaps } from '@helpers4/date';
import { RUN, consume } from '../../scripts/bench';

const start = new Date('2025-01-01');
const end = new Date('2025-01-31');
const mid = new Date('2025-01-15');
const outside = new Date('2025-06-15');

const rangeA = { start: new Date('2025-01-01'), end: new Date('2025-01-31') };
const rangeB = { start: new Date('2025-01-15'), end: new Date('2025-02-15') };
const rangeC = { start: new Date('2025-03-01'), end: new Date('2025-03-31') };

test('isWithinRange', async ({ bench }) => {
  await bench.compare(
    bench('inside', () => {
      consume(isWithinRange(mid, start, end));
    }),
    bench('outside', () => {
      consume(isWithinRange(outside, start, end));
    }),
    bench('boundary', () => {
      consume(isWithinRange(start, start, end));
    }),
    RUN,
  );
});

test('clampDate', async ({ bench }) => {
  await bench.compare(
    bench('already within', () => {
      consume(clampDate(mid, start, end));
    }),
    bench('clamp up', () => {
      consume(clampDate(new Date('2024-12-01'), start, end));
    }),
    RUN,
  );
});

test('overlaps', async ({ bench }) => {
  await bench.compare(
    bench('overlapping ranges', () => {
      consume(overlaps(rangeA, rangeB));
    }),
    bench('non-overlapping ranges', () => {
      consume(overlaps(rangeA, rangeC));
    }),
    RUN,
  );
});

test('eachDay', async ({ bench }) => {
  await bench.compare(
    bench('7 days', () => {
      consume(eachDay(new Date('2025-01-01'), new Date('2025-01-07')));
    }),
    bench('31 days', () => {
      consume(eachDay(start, end));
    }),
    bench('90 days', () => {
      consume(eachDay(new Date('2025-01-01'), new Date('2025-03-31')));
    }),
    RUN,
  );
});

test('eachMonth', async ({ bench }) => {
  await bench.compare(
    bench('6 months', () => {
      consume(eachMonth(new Date('2025-01-01'), new Date('2025-06-30')));
    }),
    bench('12 months', () => {
      consume(eachMonth(new Date('2025-01-01'), new Date('2025-12-31')));
    }),
    RUN,
  );
});
