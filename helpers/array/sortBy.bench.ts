/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { createSortByDateFn, createSortByNumberFn, createSortByStringFn } from './sortBy';

const objects = Array.from({ length: 50 }, (_, i) => ({
  dept: i % 5 === 0 ? 'A' : i % 3 === 0 ? 'B' : 'C',
  label: `item-${50 - i}`,
  value: 50 - i,
  date: new Date(2020, 0, i + 1),
}));

type Row = typeof objects[number];

const sortByLabel = createSortByStringFn<Row>('label');
const sortByDeptThenLabel = createSortByStringFn<Row>(['dept', 'label']);
const sortByValue = createSortByNumberFn<Row>('value');
const sortByDate = createSortByDateFn<Row>('date');

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
  bench('createSortByDateFn (50 Date objects)', () => {
    [...objects].sort(sortByDate);
  });
});
