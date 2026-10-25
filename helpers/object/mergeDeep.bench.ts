/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { mergeDeep } from '@helpers4/object';
import { RUN, consume } from '../../scripts/bench';

const flat = { a: 1, b: 2, c: 3 };
const nested = { a: { b: { c: 1 } }, d: { e: 2 } };
const override = { a: { b: { c: 99 } }, d: { e: 88, f: 77 } };

test('mergeDeep', async ({ bench }) => {
  await bench.compare(
    bench('flat objects', () => {
      consume(mergeDeep(flat, { d: 4, e: 5 }));
    }),
    bench('nested objects (3 levels)', () => {
      consume(mergeDeep(nested, override));
    }),
    bench('multiple sources', () => {
      consume(mergeDeep(flat, { d: 4 }, { e: 5 }, { f: 6 }));
    }),
    bench('no sources', () => {
      consume(mergeDeep(flat));
    }),
    RUN,
  );
});
