/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { findMap } from './findMap';

const array = Array.from({ length: 1000 }, (_, i) => i);

describe('findMap', () => {
  bench('match near the start (short-circuits early)', () => {
    findMap(array, (n) => (n === 5 ? n : undefined));
  });
  bench('match near the end', () => {
    findMap(array, (n) => (n === 995 ? n : undefined));
  });
  bench('no match (scans the whole array)', () => {
    findMap(array, (n) => (n === -1 ? n : undefined));
  });
});
