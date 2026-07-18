/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';

import { formatProgressBar } from './formatProgressBar';

describe('formatProgressBar', () => {
  bench('default options, 65%', () => {
    formatProgressBar(65);
  });

  bench('default options, 0%', () => {
    formatProgressBar(0);
  });

  bench('default options, 100%', () => {
    formatProgressBar(100);
  });

  bench('custom width and max', () => {
    formatProgressBar(3, { width: 10, max: 5, filledChar: '#', emptyChar: '-' });
  });

  bench('clamped value above max', () => {
    formatProgressBar(150);
  });

  bench('negative value', () => {
    formatProgressBar(-10);
  });
});
