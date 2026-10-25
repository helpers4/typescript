/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { parseDependencies } from '@helpers4/package';
import { RUN, consume } from '../../scripts/bench';

const SMALL = 'libc6 (>= 2.14)';
const FULL = 'libc6 (>= 2.34), python3:any | python3 (>= 3.8) [amd64], foo <!nocheck>';
const LARGE = Array.from({ length: 200 }, (_, index) => `libpackage${index} (>= 1.${index}) | other${index}`).join(',\n ');

test('parseDependencies', async ({ bench }) => {
  await bench.compare(
    bench('one versioned package', () => {
      consume(parseDependencies(SMALL, 'debian'));
    }),
    bench('every kind of part', () => {
      consume(parseDependencies(FULL, 'debian'));
    }),
    bench('200 entries with alternatives', () => {
      consume(parseDependencies(LARGE, 'debian'));
    }),
    RUN,
  );
});
