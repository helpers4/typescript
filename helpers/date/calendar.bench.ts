/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { daysInMonth, isBusinessDay, isLeapYear, isValidDateString, isWeekend } from '@helpers4/date';
import { RUN, consume } from '../../scripts/bench';

const saturday = new Date('2025-01-18');
const monday = new Date('2025-01-13');

test('isLeapYear', async ({ bench }) => {
  await bench.compare(
    bench('leap year (2024)', () => {
      consume(isLeapYear(2024));
    }),
    bench('non-leap year (2025)', () => {
      consume(isLeapYear(2025));
    }),
    bench('century leap (2000)', () => {
      consume(isLeapYear(2000));
    }),
    bench('century non-leap (1900)', () => {
      consume(isLeapYear(1900));
    }),
    RUN,
  );
});

test('daysInMonth', async ({ bench }) => {
  await bench.compare(
    bench('January', () => {
      consume(daysInMonth(2025, 1));
    }),
    bench('February (leap)', () => {
      consume(daysInMonth(2024, 2));
    }),
    bench('February (non-leap)', () => {
      consume(daysInMonth(2025, 2));
    }),
    RUN,
  );
});

test('isWeekend', async ({ bench }) => {
  await bench.compare(
    bench('Saturday (default)', () => {
      consume(isWeekend(saturday));
    }),
    bench('Monday (default)', () => {
      consume(isWeekend(monday));
    }),
    bench('custom weekendDays [5, 6]', () => {
      consume(isWeekend(saturday, [5, 6]));
    }),
    RUN,
  );
});

test('isBusinessDay', async ({ bench }) => {
  await bench.compare(
    bench('Monday (default)', () => {
      consume(isBusinessDay(monday));
    }),
    bench('Saturday (default)', () => {
      consume(isBusinessDay(saturday));
    }),
    RUN,
  );
});

test('isValidDateString', async ({ bench }) => {
  await bench.compare(
    bench('valid ISO', () => {
      consume(isValidDateString('2025-01-19T12:00:00Z'));
    }),
    bench('valid informal', () => {
      consume(isValidDateString('Jan 19, 2025'));
    }),
    bench('invalid', () => {
      consume(isValidDateString('not a date'));
    }),
    bench('empty', () => {
      consume(isValidDateString(''));
    }),
    RUN,
  );
});
