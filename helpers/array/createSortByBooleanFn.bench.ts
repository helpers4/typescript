/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { createSortByBooleanFn } from './createSortByBooleanFn'

interface Row {
  readonly isDefault: boolean
}

const rows: Row[] = Array.from({ length: 1_000 }, (_, i) => ({ isDefault: i % 3 === 0 }))
const sortFn = createSortByBooleanFn<Row>('isDefault')

describe('createSortByBooleanFn', () => {
  bench('sort 1000 rows by boolean property', () => {
    [...rows].sort(sortFn)
  })
  bench('build the comparator (no sort)', () => {
    createSortByBooleanFn<Row>('isDefault')
  })
})
