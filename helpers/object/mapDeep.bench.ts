/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { mapDeep } from './mapDeep';

const shallow = { a: 1, b: 2, c: 3 };
const nested = { a: 1, b: { c: 2, d: { e: 3 } }, f: [1, 2, 3] };
const large = {
  items: Array.from({ length: 100 }, (_, i) => ({ id: i, value: i * 2 })),
};
const upper = (key: string) => key.toUpperCase();
const double = (value: unknown) => (typeof value === 'number' ? value * 2 : value);

describe('mapDeep', () => {
  bench('shallow object, mapValue only', () => {
    mapDeep(shallow, double);
  });
  bench('nested object (3 levels), mapValue only', () => {
    mapDeep(nested, double);
  });
  bench('nested object, mapKey only', () => {
    mapDeep(nested, undefined, upper);
  });
  bench('nested object, both mapValue and mapKey', () => {
    mapDeep(nested, double, upper);
  });
  bench('large array of objects (100 items)', () => {
    mapDeep(large, double);
  });
  bench('identity (no callbacks)', () => {
    mapDeep(nested);
  });
});
