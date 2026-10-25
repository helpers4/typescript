/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { createSortByBooleanFn } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

interface Row {
  readonly isDefault: boolean
}

const rows: Row[] = Array.from({ length: 1_000 }, (_, i) => ({ isDefault: i % 3 === 0 }));
const sortFn = createSortByBooleanFn<Row>('isDefault');

test('createSortByBooleanFn', async ({ bench }) => {
  await bench.compare(
    bench('sort 1000 rows by boolean property', () => {
      [...rows].sort(sortFn);
    }),
    bench('build the comparator (no sort)', () => {
      consume(createSortByBooleanFn<Row>('isDefault'));
    }),
    RUN,
  );
});
