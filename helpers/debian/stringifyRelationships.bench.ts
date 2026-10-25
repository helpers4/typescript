/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { parseRelationships, stringifyRelationships } from '@helpers4/debian';
import { RUN, consume } from '../../scripts/bench';

const SMALL = parseRelationships('libc6 (>= 2.14)');
const LARGE = parseRelationships(
  Array.from({ length: 200 }, (_, index) => `libpackage${index} (>= 1.${index}) [amd64] | other${index}`).join(', '),
);

test('stringifyRelationships', async ({ bench }) => {
  await bench.compare(
    bench('one versioned package', () => {
      consume(stringifyRelationships(SMALL));
    }),
    bench('200 entries with alternatives', () => {
      consume(stringifyRelationships(LARGE));
    }),
    RUN,
  );
});
