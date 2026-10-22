/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { excerpt } from './excerpt';

const longText =
  'Take a trip to fame and fortune by building the biggest, best, scariest, and most thrilling rides ever seen in any theme park. Can you make money in this volatile business? One of the best games from the acclaimed Tycoon series, with well designed levels and engaging gameplay.';

describe('excerpt', () => {
  bench('already within limit', () => {
    excerpt('A short game about ducks.', 200);
  });
  bench('cuts at a sentence boundary', () => {
    excerpt(longText, 200);
  });
  bench('falls back to a word boundary', () => {
    excerpt(longText, 40);
  });
});
