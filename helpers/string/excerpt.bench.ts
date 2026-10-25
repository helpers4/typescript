/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { excerpt } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

const longText =
  'Take a trip to fame and fortune by building the biggest, best, scariest, and most thrilling rides ever seen in any theme park. Can you make money in this volatile business? One of the best games from the acclaimed Tycoon series, with well designed levels and engaging gameplay.';

test('excerpt', async ({ bench }) => {
  await bench.compare(
    bench('already within limit', () => {
      consume(excerpt('A short game about ducks.', 200));
    }),
    bench('cuts at a sentence boundary', () => {
      consume(excerpt(longText, 200));
    }),
    bench('falls back to a word boundary', () => {
      consume(excerpt(longText, 40));
    }),
    RUN,
  );
});
