/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';

import { extractNumber } from './extractNumber';

describe('extractNumber', () => {
  bench('already a number', () => {
    extractNumber(42);
  });
  bench('plain digits', () => {
    extractNumber('111');
  });
  bench('number with unit suffix', () => {
    extractNumber('16.5px');
  });
  bench('number embedded after a word', () => {
    extractNumber('Wafer 10');
  });
  bench('glued "-" (auto: separator)', () => {
    extractNumber('xxx-111');
  });
  bench('space-separated "-" (auto: sign)', () => {
    extractNumber('xxx -111');
  });
  bench('sign: strict', () => {
    extractNumber('xxx-111', { sign: 'strict' });
  });
  bench('sign: ignore', () => {
    extractNumber('xxx -111', { sign: 'ignore' });
  });
  bench('scientific notation', () => {
    extractNumber('1.5e-10');
  });
  bench('glued exponent suffix (auto: mantissa only)', () => {
    extractNumber('1e5kg');
  });
  bench('no number found', () => {
    extractNumber('no number here');
  });
});
