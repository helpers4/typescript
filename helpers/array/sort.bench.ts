/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { sortNumberAscFn, sortStringAscFn } from './sort';

const numbers = [5, 3, 8, 1, 9, 2, 7, 4, 6, 10];
const strings = ['banana', 'apple', 'cherry', 'date', 'elderberry', 'fig', 'grape'];

describe('sort', () => {
  bench('numbers ascending (10 items)', () => {
    [...numbers].sort(sortNumberAscFn);
  });
  bench('strings ascending (7 items)', () => {
    [...strings].sort(sortStringAscFn);
  });
});
