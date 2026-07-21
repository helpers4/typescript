/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { findValue } from './findValue';

const large = new Map(Array.from({ length: 10_000 }, (_, i) => [i, i]));

describe('findValue', () => {
  bench('large map, match near the start', () => {
    findValue(large, (value) => value === 5);
  });
  bench('large map, match near the end', () => {
    findValue(large, (value) => value === 9_995);
  });
  bench('large map, no match (full scan)', () => {
    findValue(large, (value) => value === -1);
  });
});
