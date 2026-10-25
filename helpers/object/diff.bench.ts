/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { diff } from '@helpers4/object';
import { RUN, consume } from '../../scripts/bench';

const objA = { a: 1, b: { c: 2, d: { e: 3 } }, f: [1, 2, 3] };
const objB = { a: 1, b: { c: 2, d: { e: 3 } }, f: [1, 2, 3] };
const objC = { a: 1, b: { c: 99, d: { e: 3 } }, f: [1, 2, 3], g: 'extra' };
const large = Object.fromEntries(Array.from({ length: 50 }, (_, i) => [`key${i}`, i]));

test('diff', async ({ bench }) => {
  await bench.compare(
    bench('identical objects', () => {
      consume(diff(objA, objB));
    }),
    bench('objects with differences', () => {
      consume(diff(objA, objC));
    }),
    bench('same reference', () => {
      consume(diff(objA, objA));
    }),
    bench('null inputs', () => {
      consume(diff(null, null));
    }),
    bench('large flat objects (50 keys)', () => {
      consume(diff(large, { ...large }));
    }),
    bench('with dates', () => {
      const d = new Date();
      consume(diff({ date: d }, { date: new Date(d.getTime()) }));
    }),
    RUN,
  );
});
