/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { cloneDeep } from '@helpers4/object';
import { RUN, consume } from '../../scripts/bench';

const shallow = { a: 1, b: 'hello', c: true };
const nested = { a: 1, b: { c: 2, d: { e: 3 } }, f: [1, 2, 3] };
const withDates = { a: new Date(), b: { c: new Date() } };
const large = Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`key${i}`, { value: i }]));

test('cloneDeep', async ({ bench }) => {
  await bench.compare(
    bench('shallow object', () => {
      consume(cloneDeep(shallow));
    }),
    bench('nested object (3 levels)', () => {
      consume(cloneDeep(nested));
    }),
    bench('object with dates', () => {
      consume(cloneDeep(withDates));
    }),
    bench('large object (100 keys)', () => {
      consume(cloneDeep(large));
    }),
    bench('array of objects', () => {
      consume(cloneDeep([{ a: 1 }, { b: 2 }, { c: 3 }]));
    }),
    bench('null input', () => {
      consume(cloneDeep(null));
    }),
    RUN,
  );
});
