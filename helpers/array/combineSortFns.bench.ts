/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { combineSortFns } from './combineSortFns'

interface Row {
  readonly a: number
  readonly b: number
}

const rows: Row[] = Array.from({ length: 1_000 }, (_, i) => ({
  a: i % 10,
  b: 1_000 - i,
}))

const byA = (x: Row, y: Row): number => x.a - y.a
const byB = (x: Row, y: Row): number => x.b - y.b
const combined = combineSortFns(byA, byB)

describe('combineSortFns', () => {
  bench('combine two comparators, sort 1000 rows (many ties on first key)', () => {
    [...rows].sort(combined)
  })
  bench('build the combined comparator (no sort)', () => {
    combineSortFns(byA, byB)
  })
})
