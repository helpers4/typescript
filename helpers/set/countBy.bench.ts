/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { countBy } from './countBy';

const small = new Set([1, 2, 3, 4, 5]);
const large = new Set(Array.from({ length: 10_000 }, (_, i) => i));

describe('countBy', () => {
  bench('small set, few groups', () => {
    countBy(small, (value) => (value % 2 === 0 ? 'even' : 'odd'));
  });
  bench('large set, few groups', () => {
    countBy(large, (value) => (value % 2 === 0 ? 'even' : 'odd'));
  });
  bench('large set, many groups', () => {
    countBy(large, (value) => value % 1000);
  });
});
