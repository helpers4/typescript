/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { intersects } from './intersects'

const small = [1, 2, 3, 4, 5]
const large = Array.from({ length: 10_000 }, (_, i) => i)
const largeNoOverlap = Array.from({ length: 10_000 }, (_, i) => i + 10_000)
const largeEarlyMatch = [0, ...Array.from({ length: 9_999 }, (_, i) => i + 10_000)]

describe('intersects', () => {
  bench('small arrays, overlap', () => {
    intersects(small, [3, 4, 5, 6, 7])
  })
  bench('small arrays, no overlap', () => {
    intersects(small, [6, 7, 8, 9, 10])
  })
  bench('large arrays, no overlap (worst case for Set cost)', () => {
    intersects(large, largeNoOverlap)
  })
  bench('large arrays, early match in a (Set pays full cost, short-circuits quickly)', () => {
    intersects(largeEarlyMatch, large)
  })
  bench('large arrays, full overlap', () => {
    intersects(large, large)
  })
})
