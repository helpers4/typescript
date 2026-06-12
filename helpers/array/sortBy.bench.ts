/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { createSortByNumberFn, createSortByStringFn } from './sortBy';

const objects = Array.from({ length: 50 }, (_, i) => ({
  dept: i % 5 === 0 ? 'A' : i % 3 === 0 ? 'B' : 'C',
  label: `item-${50 - i}`,
  value: 50 - i,
}));

const sortByLabel = createSortByStringFn<typeof objects[number]>('label');
const sortByDeptThenLabel = createSortByStringFn<typeof objects[number]>(['dept', 'label']);
const sortByValue = createSortByNumberFn<typeof objects[number]>('value');

describe('sortBy', () => {
  bench('createSortByStringFn — single key (50 items)', () => {
    [...objects].sort(sortByLabel);
  });
  bench('createSortByStringFn — multi-key [dept, label] (50 items)', () => {
    [...objects].sort(sortByDeptThenLabel);
  });
  bench('createSortByNumberFn (50 items)', () => {
    [...objects].sort(sortByValue);
  });
});
