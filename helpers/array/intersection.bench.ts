/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, bench } from 'vitest'

import { intersection } from './intersection'

const small = [1, 2, 3, 4, 5]
const medium = Array.from({ length: 100 }, (_, i) => i)
const overlap = Array.from({ length: 100 }, (_, i) => i + 50)

describe('intersection', () => {
  bench('small arrays (5 items)', () => {
    intersection(small, [3, 4, 5, 6, 7])
  })
  bench('medium arrays (100 items, 50% overlap)', () => {
    intersection(medium, overlap)
  })
  bench('no overlap', () => {
    intersection(small, [6, 7, 8, 9, 10])
  })
  bench('complete overlap', () => {
    intersection(small, [1, 2, 3, 4, 5])
  })
})
