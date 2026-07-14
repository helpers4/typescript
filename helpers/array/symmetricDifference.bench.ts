/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { symmetricDifference } from './symmetricDifference'

const small = [1, 2, 3]
const large = Array.from({ length: 10_000 }, (_, i) => i)
const largeShifted = Array.from({ length: 10_000 }, (_, i) => i + 5_000)

describe('symmetricDifference', () => {
  bench('small arrays', () => {
    symmetricDifference(small, [2, 3, 4])
  })
  bench('large arrays, half overlap', () => {
    symmetricDifference(large, largeShifted)
  })
  bench('large arrays, identical (empty result)', () => {
    symmetricDifference(large, large)
  })
})
