/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { findKey } from './findKey';

const large = new Map(Array.from({ length: 10_000 }, (_, i) => [i, i]));

describe('findKey', () => {
  bench('large map, match near the start', () => {
    findKey(large, (value) => value === 5);
  });
  bench('large map, match near the end', () => {
    findKey(large, (value) => value === 9_995);
  });
  bench('large map, no match (full scan)', () => {
    findKey(large, (value) => value === -1);
  });
});
