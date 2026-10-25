/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { parseDependencies, stringifyDependencies } from '@helpers4/package';
import { RUN, consume } from '../../scripts/bench';

const SMALL = parseDependencies('libc6 (>= 2.14)', 'debian');
const LARGE = parseDependencies(
  Array.from({ length: 200 }, (_, index) => `libpackage${index} (>= 1.${index}) [amd64] | other${index}`).join(', '),
  'debian',
);

test('stringifyDependencies', async ({ bench }) => {
  await bench.compare(
    bench('one versioned package', () => {
      consume(stringifyDependencies(SMALL, 'debian'));
    }),
    bench('200 entries with alternatives', () => {
      consume(stringifyDependencies(LARGE, 'debian'));
    }),
    RUN,
  );
});
