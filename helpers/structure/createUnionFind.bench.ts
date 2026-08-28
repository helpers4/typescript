/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { createUnionFind } from './createUnionFind';

describe('createUnionFind', () => {
  bench('1 000 sequential unions', () => {
    const uf = createUnionFind<number>();
    for (let i = 1; i < 1000; i++) uf.union(i - 1, i);
  });

  bench('connected() after 1 000 unions', () => {
    const uf = createUnionFind<number>();
    for (let i = 1; i < 1000; i++) uf.union(i - 1, i);
    uf.connected(0, 999);
  });
});
