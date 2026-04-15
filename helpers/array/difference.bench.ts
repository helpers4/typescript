/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { difference } from './difference'

const small = [1, 2, 3, 4, 5]
const medium = Array.from({ length: 100 }, (_, i) => i)
const overlap = Array.from({ length: 100 }, (_, i) => i + 50)

describe('difference', () => {
  bench('small arrays (5 items)', () => {
    difference(small, [3, 4, 5, 6, 7])
  })
  bench('medium arrays (100 items, 50% overlap)', () => {
    difference(medium, overlap)
  })
  bench('no overlap', () => {
    difference(small, [6, 7, 8, 9, 10])
  })
  bench('complete overlap', () => {
    difference(small, small)
  })
})
