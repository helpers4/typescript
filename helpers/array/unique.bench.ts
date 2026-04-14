/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, bench } from 'vitest'

import { unique } from './unique'

const small = [1, 2, 3, 2, 1, 4, 5, 3]
const medium = Array.from({ length: 200 }, (_, i) => i % 100)
const noDupes = Array.from({ length: 100 }, (_, i) => i)

describe('unique', () => {
  bench('small array with duplicates (8 items)', () => {
    unique(small)
  })
  bench('medium array 50% duplicates (200 items)', () => {
    unique(medium)
  })
  bench('no duplicates (100 items)', () => {
    unique(noDupes)
  })
})
