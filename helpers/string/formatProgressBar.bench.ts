/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { formatProgressBar } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

test('formatProgressBar', async ({ bench }) => {
  await bench.compare(
    bench('default options, 65%', () => {
      consume(formatProgressBar(65));
    }),
    bench('default options, 0%', () => {
      consume(formatProgressBar(0));
    }),
    bench('default options, 100%', () => {
      consume(formatProgressBar(100));
    }),
    bench('custom width and max', () => {
      consume(formatProgressBar(3, { width: 10, max: 5, filledChar: '#', emptyChar: '-' }));
    }),
    bench('clamped value above max', () => {
      consume(formatProgressBar(150));
    }),
    bench('negative value', () => {
      consume(formatProgressBar(-10));
    }),
    RUN,
  );
});
