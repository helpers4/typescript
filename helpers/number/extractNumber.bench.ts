/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { extractNumber } from '@helpers4/number';
import { RUN, consume } from '../../scripts/bench';

test('extractNumber', async ({ bench }) => {
  await bench.compare(
    bench('already a number', () => {
      consume(extractNumber(42));
    }),
    bench('plain digits', () => {
      consume(extractNumber('111'));
    }),
    bench('number with unit suffix', () => {
      consume(extractNumber('16.5px'));
    }),
    bench('number embedded after a word', () => {
      consume(extractNumber('Wafer 10'));
    }),
    bench('glued "-" (auto: separator)', () => {
      consume(extractNumber('xxx-111'));
    }),
    bench('space-separated "-" (auto: sign)', () => {
      consume(extractNumber('xxx -111'));
    }),
    bench('sign: strict', () => {
      consume(extractNumber('xxx-111', { sign: 'strict' }));
    }),
    bench('sign: ignore', () => {
      consume(extractNumber('xxx -111', { sign: 'ignore' }));
    }),
    bench('scientific notation', () => {
      consume(extractNumber('1.5e-10'));
    }),
    bench('glued exponent suffix (auto: mantissa only)', () => {
      consume(extractNumber('1e5kg'));
    }),
    bench('no number found', () => {
      consume(extractNumber('no number here'));
    }),
    RUN,
  );
});
