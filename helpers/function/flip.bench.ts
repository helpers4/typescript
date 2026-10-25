/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { flip } from '@helpers4/function';
import { RUN, consume } from '../../scripts/bench';

const subtract = (a: number, b: number): number => a - b;
const flippedSubtract = flip(subtract);

test('flip', async ({ bench }) => {
  await bench.compare(
    bench('build a flipped function', () => {
      consume(flip(subtract));
    }),
    bench('call a pre-built flipped function', () => {
      flippedSubtract(3, 10);
    }),
    RUN,
  );
});
