/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { sortStringAscFn, sortStringAscInsensitiveFn, sortStringNaturalAscFn, sortStringNaturalAscInsensitiveFn } from '@helpers4/array';
import { RUN } from '../../scripts/bench';
// Mix of strings with and without embedded numbers
const mixed = Array.from({ length: 50 }, (_, i) => `item-${50 - i}`);
const weekCodes = ['W52', 'W1', 'W10', 'W9', 'W100', 'W11', 'W2', 'W20', 'W3', 'W50'];

test('natural vs localeCompare', async ({ bench }) => {
  await bench.compare(
    bench('sortStringAscFn (localeCompare)', () => {
      [...mixed].sort(sortStringAscFn);
    }),
    bench('sortStringNaturalAscFn (Intl.Collator numeric)', () => {
      [...mixed].sort(sortStringNaturalAscFn);
    }),
    bench('sortStringAscInsensitiveFn (toLowerCase + localeCompare)', () => {
      [...mixed].sort(sortStringAscInsensitiveFn);
    }),
    bench('sortStringNaturalAscInsensitiveFn (Intl.Collator numeric+base)', () => {
      [...mixed].sort(sortStringNaturalAscInsensitiveFn);
    }),
    bench('week codes — sortStringNaturalAscFn (10 items)', () => {
      [...weekCodes].sort(sortStringNaturalAscFn);
    }),
    bench('week codes — sortStringAscFn (10 items, wrong numeric order)', () => {
      [...weekCodes].sort(sortStringAscFn);
    }),
    RUN,
  );
});
