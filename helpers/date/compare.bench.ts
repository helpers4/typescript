/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { compare, difference, isSameDay, isSameMonth, isSameYear } from '@helpers4/date';
import { RUN, consume } from '../../scripts/bench';

const a = new Date('2025-01-19T12:00:00Z');
const b = new Date('2025-06-15T08:30:00Z');
const same = new Date('2025-01-19T23:59:59Z');

test('compare', async ({ bench }) => {
  await bench.compare(
    bench('before (default)', () => {
      consume(compare(a, b));
    }),
    bench('before with months precision', () => {
      consume(compare(a, b, { precision: 'months' }));
    }),
    bench('before with years precision', () => {
      consume(compare(a, b, { precision: 'years' }));
    }),
    bench('from string inputs', () => {
      consume(compare('2025-01-19', '2025-06-15'));
    }),
    RUN,
  );
});

test('difference', async ({ bench }) => {
  await bench.compare(
    bench('days', () => {
      consume(difference(a, b, { unit: 'days' }));
    }),
    bench('hours', () => {
      consume(difference(a, b, { unit: 'hours' }));
    }),
    bench('milliseconds', () => {
      consume(difference(a, b, { unit: 'milliseconds' }));
    }),
    bench('from string inputs', () => {
      consume(difference('2025-01-19', '2025-06-15', { unit: 'days' }));
    }),
    RUN,
  );
});

test('isSameDay', async ({ bench }) => {
  await bench.compare(
    bench('same day', () => {
      consume(isSameDay(a, same));
    }),
    bench('different day', () => {
      consume(isSameDay(a, b));
    }),
    RUN,
  );
});

test('isSameMonth', async ({ bench }) => {
  await bench.compare(
    bench('same month', () => {
      consume(isSameMonth(a, same));
    }),
    bench('different month', () => {
      consume(isSameMonth(a, b));
    }),
    RUN,
  );
});

test('isSameYear', async ({ bench }) => {
  await bench('same year', () => {
      consume(isSameYear(a, b));
    }).run(RUN);
});
